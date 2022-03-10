import { Isbn } from './isbn/isbn';

export interface LibraryRepository {
  removeBookFromAllLibraries(isbn: Isbn): Promise<void>;
}
