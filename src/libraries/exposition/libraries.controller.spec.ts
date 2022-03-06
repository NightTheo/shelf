import { Test, TestingModule } from '@nestjs/testing';
import { LibrariesController } from './libraries.controller';
import { LibrariesService } from '../application/libraries.service';
import { Library } from '../domain/library/library';
import { LibraryId } from '../domain/library-id/library-id';
import { Book } from '../domain/book/book';
import { CreateLibraryDto } from '../dto/create-library.dto';
import { UpdateLibraryBooksDto } from '../dto/update-library-books.dto';
import { GetLibraryDto } from '../dto/get-library.dto';

describe('LibrariesController', () => {
  let controller: LibrariesController;

  const mockLibrariesStorage: Map<string, Library> = new Map<string, Library>();
  const mockLibrariesService = {
    getAll: jest
      .fn()
      .mockImplementation(() => Array.from(mockLibrariesStorage.values())),
    createWithListOfIsbn: jest.fn().mockImplementation((isbnList: string[]) => {
      const newLibrary: Library = isbnList
        ? new Library(
            new LibraryId(),
            isbnList.map((isbn) => new Book(isbn)),
          )
        : new Library();
      mockLibrariesStorage.set(newLibrary.id.value, newLibrary);
    }),
    delete: jest
      .fn()
      .mockImplementation((id: string) => mockLibrariesStorage.delete(id)),
    update: jest.fn().mockImplementation((id: string, isbnList: string[]) => {
      const library: Library = new Library(
        LibraryId.withValue(id),
        isbnList.map((isbn) => new Book(isbn)),
      );
      mockLibrariesStorage.set(id, library);
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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get all the books', async () => {
    const library: Library = new Library(new LibraryId(), [
      new Book('9782221252055', 'Dune', 'Herbert'),
    ]);
    mockLibrariesStorage.set(library.id.value, library);
    const dtos: GetLibraryDto[] = await controller.getAllLibraries();
    expect(dtos).toEqual([
      {
        id: library.id.value,
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
    mockLibrariesStorage.clear();
    await controller.createLibrary();
    expect(mockLibrariesStorage.size).toEqual(1);
    const [created] = mockLibrariesStorage.keys();
    expect(mockLibrariesStorage.get(created).books).toEqual([]);
  });

  it('should create a library with three books', async () => {
    mockLibrariesStorage.clear();
    const dto: CreateLibraryDto = {
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
    mockLibrariesStorage.clear();
    const toDelete: Library = new Library();
    mockLibrariesStorage.set(toDelete.id.value, toDelete);
    await controller.delete(toDelete.id.value);
    expect(mockLibrariesStorage.has(toDelete.id.value)).toBeFalsy();
  });

  it('should update a library', async () => {
    mockLibrariesStorage.clear();
    const library: Library = new Library();
    mockLibrariesStorage.set(library.id.value, library);
    const dto: UpdateLibraryBooksDto = {
      books: ['978-2221252055', '9782070411610', '978-2-2900-3272-5'],
    };
    await controller.update(library.id.value, dto);
    expect(
      mockLibrariesStorage.get(library.id.value).has(new Book('9782070411610')),
    ).toBeTruthy();
  });
});
