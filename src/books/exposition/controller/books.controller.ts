import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  HttpCode,
  NotFoundException,
  UnprocessableEntityException,
  UploadedFile,
  UseInterceptors,
  Response,
  StreamableFile,
  Req,
} from '@nestjs/common';
import { BooksService } from '../../application/books.service';
import { AddBookDto } from '../../dto/add-book.dto';
import { UpdateBookDto } from '../../dto/update-book.dto';
import { Book } from '../../domain/book';
import { Isbn } from '../../domain/isbn';
import { GetBookDto } from '../../dto/get-book.dto';
import { BookExceptionFilter } from '../filters/book-exception.filter';
import { GetBookDtoAdapter } from '../../adapters/get-book-dto.adapter';
import { BufferFile } from './buffer-file';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { HttpUtils } from '../../../utils/http.utils';
import { BookCover } from '../../domain/book-cover';
import { FilesUtils } from '../../../utils/files/files.utils';
import { FileName } from '../../persistence/file-name';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @HttpCode(201)
  @UseFilters(new BookExceptionFilter())
  @UseInterceptors(FileInterceptor('picture'))
  async add(
    @Body() addBookDto: AddBookDto,
    @UploadedFile() coverImage: BufferFile,
  ): Promise<any> {
    // TODO gérer le cas d'un fichier vide ou corrompu
    const isbn: string = await this.booksService.add(addBookDto, coverImage);
    return {
      isbn: isbn,
    };
  }

  @Get()
  async findAll(): Promise<GetBookDto[]> {
    return (await this.booksService.findAll()).map((book) =>
      GetBookDtoAdapter.from(book),
    );
  }

  @Get(':isbn')
  @UseFilters(new BookExceptionFilter())
  async findOne(
    @Param('isbn') isbn: string,
    @Req() request: Request,
  ): Promise<GetBookDto> {
    // TODO exporter cette vérification dans le service
    const book: Book = await this.booksService.findOne(new Isbn(isbn));
    if (!book) {
      throw new NotFoundException('Book Not Found');
    }
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
