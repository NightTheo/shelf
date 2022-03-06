import { IsbnFormatFactory } from '../../../shared/isbn/isbn-format.factory';
import { IsbnFormatException } from '../../../shared/isbn/isbn-format.exception';

export class Book {
  private _isbn: string;
  private readonly _title: string;
  private readonly _author: string;

  constructor(isbn: string, title?: string, author?: string) {
    this.isbn = isbn;
    this._title = title;
    this._author = author;
  }

  get isbn(): string {
    return this._isbn;
  }

  get title(): string {
    return this._title;
  }

  get author(): string {
    return this._author;
  }

  set isbn(value: string) {
    const isbnVersion: number = 13;
    const format: RegExp = IsbnFormatFactory.get(isbnVersion);
    const matched: RegExpMatchArray = String(value).match(format);
    if (!matched) {
      throw new IsbnFormatException(
        `Incorrect ISBN-${isbnVersion} format with ${value}.`,
      );
    }
    this._isbn = matched.slice(1).join('-');
  }
}
