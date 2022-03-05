import { IsbnFormatFactory } from '../../../shared/isbn/isbn-format.factory';
import { IsbnFormatException } from '../../../shared/isbn/isbn-format.exception';

export class Book {
  private _isbn: string;
  private readonly title: string;
  private readonly author: string;

  constructor(isbn: string, title: string, author: string) {
    this.isbn = isbn;
    this.title = title;
    this.author = author;
  }

  get isbn(): string {
    return this._isbn;
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
