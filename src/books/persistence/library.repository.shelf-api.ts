import { LibraryRepository } from '../domain/library.repository';
import { Isbn } from '../domain/isbn/isbn';

export class LibraryRepositoryShelfApi implements LibraryRepository {
  removeBookFromAllLibraries(isbn: Isbn): Promise<void> {
    return Promise.resolve(undefined);
  }
}
