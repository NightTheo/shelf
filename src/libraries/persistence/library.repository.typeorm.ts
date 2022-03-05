import { LibraryRepository } from '../domain/library.repository';
import { Library } from '../domain/library/library';
import { LibraryId } from '../domain/library-id';

export class LibraryRepositoryTypeORM implements LibraryRepository {
  create(library: Library): void {}

  delete(libraryId: LibraryId): void {}

  findAll(): Library[] {
    return [];
  }

  findOne(libraryId: LibraryId): Library {
    return undefined;
  }
}
