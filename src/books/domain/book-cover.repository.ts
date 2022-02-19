import { BookCover } from './book-cover';

export interface BookCoverRepository {
  save(bookCover: BookCover): void;
}
