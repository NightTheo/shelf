import { Book } from './book';
import { Isbn } from './isbn/isbn';
import { FileLocation } from '../../shared/files/file-location';

export interface BookRepository {
  save(book: Book): void;
  findOne(isbn: Isbn): Promise<Book>;
  find(): Promise<Book[]>;
  findBy(): Promise<Book[]>;
  update(book: Book): Promise<Book>;
  delete(isbn: Isbn): void;
  findCoverLocation(isbn: Isbn): Promise<FileLocation>;
  exists(isbn: Isbn);
}
