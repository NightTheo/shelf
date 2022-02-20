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
import { createReadStream } from 'fs';

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
    const existingBook = await this.booksService.findOne(
      new Isbn(addBookDto.isbn),
    );
    if (existingBook) {
      throw new UnprocessableEntityException(
        `The book with the ISBN ${addBookDto.isbn} already exists.`,
      );
    }
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
  async findOne(@Param('isbn') isbn: string): Promise<GetBookDto> {
    const book: Book = await this.booksService.findOne(new Isbn(isbn));
    if (book) {
      return GetBookDtoAdapter.from(book);
    } else {
      throw new NotFoundException('Book Not Found');
    }
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
  findPicture(
    @Response({ passthrough: true }) res,
    @Param('isbn') isbn: string,
  ): StreamableFile {
    const cover = createReadStream(
      process.cwd() + `/storage/books/cover/${isbn}.jpg`,
    );
    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Disposition': `attachment; filename="${isbn}.jpg"`,
    });
    return new StreamableFile(cover);
  }
}
