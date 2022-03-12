import { Library } from '../domain/library/library';
import { GetLibraryDto } from '../dto/get-library.dto';

export class GetLibraryDtoAdapter {
  static adapt(library: Library): GetLibraryDto {
    return {
      id: library.id.value,
      name: library.name.value,
      books: library.books.map((book) => {
        return {
          isbn: book.isbn,
          title: book.title,
          author: book.author,
          url: undefined,
        };
      }),
    };
  }
}
