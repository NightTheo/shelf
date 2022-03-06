import { LibraryId } from '../library-id/library-id';
import { BookConflictException } from '../exceptions/book.conflict.exception';
import { Book } from '../book/book';
import { BookNotFoundException } from '../../application/exceptions/book.not-found.exception';

export class Library {
  private readonly _id: LibraryId;
  private readonly books: Map<string, Book> = new Map<string, Book>();

  constructor(id?: LibraryId, books: Book[] = []) {
    this._id = id ? id : new LibraryId();
    books.forEach((book) => this.add(book));
  }

  get id(): LibraryId {
    return this._id;
  }

  add(book: Book) {
    if (this.has(book)) {
      throw new BookConflictException(book.isbn);
    }
    this.books.set(book.isbn, book);
  }

  has(book: Book): boolean {
    const isbn: string = book.isbn;
    return this.books.has(isbn);
  }

  remove(book: Book) {
    if (!this.has(book)) {
      throw new BookNotFoundException(book.isbn);
    }
    this.books.delete(book.isbn);
  }
}
