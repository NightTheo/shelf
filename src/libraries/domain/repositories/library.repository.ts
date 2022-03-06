import { Library } from '../library/library';
import { LibraryId } from '../library-id/library-id';

export interface LibraryRepository {
  create(library: Library): void;
  save(library: Library): void;
  delete(libraryId: LibraryId): void;
  findAll(): Library[];
  findOne(libraryId: LibraryId): Library;
}
