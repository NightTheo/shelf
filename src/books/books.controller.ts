import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BooksService } from './books.service';
import { AddBookDto } from './dto/add-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import {AddBookDtoToBookAdapter} from "./adapters/add-book-dto-to-book.adapter";
import {AddedBookDto} from "./dto/added-book.dto";
import {BookDomainToAddedBookDtoAdapter} from "./adapters/book-domain-to-added-book-dto.adapter";
import {Book} from "./domain/book";

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  async add(@Body() addBookDto: AddBookDto): Promise<AddedBookDto>{
    const toDomain = AddBookDtoToBookAdapter;
    const toDto = BookDomainToAddedBookDtoAdapter;
    const bookDomain = toDomain.of(addBookDto);
    const addedBook = await this.booksService.add(bookDomain);
    return toDto.of(addedBook);
  }

  @Get()
  async findAll(): Promise<AddedBookDto[]> {
    const booksDomain: Book[] = await this.booksService.findAll();
    const adapter = BookDomainToAddedBookDtoAdapter;
    return booksDomain.map(book => adapter.of(book));
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
