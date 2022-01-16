import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BooksService } from './books.service';
import { AddBookDto } from './dto/add-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import {AddBookDtoToBookAdapter} from "./adapters/add-book-dto-to-book.adapter";
import {AddedBookDto} from "./dto/added-book.dto";
import {BookDomainToAddedBookDtoAdapter} from "./adapters/book-domain-to-added-book-dto.adapter";
import {Book} from "./domain/book";
import {UnprocessableEntityException} from "@nestjs/common";


@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  async add(@Body() addBookDto: AddBookDto): Promise<AddedBookDto>{
    const bookDomain: Book = AddBookDtoToBookAdapter.from(addBookDto);
    const IsbnIsNotNumeric: boolean = isNaN(+bookDomain.isbn.value);
    if(IsbnIsNotNumeric) {
      throw new UnprocessableEntityException("The ISBN-13 should be a numeric identification key as aaa-b-cccc-dddd-e");
    }

    const addedBook: Book = await this.booksService.add(bookDomain);
    return BookDomainToAddedBookDtoAdapter.from(addedBook);
  }

  @Get()
  async findAll(): Promise<AddedBookDto[]> {
    const booksDomain: Book[] = await this.booksService.findAll();
    const adapter = BookDomainToAddedBookDtoAdapter;
    return booksDomain.map(book => adapter.from(book));
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
