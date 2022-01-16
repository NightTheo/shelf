import {Test, TestingModule} from '@nestjs/testing';
import {BooksController} from './books.controller';
import {BooksService} from './books.service';
import {Book} from "./domain/book";
import {Isnb} from "./domain/isbn";
import {BookTitle} from "./domain/book-title";
import {Author} from "./domain/author";
import {BookOverview} from "./domain/book-overview";
import {AddedBookDto} from "./dto/added-book.dto";
import {AddBookDto} from "./dto/add-book.dto";

describe('BooksController', () => {
    let controller: BooksController;
    const numberOfBooksInMockStoredBooks = 20;
    const mockStoredBooks: Book[] = Array.from(Array(numberOfBooksInMockStoredBooks).keys())
        .map(key => {
            const i = key + 1;
            return new Book(
                new Isnb(`123456789000${i}`),
                new BookTitle(`title ${i}`),
                new Author(`author ${i}`),
                new BookOverview(`overview ${i}`)
            )
        });

    const mockBooksService = {
        findAll: jest.fn(() => Promise.all(mockStoredBooks)),
        add: jest.fn(book => Promise.resolve(book))
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BooksController],
            providers: [BooksService],
        }).overrideProvider(BooksService).useValue(mockBooksService).compile();

        controller = module.get<BooksController>(BooksController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should get all the books', async () => {
        const allStoredBooksDto: AddedBookDto[] = await controller.findAll();
        expect(allStoredBooksDto.slice(0, 2)).toEqual([
            {
                isbn: allStoredBooksDto[0].isbn,
                title: allStoredBooksDto[0].title,
                author: allStoredBooksDto[0].author
            },
            {
                isbn: allStoredBooksDto[1].isbn,
                title: allStoredBooksDto[1].title,
                author: allStoredBooksDto[1].author
            }
        ]);
    })

    it('should add a book', async () => {
        const book: AddBookDto = {
            isbn: "9782070360024", title: "L'Étranger", author: "Albert Camus",
            overview: "overview"
        }
        const addedBook: AddedBookDto = {
            author: book.author, isbn: book.isbn, title: book.title
        }
        expect(await controller.add(book)).toEqual(addedBook);
    })

});
