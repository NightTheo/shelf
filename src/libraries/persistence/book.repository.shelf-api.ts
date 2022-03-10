import { BookRepository } from '../domain/repositories/book.repository';
import { Book } from '../domain/book/book';
import axios from 'axios';
import { BookAdapter } from '../adapters/book.adapter';
import { ShelfUrlFactory } from '../../shared/http/shelf-url.factory';

export class BookRepositoryShelfApi implements BookRepository {
  async findOne(isbn: string): Promise<Book> {
    const url: string = ShelfUrlFactory.getEndPoint('books');
    const res = await axios.get(`${url}/${isbn}`);
    return BookAdapter.fromDto(res?.data);
  }
}
