import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import {BookRepositoryImp} from "./repository/book.repository.imp";
import {Book} from "./domain/book";
import {Isnb} from "./domain/isbn";
import {BookTitle} from "./domain/book-title";
import {Author} from "./domain/author";
import {BookOverview} from "./domain/book-overview";

describe('BooksService', () => {
  let service: BooksService;
  let books: Book[];
  books = [
    new Book(
        new Isnb("1234567890001"),
        new BookTitle("title 1"),
        new Author("author 1"),
        new BookOverview("overview 1")
    ),
    new Book(
        new Isnb("1234567890002"),
        new BookTitle("title 2"),
        new Author("author 2"),
        new BookOverview("overview 2")
    )
  ];
  const mockBooksRepositoryImp = {
    find : jest.fn(() => Promise.all(books))
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
          BooksService,
          BookRepositoryImp
      ],
    }).overrideProvider(BookRepositoryImp).useValue(mockBooksRepositoryImp).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get all the books', async () => {
    const allBooks: Book[] = await service.findAll();
    expect(allBooks).toEqual(books);
  })
});
