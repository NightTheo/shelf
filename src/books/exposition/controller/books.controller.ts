import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  Response,
  StreamableFile,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { BooksService } from '../../application/books.service';
import { AddBookDto } from '../../dto/add-book.dto';
import { UpdateBookDto } from '../../dto/update-book.dto';
import { Book } from '../../domain/book';
import { GetBookDto } from '../../dto/get-book.dto';
import { BookExceptionFilter } from '../filters/book-exception.filter';
import { GetBookDtoAdapter } from '../../adapters/get-book-dto.adapter';
import { BufferFile } from '../../../shared/files/buffer-file';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { HttpUtils } from '../../../shared/http/http.utils';
import { BookCover } from '../../domain/book-cover';
import { FileName } from '../../../shared/files/file-name';
import { FileFormatFilter } from '../../../shared/files/file-format-filter/file-format.filter';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @HttpCode(201)
  @UseFilters(new BookExceptionFilter())
  @UseInterceptors(
    FileInterceptor('picture', {
      fileFilter: FileFormatFilter.of(['jpg', 'png', 'gif', 'svg']),
    }),
  )
  async add(
    @Body() addBookDto: AddBookDto,
    @UploadedFile() coverImage: BufferFile,
    @Req() request: Request,
  ): Promise<any> {
    await this.booksService.add(addBookDto, coverImage);
    return {
      url:
        HttpUtils.getFullUrlOf(request) +
        '/' +
        addBookDto.isbn.split('-').join(''),
    };
  }

  @Get()
  async findAll(@Req() request: Request): Promise<GetBookDto[]> {
    return (await this.booksService.findAll()).map((book) => {
      const dto: GetBookDto = GetBookDtoAdapter.forCollection(book);
      return {
        ...dto,
        url: HttpUtils.getFullUrlOf(request) + '/' + dto.isbn,
      };
    });
  }

  @Get(':isbn')
  @UseFilters(new BookExceptionFilter())
  async findOne(
    @Param('isbn') isbn: string,
    @Req() request: Request,
  ): Promise<GetBookDto> {
    const book: Book = await this.booksService.findOne(isbn);
    const dto = GetBookDtoAdapter.from(book);
    if (book.cover.exists()) {
      dto.picture = HttpUtils.getFullUrlOf(request) + '/cover';
    }
    return dto;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(+id, updateBookDto);
  }

  @HttpCode(204)
  @UseFilters(new BookExceptionFilter())
  @Delete(':isbn')
  async remove(@Param('isbn') isbn: string) {
    await this.booksService.remove(isbn);
  }

  @Get(':isbn/cover')
  @UseFilters(new BookExceptionFilter())
  async findPicture(
    @Response({ passthrough: true }) res,
    @Param('isbn') isbn: string,
  ): Promise<StreamableFile> {
    const cover: BookCover = await this.booksService.findPictureByIsbn(isbn);
    const fileName: FileName = FileName.fromLocation(cover.location);
    fileName.base = isbn;
    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Disposition': `attachment; filename="${fileName.toString()}"`,
    });
    return new StreamableFile(<Buffer>cover.file);
  }
}
