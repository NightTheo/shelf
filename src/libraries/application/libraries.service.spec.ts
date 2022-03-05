import { Test, TestingModule } from '@nestjs/testing';
import { LibrariesService } from './libraries.service';
import { LibraryRepositoryTypeORM } from '../persistence/library.repository.typeorm';
import { Library } from '../domain/library/library';
import { LibraryId } from '../domain/library-id/library-id';
import { Book } from '../domain/book/book';
import { BookRepositoryShelfApi } from '../persistence/book.repository.shelf-api';

describe('LibrariesService', () => {
  let service: LibrariesService;

  const mockLibraryRepositoryTypeORM = {
    create: jest.fn().mockImplementation((library: Library) => {
      mockLibrariesStorage.set(library.id.value, library);
    }),
    findOne: jest.fn((id: LibraryId) => mockLibrariesStorage.get(id.value)),
  };
  const mockLibrariesStorage: Map<string, Library> = new Map<string, Library>();

  const mockBookStorage: Map<string, Book> = new Map<string, Book>(
    Object.entries({
      '9782221252055': new Book('9782221252055', 'Dune', 'Herbert'),
      '9782070411610': new Book('9782070411610', "L'Étranger", 'Camus'),
      '9782290032725': new Book('9782290032725', 'Algernon', 'Keyes'),
    }),
  );
  const mockBookRepositoryShelfApi = {
    findOne: jest.fn((isbn: string) =>
      mockBookStorage.get(isbn.split('-').join('')),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LibrariesService,
        LibraryRepositoryTypeORM,
        BookRepositoryShelfApi,
      ],
    })
      .overrideProvider(LibraryRepositoryTypeORM)
      .useValue(mockLibraryRepositoryTypeORM)
      .overrideProvider(BookRepositoryShelfApi)
      .useValue(mockBookRepositoryShelfApi)
      .compile();

    service = module.get<LibrariesService>(LibrariesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new empty library', async () => {
    const createdLibraryId: LibraryId = await service.create();
    expect(mockLibrariesStorage.has(createdLibraryId.value)).toBeTruthy();
  });

  it('should create a new library with three books', async () => {
    const isbnList: string[] = [
      '978-2221252055', // Dune - Herbert
      '9782070411610', // L'Étranger - Camus
      '978-2-2900-3272-5', // Des fleurs pour Algernon - Keyes
    ];
    const id: LibraryId = await service.create(isbnList);
    const created: Library = mockLibrariesStorage.get(id.value);
    expect(created.has(new Book('978-2221252055'))).toBeTruthy();
    expect(created.has(new Book('9782070411610'))).toBeTruthy();
    expect(created.has(new Book('978-2-2900-3272-5'))).toBeTruthy();
  });

  // should not have duplicates books in the library
});
