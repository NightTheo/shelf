import { Isbn } from './isbn';
import { BookTitle } from './book-title';
import { Author } from './author';
import { BookOverview } from './book-overview';
import { BookCover } from './book-cover';
import { Book } from './book';
import { FileLocation } from '../../shared/files/file-location';

export class BookBuilder {
  private _isbn: Isbn;
  private _title: BookTitle;
  private _author: Author;
  private _overview: BookOverview;
  private _readCount: number;
  private _cover: BookCover;

  public isbn(isbn: string) {
    this._isbn = new Isbn(isbn.trim());
    return this;
  }

  public title(title: string) {
    this._title = new BookTitle(title?.trim());
    return this;
  }

  public author(author: string) {
    this._author = new Author(author?.trim());
    return this;
  }

  public overview(overview: string) {
    this._overview = new BookOverview(overview?.trim());
    return this;
  }

  public readCount(readCount: number) {
    const readCountIsValid: boolean = readCount && readCount >= 0;
    this._readCount = readCountIsValid ? readCount : 1;
    return this;
  }

  public cover(picture: Buffer, location: string) {
    this._cover = new BookCover(picture, new FileLocation(location));
    return this;
  }

  public build(): Book {
    return new Book(
      this._isbn,
      this._title,
      this._author,
      this._overview,
      this._readCount,
      this._cover,
    );
  }
}
