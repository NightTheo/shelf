import {Test, TestingModule} from '@nestjs/testing';
import {BooksController} from './books.controller';
import {BooksService} from './books.service';
import {Book} from "./domain/book";
import {Isnb} from "./domain/isbn";
import {BookTitle} from "./domain/book-title";
import {Author} from "./domain/author";
import {BookOverview} from "./domain/book-overview";
import {AddedBookDto} from "./exposition/dto/added-book.dto";
import {AddBookDto} from "./exposition/dto/add-book.dto";
import {UnprocessableEntityException} from "@nestjs/common";
import exp from "constants";

describe('BooksController', () => {
    let controller: BooksController;
    const numberOfBooksInMockStoredBooks = 20;
    const goodIsbn = "9782070360024";
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
        const addedBook: AddedBookDto = {
            author: book.author, isbn: book.isbn, title: book.title, overview: "overview",
        }
        expect(await controller.add(book)).toEqual(addedBook);
    })

    it("should throw an UnprocessableEntityException if given a bad ISBN", async () => {
        const bookWithBadIsbn: AddBookDto = {isbn: "badIsbn", author: "author", overview: "overview", title: "title" };
        await expect(() => controller.add(bookWithBadIsbn)).rejects.toThrow(UnprocessableEntityException);
        await expect(() => controller.add(bookWithBadIsbn)).rejects.toThrow("The ISBN-13 should be a numeric identification key as aaa-b-cccc-dddd-e");
    })

    it("should throw an UnprocessableEntityException if the title length is over 200", async () => {
        const bookWithGoodTitle: AddBookDto = {isbn: goodIsbn, author: "author", overview: "overview", title: 'a'.repeat(200) };
        expect(await controller.add(bookWithGoodTitle)).toEqual({
            ...bookWithGoodTitle
        });

        const bookWithTooLongTitle: AddBookDto = {isbn: goodIsbn, author: "author", overview: "overview", title: 'b'.repeat(201) };
        await expect(() => controller.add(bookWithTooLongTitle)).rejects.toThrow(UnprocessableEntityException);
        await expect(() => controller.add(bookWithTooLongTitle)).rejects.toThrow("The book title is required with a maximum length of 200 characters");
    })

});
