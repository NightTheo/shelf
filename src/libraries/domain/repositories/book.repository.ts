import { Book } from '../book/book';

export interface BookRepository {
  findOne(isbn: string): Promise<Book>;
}
