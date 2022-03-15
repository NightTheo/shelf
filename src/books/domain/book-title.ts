export class BookTitle {
  private readonly _value: string;

  constructor(title: string) {
    this._value = title;
  }

  get value(): string {
    return this._value;
  }
}
