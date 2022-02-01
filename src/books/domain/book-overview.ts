export class BookOverview {
  private readonly _value: string;

  constructor(overview: string) {
    this._value = overview;
  }

  get value(): string {
    return this._value;
  }
}
