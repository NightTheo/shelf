import { Library } from './library';
import { LibraryId } from '../library-id';
import { Book } from '../book';
import { BookConflictException } from '../exceptions/book.conflict.exception';

describe('Library', () => {
  it('should create a library', () => {
    const library: Library = new Library(new LibraryId(), [
      new Book('978-2221252055', 'Dune', 'Frank Herbert'),
    ]);
    expect(library).toEqual({
      id: expect.any(LibraryId),
      books: expect.any(Object),
    });
  });

  it('should create an empty library', () => {
    const library: Library = new Library(new LibraryId());
    expect(library).toEqual({
      id: expect.any(LibraryId),
      books: {},
    });
  });

  it('should add a book', () => {
    const library: Library = new Library(new LibraryId());
    library.add(new Book('978-2221252055', 'Dune', 'Frank Herbert'));
  });

  it('should not add a book already in the library', async () => {
    const library: Library = new Library(new LibraryId());
    library.add(new Book('978-2221252055', 'Dune', 'Frank Herbert'));
    expect(() => {
      library.add(new Book('978-2221252055', 'Dune', 'Frank Herbert'));
    }).toThrow(BookConflictException);
  });
});
