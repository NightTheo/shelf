import { IsbnFormatException } from './IsbnFormatException';
import { IsbnFormatFactory } from './isbn-format.factory';

export class Isbn {
  private readonly _value: string;
  private readonly version: number = +process.env.ISBN_VERSION || 13;

  constructor(isbn: string) {
    const isbnFormat: RegExp = IsbnFormatFactory.get(this.version);
    const found = String(isbn).match(isbnFormat);
    if (!found) {
      throw new IsbnFormatException(
        `ISBN-${this.version} format is: 'aaa-b-cc-dddddd-e' (with or without dashes). Error with '${isbn}'`,
      );
    }
    this._value = found.slice(1).join('');
  }

  get value(): string {
    return this._value;
  }
}
