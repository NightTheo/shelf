import { LibraryId } from '../library-id';
import { BookConflictException } from '../exceptions/book.conflict.exception';
import { Book } from '../book';

export class Library {
  private readonly id: LibraryId;
  private readonly books: { [isbn: string]: Book } = {};

  constructor(id: LibraryId, books: Book[] = []) {
    this.id = id;
    books.forEach((book) => this.add(book));
  }

  add(book: Book) {
    if (this.has(book)) {
      throw new BookConflictException(book.isbn);
    }
    this.books[book.isbn.value] = book;
  }

  has(book: Book): boolean {
    const isbn: string = book.isbn.value;
    return this.books[isbn] != null;
  }
}
