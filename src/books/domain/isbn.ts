import axios from 'axios';
import { IsbnFormatException } from './IsbnFormatException';

export class Isbn {
  private readonly _value: string;

  constructor(isbn: string) {
    const found = String(isbn).match(Isbn.format());
    if (!found) {
      throw new IsbnFormatException(
        `ISBN-13 format is: 'aaa-b-cc-dddddd-e' (with or without dashes). Error with '${isbn}'`,
      );
    }

    this._value = found.slice(1).join('');
  }

  get value(): string {
    return this._value;
  }

  async verify(): Promise<boolean> {
    const res = await axios.get(
      'https://www.googleapis.com/books/v1/volumes?q=isbn:' + this.value,
    );
    return res.data.totalItems === 0 ? false : true;
  }

  // ISBN-13 format is: 'aaa-b-cc-dddddd-e', with or without dashes
  static format(): RegExp {
    return /(\d{3})-?(\d{1})-?(\d{2})-?(\d{6})-?(\d{1})/;
  }
}
