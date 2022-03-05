import { BookRepository } from '../domain/repositories/book.repository';
import { Book } from '../domain/book/book';

export class BookRepositoryShelfApi implements BookRepository {
  findOne(isbn: string): Promise<Book> {
    return Promise.resolve(undefined);
  }
}
