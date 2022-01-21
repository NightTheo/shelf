import {Test, TestingModule} from '@nestjs/testing';
import {BooksController} from './books.controller';
import {BooksService} from '../../application/books.service';
import {Book} from "../../domain/book";
import {Isbn} from "../../domain/isbn";
import {BookTitle} from "../../domain/book-title";
import {Author} from "../../domain/author";
import {BookOverview} from "../../domain/book-overview";
import {AddedBookDto} from "../../dto/added-book.dto";
import {AddBookDto} from "../../dto/add-book.dto";
import {BadRequestException, UnprocessableEntityException} from "@nestjs/common";
import exp from "constants";

describe('BooksController', () => {
    let controller: BooksController;
    const numberOfBooksInMockStoredBooks = 20;
    const goodIsbn = "9782070360024";
    const mockStoredBooks: Book[] = Array.from(Array(numberOfBooksInMockStoredBooks).keys())
        .map(key => {
            const i = key + 1;
            return new Book(
                new Isbn(`123456789000${i}`),
                new BookTitle(`title ${i}`),
                new Author(`author ${i}`),
                new BookOverview(`overview ${i}`)
            )
        });

    const mockBooksService = {
        findAll: jest.fn().mockResolvedValue(mockStoredBooks),
        add: jest.fn().mockImplementation(book => book.isbn),
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
                isbn: mockStoredBooks[0].isbn.value,
                title: mockStoredBooks[0].title.value,
                author: mockStoredBooks[0].author.name,
                overview: mockStoredBooks[0].overview.value
            },
            {
                isbn: mockStoredBooks[1].isbn.value,
                title: mockStoredBooks[1].title.value,
                author: mockStoredBooks[1].author.name,
                overview: mockStoredBooks[1].overview.value
            }
        ]);
    })

    it('should add a book', async () => {
        const book: AddBookDto = {
            isbn: "9782070360024", title: "L'Étranger", author: "Albert Camus",
            overview: "overview"
        }
        expect(await controller.add(book)).toEqual({isbn: book.isbn});
        expect(mockBooksService.add).toHaveBeenCalled();
    })
});
