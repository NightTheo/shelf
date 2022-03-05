import { Book } from './book';
import { IsbnFormatException } from '../../../shared/isbn/isbn-format.exception';

describe('Book', () => {
  it('should create a book', () => {
    const book: Book = new Book('978-2221252055', 'Dune', 'Frank Herbert');
    expect(book.isbn).toEqual('978-2-2212-5205-5');
  });

  it('should throw an IsbnFormatException', () => {
    expect(() => {
      new Book('978', 'Dune', 'Frank Herbert');
    }).toThrow(IsbnFormatException);
  });

  it('should create a book without title or author', () => {
    const book: Book = new Book('978-2221252055');
    expect(book.isbn).toEqual('978-2-2212-5205-5');
  });
});
