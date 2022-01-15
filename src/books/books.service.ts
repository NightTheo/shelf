import {Inject, Injectable} from '@nestjs/common';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './domain/book';
import {BookRepositoryImp} from "./repository/book.repository.imp";

@Injectable()
export class BooksService {

  @Inject()
  private readonly bookRepository: BookRepositoryImp;

  async add(book: Book): Promise<Book> {
    return await this.bookRepository.save(book);
  }

  async findAll(): Promise<Book[]> {
    return await this.bookRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} book`;
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    return `This action updates a #${id} book`;
  }

  remove(id: number) {
    return `This action removes a #${id} book`;
  }
}
