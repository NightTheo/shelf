import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { BookRepositoryImp } from '../persistence/book.repository.imp';
import { Book } from '../domain/book';
import { AddBookDto } from '../dto/add-book.dto';
import { IsbnFormatException } from '../domain/IsbnFormatException';
import { BookAdapter } from '../adapters/book.adapter';

describe('BooksService', () => {
  let service: BooksService;
  const mockStoredBooks: Map<string, Book> = new Map([
    [
      '1234567890001',
      BookAdapter.fromDto({
        isbn: '1234567890001',
        title: 'title 1',
        author: 'author 1',
        overview: 'overview 1',
        readCount: 2,
      }),
    ],
    [
      '1234567890002',
      BookAdapter.fromDto({
        isbn: '1234567890002',
        title: 'title 2',
        author: 'author 2',
        overview: 'overview 2',
        readCount: 2,
      }),
    ],
  ]);

  const mockBooksRepositoryImp = {
    find: jest.fn().mockResolvedValue(Array.from(mockStoredBooks.values())),
    save: jest.fn((book: Book) => Promise.resolve(book)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BooksService, BookRepositoryImp],
    })
      .overrideProvider(BookRepositoryImp)
      .useValue(mockBooksRepositoryImp)
      .compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get all the books', async () => {
    const allBooks: Book[] = await service.findAll();
    expect(allBooks).toEqual(Array.from(mockStoredBooks.values()));
  });

  it('should add a book', async () => {
    const book: AddBookDto = {
      isbn: '9782070360024',
      title: "L'Étranger",
      author: 'Albert Camus',
      overview: 'overview',
      readCount: 1,
    };
    await service.add(book);
    expect(mockBooksRepositoryImp.save).toHaveBeenCalled();
  });

  it('should throw an IsbnFormatException', async () => {
    const book = {
      title: "L'Étranger",
      author: 'Albert Camus',
      overview: 'overview',
      readCount: 1,
    };
    await expect(() =>
      service.add({ isbn: 'BadIsbn', ...book }),
    ).rejects.toThrow(IsbnFormatException);
    await expect(() =>
      service.add({ isbn: 'BadIsbn', ...book }),
    ).rejects.toThrow(
      "ISBN-13 format is: 'aaa-b-cc-dddddd-e' (with or without dashes)",
    );
  });
});
