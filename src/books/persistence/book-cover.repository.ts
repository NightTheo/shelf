import { BookCover } from '../domain/book-cover';
import { FileLocation } from '../../shared/files/file-location';

export interface BookCoverRepository {
  bookCoverDirectory: string;
  save(bookCover: BookCover): Promise<FileLocation>;
  findAt(location: FileLocation): Promise<BookCover>;
  delete(coverLocation: FileLocation);
}
