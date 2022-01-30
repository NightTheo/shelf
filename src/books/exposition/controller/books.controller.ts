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
  NotFoundException
} from '@nestjs/common';
import { BooksService } from '../../application/books.service';
import { AddBookDto } from '../../dto/add-book.dto';
import { UpdateBookDto } from '../../dto/update-book.dto';
import {AddedBookDto} from "../../dto/added-book.dto";
import {BookDomainToAddedBookDtoAdapter} from "../../adapters/book-domain-to-added-book-dto.adapter";
import {Book} from "../../domain/book";
import {AddBookExceptionFilter} from "../filters/add-book-exception.filter";
import { Isbn } from 'src/books/domain/isbn';


@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @HttpCode(201)
  @UseFilters(new AddBookExceptionFilter())
  async add(@Body() addBookDto: AddBookDto): Promise<any>{
    const isbn: string = await this.booksService.add(addBookDto);
    return {
      isbn: isbn
    }
  }

  @Get()
  async findAll(): Promise<AddedBookDto[]> {
    const booksDomain: Book[] = await this.booksService.findAll();
    return booksDomain.map(book => BookDomainToAddedBookDtoAdapter.of(book));
  }

  @Get(':id')
  @UseFilters(new AddBookExceptionFilter())
  async findOne(@Param('id') id: string): Promise<AddedBookDto>{
    const isbn = new Isbn(id)

    const book: Book = await this.booksService.findOne(isbn);

    if(book) {
      return BookDomainToAddedBookDtoAdapter.of(book);
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
