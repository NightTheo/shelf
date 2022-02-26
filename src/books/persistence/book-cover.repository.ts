import { BookCover } from '../domain/book-cover';
import { FileLocation } from './file-location';

export interface BookCoverRepository {
  save(bookCover: BookCover): FileLocation;
  findAt(location: FileLocation): Promise<BookCover>;
  delete(coverLocation: FileLocation);
}
