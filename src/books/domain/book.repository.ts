import { Book } from './book';
import { Isbn } from './isbn';
import { FileLocation } from '../../shared/files/file-location';
import { UpdateBookDto } from '../dto/update-book.dto';

export interface BookRepository {
  save(book: Book): void;
  findOne(isbn: Isbn): Promise<Book>;
  find(): Promise<Book[]>;
  findBy(): Promise<Book[]>;
  delete(isbn: Isbn): void;
  findCoverLocation(isbn: Isbn): Promise<FileLocation>;
  exists(isbn: Isbn);
}
