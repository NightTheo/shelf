import {Controller, Get, Post, Body, Patch, Param, Delete, Catch, UseFilters} from '@nestjs/common';
import { BooksService } from './books.service';
import { AddBookDto } from './exposition/dto/add-book.dto';
import { UpdateBookDto } from './exposition/dto/update-book.dto';
import {AddBookDtoToBookAdapter as toDomain} from "./adapters/add-book-dto-to-book.adapter";
import {AddedBookDto} from "./exposition/dto/added-book.dto";
import {BookDomainToAddedBookDtoAdapter} from "./adapters/book-domain-to-added-book-dto.adapter";
import {Book} from "./domain/book";
import {UnprocessableEntityException} from "@nestjs/common";
import {IsbnFormatException} from "./domain/IsbnFormatException";
import {AddBookExceptionFilter} from "./exposition/filters/add-book-exception.filter";


@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @UseFilters(AddBookExceptionFilter)
  async add(@Body() addBookDto: AddBookDto): Promise<AddedBookDto>{
    let bookDomain: Book;
    throw new UnprocessableEntityException("The ISBN-13 should be a numeric identification key as aaa-b-cccc-dddd-e");
    const addedBook: Book = await this.booksService.add(bookDomain);
    return BookDomainToAddedBookDtoAdapter.of(addedBook);
  }

  @Get()
  async findAll(): Promise<AddedBookDto[]> {
    const booksDomain: Book[] = await this.booksService.findAll();
    return booksDomain.map(book => BookDomainToAddedBookDtoAdapter.of(book));
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
