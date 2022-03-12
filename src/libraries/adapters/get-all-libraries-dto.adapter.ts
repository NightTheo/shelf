import { Library } from '../domain/library/library';
import { GetAllLibrariesDto } from '../dto/get-all-libraries.dto';

export class GetAllLibrariesDtoAdapter {
  static adapt(library: Library): GetAllLibrariesDto {
    return {
      id: library.id.value,
      name: library.name.value,
      url: undefined,
      book_count: library.bookCount(),
    };
  }
}
