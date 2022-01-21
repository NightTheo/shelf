import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import {BookRepositoryImp} from "../persistence/book.repository.imp";
import {Book} from "../domain/book";
import {Isbn} from "../domain/isbn";
import {BookTitle} from "../domain/book-title";
import {Author} from "../domain/author";
import {BookOverview} from "../domain/book-overview";
import {UnprocessableEntityException} from "@nestjs/common";
import {AddBookDto} from "../dto/add-book.dto";

describe('BooksService', () => {
  let service: BooksService;
  const numberOfBooksInMockStoredBooks = 20;
  const mockStoredBooks: Book[] = Array.from(Array(numberOfBooksInMockStoredBooks).keys())
      .map(key => {
        const i = key+1;
        return new Book(
            new Isbn(`123456789000${i}`),
            new BookTitle(`title ${i}`),
            new Author(`author ${i}`),
            new BookOverview(`overview ${i}`)
        )
      })

  const mockBooksRepositoryImp = {
      find: jest.fn(() => Promise.all(mockStoredBooks)),
      save: jest.fn((book: Book) => Promise.resolve(book))
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
    expect(allBooks).toEqual(mockStoredBooks);
  });

  it('should add a book', async () => {
      const book: AddBookDto = {
          isbn: "9782070360024", title: "L'Étranger", author: "Albert Camus",
          overview: "overview"
      }
      await service.add(book);
      expect(mockBooksRepositoryImp.save).toHaveBeenCalled();
  });

  it('should get all the books', async () => {
    const allBooks: Book[] = await service.findAll();
    expect(allBooks).toEqual(mockStoredBooks);
  })
});
