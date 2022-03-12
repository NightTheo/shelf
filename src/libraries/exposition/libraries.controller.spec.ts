import { Test, TestingModule } from '@nestjs/testing';
import { LibrariesController } from './libraries.controller';
import { LibrariesService } from '../application/libraries.service';
import { Library } from '../domain/library/library';
import { LibraryId } from '../domain/library-id/library-id';
import { Book } from '../domain/book/book';
import { CreateLibraryDto } from '../dto/create-library.dto';
import { UpdateLibraryDto } from '../dto/update-library.dto';
import { GetLibraryDto } from '../dto/get-library.dto';

describe('LibrariesController', () => {
  let controller: LibrariesController;

  const mockLibrariesStorage: Map<string, Library> = new Map<string, Library>();
  const mockLibrariesService = {
    getAll: jest
      .fn()
      .mockImplementation(() => Array.from(mockLibrariesStorage.values())),
    createWithListOfIsbn: jest
      .fn()
      .mockImplementation((name: string, isbnList: string[]) => {
        const newLibrary: Library = isbnList
          ? new Library(
              new LibraryId(),
              name,
              isbnList.map((isbn) => new Book(isbn)),
            )
          : new Library();
        mockLibrariesStorage.set(newLibrary.id.value, newLibrary);
      }),
    delete: jest
      .fn()
      .mockImplementation((id: string) => mockLibrariesStorage.delete(id)),
    update: jest
      .fn()
      .mockImplementation((id: string, name: string, isbnList: string[]) => {
        const old = mockLibrariesStorage.get(id);
        const library: Library = new Library(
          LibraryId.withValue(id),
          name ? name : old.name.value,
          isbnList ? isbnList.map((isbn) => new Book(isbn)) : old.books,
        );
        mockLibrariesStorage.set(id, library);
      }),
    removeBookFromAllLibraries: jest.fn().mockImplementation((isbn: string) => {
      const book: Book = new Book(isbn);
      Array.from(mockLibrariesStorage.values())
        .filter((library: Library) => library.has(book))
        .forEach((library: Library) => {
          library.remove(book);
          mockLibrariesStorage.set(library.id.value, library);
        });
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LibrariesController],
      providers: [LibrariesService],
    })
      .overrideProvider(LibrariesService)
      .useValue(mockLibrariesService)
      .compile();

    controller = module.get<LibrariesController>(LibrariesController);
    mockLibrariesStorage.clear();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get all the books', async () => {
    const library: Library = new Library(new LibraryId(), 'library', [
      new Book('9782221252055', 'Dune', 'Herbert'),
    ]);
    mockLibrariesStorage.set(library.id.value, library);
    const dtos: GetLibraryDto[] = await controller.getAllLibraries();
    expect(dtos).toEqual([
      {
        id: library.id.value,
        name: 'library',
        books: expect.any(Array),
      },
    ]);
    expect(dtos[0].books).toEqual([
      {
        isbn: '978-2-2212-5205-5',
        title: 'Dune',
        author: 'Herbert',
        url: expect.any(String),
      },
    ]);
  });

  it('should create an empty library', async () => {
    await controller.createLibrary({
      name: 'library',
    } as CreateLibraryDto);
    expect(mockLibrariesStorage.size).toEqual(1);
    const [created] = mockLibrariesStorage.keys();
    expect(mockLibrariesStorage.get(created).books).toEqual([]);
  });

  it('should create a library with three books', async () => {
    const dto: CreateLibraryDto = {
      name: 'library',
      books: ['978-2221252055', '9782070411610', '978-2-2900-3272-5'],
    };
    await controller.createLibrary(dto);
    expect(mockLibrariesStorage.size).toEqual(1);
    const [created] = mockLibrariesStorage.keys();
    expect(mockLibrariesStorage.get(created).books).toEqual([
      expect.any(Book),
      expect.any(Book),
      expect.any(Book),
    ]);
  });

  it('should delete a library', async () => {
    const toDelete: Library = new Library();
    mockLibrariesStorage.set(toDelete.id.value, toDelete);
    await controller.delete(toDelete.id.value);
    expect(mockLibrariesStorage.has(toDelete.id.value)).toBeFalsy();
  });

  it('should update a library', async () => {
    const library: Library = new Library();
    mockLibrariesStorage.set(library.id.value, library);
    const dto: UpdateLibraryDto = {
      name: 'newName',
      books: ['978-2221252055', '9782070411610', '978-2-2900-3272-5'],
    };
    await controller.update(library.id.value, dto);
    expect(
      mockLibrariesStorage.get(library.id.value).has(new Book('9782070411610')),
    ).toBeTruthy();
    expect(mockLibrariesStorage.get(library.id.value).name.value).toEqual(
      'newName',
    );
  });

  it('should not update the library name when not given in dto', async () => {
    const library: Library = new Library(
      new LibraryId(),
      'thisNameWillNotBeUpdated',
    );
    mockLibrariesStorage.set(library.id.value, library);
    const dto: UpdateLibraryDto = {
      books: ['978-2221252055'],
    };
    await controller.update(library.id.value, dto);
    expect(mockLibrariesStorage.get(library.id.value).name.value).toEqual(
      'thisNameWillNotBeUpdated',
    );
  });

  it('should not update the library books when not given in dto', async () => {
    const book: Book = new Book('978-2221252055');
    const library: Library = new Library(
      new LibraryId(),
      'thisNameWillBeUpdated',
      [book],
    );
    mockLibrariesStorage.set(library.id.value, library);
    const dto: UpdateLibraryDto = {
      name: 'newName',
    };
    await controller.update(library.id.value, dto);
    expect(mockLibrariesStorage.get(library.id.value).name.value).toEqual(
      'newName',
    );
    expect(mockLibrariesStorage.get(library.id.value).has(book)).toBeTruthy();
  });

  it('should delete a book from all libraries containing it', async () => {
    // Given two libraries with the book 'Dune'
    const bookToRemove: Book = new Book('9782221252055', 'Dune', 'Herbert'); // Dune - Herbert
    const bookRemaining: Book = new Book(
      '9782070411610',
      "L'Étranger",
      'Camus',
    );
    const library1: Library = new Library(new LibraryId(), 'library1', [
      bookToRemove,
      bookRemaining,
    ]);
    const library2: Library = new Library(new LibraryId(), 'library2', [
      bookToRemove,
      new Book('9782290032725', 'Des Fleurs Pour Algernon', 'Keyes'),
    ]);
    mockLibrariesStorage.set(library1.id.value, library1);
    mockLibrariesStorage.set(library2.id.value, library2);

    await controller.removeBookFromAllLibraries(bookToRemove.isbn);
    expect(
      mockLibrariesStorage.get(library1.id.value).has(bookToRemove),
    ).toBeFalsy();
    expect(
      mockLibrariesStorage.get(library1.id.value).has(bookRemaining),
    ).toBeTruthy();
    expect(
      mockLibrariesStorage.get(library2.id.value).has(bookToRemove),
    ).toBeFalsy();
  });
});
