import { Library } from '../library/library';
import { LibraryId } from '../library-id/library-id';

export interface LibraryRepository {
  save(library: Library): Promise<void>;
  delete(libraryId: LibraryId): void;
  findAll(): Promise<Library[]>;
  findOne(libraryId: LibraryId): Promise<Library>;
}
