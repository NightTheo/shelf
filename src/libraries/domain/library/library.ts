import { LibraryId } from '../library-id/library-id';
import { BookConflictException } from '../exceptions/book.conflict.exception';
import { Book } from '../book/book';

export class Library {
  private readonly _id: LibraryId;
  private readonly books: { [isbn: string]: Book } = {};

  constructor(id: LibraryId, books: Book[] = []) {
    this._id = id;
    books.forEach((book) => this.add(book));
  }

  get id(): LibraryId {
    return this._id;
  }

  add(book: Book) {
    if (this.has(book)) {
      throw new BookConflictException(book.isbn);
    }
    this.books[book.isbn] = book;
  }

  has(book: Book): boolean {
    const isbn: string = book.isbn;
    return this.books[isbn] != null;
  }
}
