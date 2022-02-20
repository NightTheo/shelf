import { Isbn } from './isbn';
import { BookTitle } from './book-title';
import { Author } from './author';
import { BookOverview } from './book-overview';
import { BookCover } from './book-cover';
import { BookBuilder } from './book.builder';

export class Book {
  private readonly _isbn: Isbn;
  private readonly _title: BookTitle;
  private readonly _author: Author;
  private readonly _overview: BookOverview;
  private _cover: BookCover;
  private readonly _readCount: number;

  constructor(
    isbn: Isbn,
    title: BookTitle,
    author: Author,
    overview: BookOverview,
    readCount: number,
    cover: BookCover,
  ) {
    this._isbn = isbn;
    this._title = title;
    this._author = author;
    this._overview = overview;
    this._cover = cover;
    this._readCount = readCount;
  }

  get isbn(): Isbn {
    return this._isbn;
  }

  get title(): BookTitle {
    return this._title;
  }

  get author(): Author {
    return this._author;
  }

  get overview(): BookOverview {
    return this._overview;
  }

  get readCount(): number {
    return this._readCount;
  }

  get cover(): BookCover {
    return this._cover;
  }

  set cover(cover: BookCover) {
    this._cover = cover;
  }

  static builder(): BookBuilder {
    return new BookBuilder();
  }
}
