import { Test, TestingModule } from '@nestjs/testing';
import { LibrariesService } from './libraries.service';
import { LibraryRepositoryTypeORM } from '../persistence/library.repository.typeorm';
import { Library } from '../domain/library/library';
import { LibraryId } from '../domain/library-id/library-id';
import { Book } from '../domain/book/book';
import { BookRepositoryShelfApi } from '../persistence/book.repository.shelf-api';
import { BookNotFoundException } from './exceptions/book.not-found.exception';
import { BookConflictException } from '../domain/exceptions/book.conflict.exception';
import { LibraryNotFoundException } from './exceptions/library.not-found.exception';

describe('LibrariesService', () => {
  let service: LibrariesService;

  const mockLibraryRepositoryTypeORM = {
    create: jest.fn().mockImplementation((library: Library) => {
      mockLibrariesStorage.set(library.id.value, library);
    }),
    findOne: jest.fn((id: LibraryId) => mockLibrariesStorage.get(id.value)),
    save: jest
      .fn()
      .mockImplementation((library: Library) =>
        mockLibrariesStorage.set(library.id.value, library),
      ),
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
    findOne: jest.fn((isbn: string) => {
      isbn = isbn.split('-').join('');
      /*if (!mockBookStorage.has(isbn)) {
        throw new BookNotFoundException(isbn);
      }*/
      return mockBookStorage.get(isbn);
    }),
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
    const createdLibraryId: LibraryId = await service.createWithListOfIsbn();
    expect(mockLibrariesStorage.has(createdLibraryId.value)).toBeTruthy();
  });

  it('should create a new library with three books', async () => {
    const isbnList: string[] = [
      '978-2221252055', // Dune - Herbert
      '9782070411610', // L'Étranger - Camus
      '978-2-2900-3272-5', // Des fleurs pour Algernon - Keyes
    ];
    const id: LibraryId = await service.createWithListOfIsbn(isbnList);
    const created: Library = mockLibrariesStorage.get(id.value);
    expect(created.has(new Book('978-2221252055'))).toBeTruthy();
    expect(created.has(new Book('9782070411610'))).toBeTruthy();
    expect(created.has(new Book('978-2-2900-3272-5'))).toBeTruthy();
  });

  it('should throw a BookNotFoundException', () => {
    const unknownIsbn = ['000-0000000000'];
    expect(() => service.createWithListOfIsbn(unknownIsbn)).rejects.toThrow(
      BookNotFoundException,
    );
    expect(() => service.createWithListOfIsbn(unknownIsbn)).rejects.toThrow(
      '000-0000000000',
    );
  });

  it('should throw a BookConflictException when create a library with duplicate isbn', () => {
    const duplicateIsbnList: string[] = [
      '978-2221252055', // Dune - Herbert
      '9782221252055', // Dune - Herbert
    ];
    expect(() =>
      service.createWithListOfIsbn(duplicateIsbnList),
    ).rejects.toThrow(BookConflictException);
  });

  it('should add books in a library', async () => {
    // given an existing library and the existing book 'Dune'
    const existingLibrary: Library = new Library(new LibraryId(), []);
    const libraryUuid: string = existingLibrary.id.value;
    mockLibrariesStorage.set(libraryUuid, existingLibrary);
    const bookToAdd: Book = mockBookStorage.get('9782221252055');

    // when add the book in the library
    await service.addBooksInLibrary(['9782221252055'], libraryUuid);

    expect(mockLibrariesStorage.get(libraryUuid).has(bookToAdd)).toBeTruthy();
  });

  it("should throw a LibraryNotFoundException when add books when library uuid doesn't exists", () => {
    const notExistingId: LibraryId = LibraryId.withValue(
      '00000000-0000-0000-0000-000000000000',
    );
    expect(
      async () =>
        await service.addBooksInLibrary(['9782221252055'], notExistingId.value),
    ).rejects.toThrow(LibraryNotFoundException);
  });
});
