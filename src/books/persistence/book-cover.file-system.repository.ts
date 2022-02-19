import { BookCoverRepository } from '../domain/book-cover.repository';
import { BookCover } from '../domain/book-cover';

export class BookCoverFileSystemRepository implements BookCoverRepository {
  save(bookCover: BookCover): void {}
}
