export class Isbn {
  private readonly _value: string;

  constructor(isbn: string) {
    this._value = isbn;
  }

  get value() {
    return this._value;
  }
}
