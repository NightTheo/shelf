import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BooksService } from './books.service';
import { AddBookDto } from './dto/add-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import {AddBookDtoToBookAdapter} from "./adapters/add-book-dto-to-book.adapter";
import {AddedBookDto} from "./dto/added-book.dto";
import {BookToAddedBookAdapter} from "./adapters/book-to-added-book.adapter";
import {Book} from "./domain/book";
import {map} from "rxjs";

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  async add(@Body() addBookDto: AddBookDto): Promise<AddedBookDto> {
    const book = AddBookDtoToBookAdapter.of(addBookDto);
    book.canBeAdded();
    const addedBook = await this.booksService.add(book);
    return BookToAddedBookAdapter.of(addedBook);
  }

  @Get()
  async findAll() {
    const booksDomain: Book[] = await this.booksService.findAll();
    return booksDomain.map(book => BookToAddedBookAdapter.of(book));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
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
