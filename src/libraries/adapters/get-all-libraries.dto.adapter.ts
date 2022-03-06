import { Library } from '../domain/library/library';
import { GetAllLibrariesDto } from '../dto/get-all-libraries.dto';

export class GetAllLibrariesDtoAdapter {
  static adapt(library: Library): GetAllLibrariesDto {
    return {
      id: library.id.value,
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
