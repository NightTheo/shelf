import { Book } from './book';
import { Isbn } from './isbn';
import { BookCover } from './book-cover';

export interface BookRepository {
  save(book: Book): void;
  findOne(isbn: Isbn): Promise<Book>;
  find(): Promise<Book[]>;
  findBy(): Promise<Book[]>;
  update(book: Book): Promise<Book>;
  delete(isbn: Isbn): void;
}
