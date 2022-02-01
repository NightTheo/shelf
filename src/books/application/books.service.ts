import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { UpdateBookDto } from '../dto/update-book.dto';
import { Book } from '../domain/book';
import {BookRepositoryImp} from "../persistence/book.repository.imp";
import {AddBookDto} from "../dto/add-book.dto";
import { IsbnFormatException } from "../domain/IsbnFormatException";
import { BookEntity } from "../persistence/book.entity";
import { Isbn } from '../domain/isbn';

@Injectable()
export class BooksService {
  @Inject()
  private readonly bookRepository: BookRepositoryImp;

  async add(dto: AddBookDto): Promise<string> {
    const book: Book = Book.builder()
      .isbn(dto.isbn)
      .title(dto.title)
      .author(dto.author)
      .overview(dto.overview)
      .readCount(dto.readCount)
      .build();
    await this.bookRepository.save(book);
    return book.isbn.value;
  }

  async findAll(): Promise<Book[]> {
    return await this.bookRepository.find();
  }

  async findOne(isbn: Isbn): Promise<Book> {
    return await this.bookRepository.findOne(isbn);
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    return `This action updates a #${id} book`;
  }

  async remove(isbn: string) {
    const book: BookEntity = await this.bookRepository.findOne(isbn);
    if(!book){
      throw new NotFoundException();
    }

    this.bookRepository.delete(isbn);
  }
}
