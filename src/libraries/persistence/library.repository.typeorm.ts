import { LibraryRepository } from '../domain/repositories/library.repository';
import { Library } from '../domain/library/library';
import { LibraryId } from '../domain/library-id/library-id';
import { Book } from '../domain/book/book';

export class LibraryRepositoryTypeORM implements LibraryRepository {
  create(library: Library): void {}

  delete(libraryId: LibraryId): void {}

  findAll(): Library[] {
    return [];
  }

  findOne(libraryId: LibraryId): Library {
    return undefined;
  }

  save(library: Library): void {}
}
