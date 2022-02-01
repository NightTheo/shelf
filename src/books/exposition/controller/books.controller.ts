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
} from '@nestjs/common';
import { BooksService } from '../../application/books.service';
import { AddBookDto } from '../../dto/add-book.dto';
import { UpdateBookDto } from '../../dto/update-book.dto';
import {GetBookDto} from "../../dto/get-book.dto";
import {BookExceptionFilter} from "../filters/book-exception.filter";
import {GetBookDtoAdapter} from "../../adapters/get-book-dto.adapter";


@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @HttpCode(201)
  @UseFilters(new BookExceptionFilter())
  async add(@Body() addBookDto: AddBookDto): Promise<any>{
    const isbn: string = await this.booksService.add(addBookDto);
    return {
      isbn: isbn
    }
  }

  @Get()
  async findAll(): Promise<GetBookDto[]> {
    return (await this.booksService.findAll()).map(book => GetBookDtoAdapter.from(book));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(+id, updateBookDto);
  }

  @Delete(':isbn')
  remove(@Param("isbn") isbn: string) {
    this.booksService.remove(isbn);
  }
}
