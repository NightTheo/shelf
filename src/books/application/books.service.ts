import {Inject, Injectable} from '@nestjs/common';
import { UpdateBookDto } from '../dto/update-book.dto';
import { Book } from '../domain/book';
import { Isbn } from '../domain/isbn';
import {BookRepositoryImp} from "../persistence/book.repository.imp";
import {AddBookDto} from "../dto/add-book.dto";

@Injectable()
export class BooksService {

  @Inject()
  private readonly bookRepository: BookRepositoryImp;

  async add(dto: AddBookDto): Promise<string>{
    const book: Book = Book.builder()
        .isbn(dto.isbn)
        .title(dto.title)
        .author(dto.author)
        .overview(dto.overview)
        .build();
    await this.bookRepository.save(book);
    return book.isbn.value;
  }

  async findAll(): Promise<Book[]> {
    return await this.bookRepository.find();
  }

  async findOne(isbn: Isbn) {
    return await this.bookRepository.findOne(isbn);
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    return `This action updates a #${id} book`;
  }

  remove(id: number) {
    return `This action removes a #${id} book`;
  }
}
