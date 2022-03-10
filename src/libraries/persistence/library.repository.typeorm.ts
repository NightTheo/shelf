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

  async save(library: Library): Promise<void> {
    const libraryEntity: LibraryEntity = {
      id: library.id.value,
      books: JSON.stringify(library.books.map((book: Book) => book.isbn)),
    };
    await this.typeorm.save(libraryEntity);
  }

  async delete(libraryId: LibraryId): Promise<void> {
    await this.typeorm.delete(libraryId.value);
  }

  async findAll(): Promise<Library[]> {
    return (await this.typeorm.find()).map((library) =>
      LibraryAdapter.fromEntity(library),
    );
  }

  async findOne(libraryId: LibraryId): Promise<Library> {
    const library: LibraryEntity = await this.typeorm.findOne(libraryId.value);
    return library ? LibraryAdapter.fromEntity(library) : null;
  }
}
