import { LibraryEntity } from '../persistence/library.entity';
import { Library } from '../domain/library/library';
import { LibraryId } from '../domain/library-id/library-id';
import { Book } from '../domain/book/book';

export class LibraryAdapter {
  static fromEntity(library: LibraryEntity): Library {
    const isbnList: string[] = JSON.parse(library.books);
    const books: Book[] = isbnList.map((isbn) => new Book(isbn));
    return new Library(new LibraryId(library.id), books);
  }
}
