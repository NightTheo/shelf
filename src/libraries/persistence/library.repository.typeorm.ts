import { LibraryRepository } from '../domain/repositories/library.repository';
import { Library } from '../domain/library/library';
import { LibraryId } from '../domain/library-id/library-id';
import { Book } from '../domain/book/book';
import { InjectRepository } from '@nestjs/typeorm';
import { LibraryEntity } from './library.entity';
import { Repository } from 'typeorm';
import { LibraryAdapter } from '../adapters/library.adapter';

export class LibraryRepositoryTypeORM implements LibraryRepository {
  constructor(
    @InjectRepository(LibraryEntity)
    private readonly typeorm: Repository<LibraryEntity>,
  ) {}

  create(library: Library): void {}

  delete(libraryId: LibraryId): void {}

  async findAll(): Promise<Library[]> {
    return (await this.typeorm.find()).map((library) =>
      LibraryAdapter.fromEntity(library),
    );
  }

  findOne(libraryId: LibraryId): Library {
    return undefined;
  }

  save(library: Library): void {}
}
