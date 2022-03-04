import { Isbn } from './isbn';

export class Book {
  private readonly _isbn: Isbn;
  private readonly title: string;
  private readonly author: string;

  constructor(isbn: string, title: string, author: string) {
    this._isbn = new Isbn(isbn);
    this.title = title;
    this.author = author;
  }

  get isbn(): Isbn {
    return this._isbn;
  }
}
