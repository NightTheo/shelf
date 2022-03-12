import { Library } from './library';
import { LibraryId } from '../library-id/library-id';
import { Book } from '../book/book';
import { BookConflictException } from '../exceptions/book.conflict.exception';

describe('Library', () => {
  it('should create a library', () => {
    const library: Library = new Library(new LibraryId(), 'library', [
      new Book('978-2221252055', 'Dune', 'Frank Herbert'),
    ]);
    expect(library.id).toBeInstanceOf(LibraryId);
    expect(library.name.value).toEqual('library');
  });

  it('should create an empty library', () => {
    const library: Library = new Library();
    expect(library.id).toBeInstanceOf(LibraryId);
  });

  it('should add a book', () => {
    const library: Library = new Library();
    library.add(new Book('978-2221252055', 'Dune', 'Frank Herbert'));
  });

  it('should not add a book already in the library', async () => {
    const library: Library = new Library();
    library.add(new Book('978-2221252055', 'Dune', 'Frank Herbert'));
    expect(() => {
      library.add(new Book('978-2221252055', 'Dune', 'Frank Herbert'));
    }).toThrow(BookConflictException);
  });

  it('should have a book', async () => {
    const book: Book = new Book('978-2221252055', 'Dune', 'Frank Herbert');
    const library: Library = new Library(new LibraryId(), 'library', [book]);
    expect(library.has(book)).toBeTruthy();
  });

  it('should not have a book', async () => {
    const book: Book = new Book('978-2221252055', 'Dune', 'Frank Herbert');
    const library: Library = new Library();
    expect(library.has(book)).toBeFalsy();
  });

  it('should remove a book', () => {
    const bookToRemove: Book = new Book('9782221252055', 'Dune', 'Herbert');
    const remainingBook: Book = new Book(
      '9782070411610',
      "L'Étranger",
      'Camus',
    );
    const library: Library = new Library(new LibraryId(), 'library', [
      bookToRemove,
      remainingBook,
    ]);
    library.remove(bookToRemove);
    expect(library.has(bookToRemove)).toBeFalsy();
    expect(library.has(remainingBook)).toBeTruthy();
  });

  it('should remove all books', () => {
    const books: Book[] = [
      new Book('9782221252055', 'Dune', 'Herbert'),
      new Book('9782070411610', "L'Étranger", 'Camus'),
      new Book('9782290032725', 'Algernon', 'Keyes'),
    ];
    const library: Library = new Library(new LibraryId(), 'library', books);
    library.removeAllBooks();
    expect(library.has(books[0])).toBeFalsy();
    expect(library.has(books[1])).toBeFalsy();
    expect(library.has(books[2])).toBeFalsy();
  });

  it('should get the number of books in the library', () => {
    const books: Book[] = [
      new Book('9782221252055', 'Dune', 'Herbert'),
      new Book('9782070411610', "L'Étranger", 'Camus'),
      new Book('9782290032725', 'Algernon', 'Keyes'),
    ];
    const library: Library = new Library(new LibraryId(), 'library', books);
    expect(library.bookCount()).toEqual(3);
  });
});
