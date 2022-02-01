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
} from '@nestjs/common';
import { BooksService } from '../../application/books.service';
import { AddBookDto } from '../../dto/add-book.dto';
import { UpdateBookDto } from '../../dto/update-book.dto';
import { Book } from '../../domain/book';
import { Isbn } from '../../domain/isbn';
import { GetBookDto } from '../../dto/get-book.dto';
import { BookExceptionFilter } from '../filters/book-exception.filter';
import { GetBookDtoAdapter } from '../../adapters/get-book-dto.adapter';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @HttpCode(201)
  @UseFilters(new BookExceptionFilter())
  async add(@Body() addBookDto: AddBookDto): Promise<any> {
    const isbn: string = await this.booksService.add(addBookDto);
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

  @Get(':id')
  @UseFilters(new BookExceptionFilter())
  async findOne(@Param('id') id: string): Promise<GetBookDto> {
    const isbn = new Isbn(id);

    const book: Book = await this.booksService.findOne(isbn);

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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }
}
