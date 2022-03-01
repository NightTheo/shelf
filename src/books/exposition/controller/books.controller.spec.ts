import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from '../../application/books.service';
import { Book } from '../../domain/book';
import { Isbn } from '../../domain/isbn';
import { BookTitle } from '../../domain/book-title';
import { Author } from '../../domain/author';
import { BookOverview } from '../../domain/book-overview';
import { GetBookDto } from '../../dto/get-book.dto';
import { AddBookDto } from '../../dto/add-book.dto';
import { StreamableFile } from '@nestjs/common';
import { Request } from 'express';
import { BookCover } from '../../domain/book-cover';
import { FileLocation } from '../../../shared/files/file-location';

const streamBuffers = require('stream-buffers');

describe('BooksController', () => {
  let controller: BooksController;
  const imageDirectory = __dirname + '/../../../../test/assets/images/';
  const numberOfBooksInMockStoredBooks = 9;
  const mockStoredBooks: Book[] = Array.from(
    Array(numberOfBooksInMockStoredBooks).keys(),
  ).map((key) => {
    const i = key + 1;
    return new Book(
      new Isbn(`123456789000${i}`),
      new BookTitle(`title ${i}`),
      new Author(`author ${i}`),
      new BookOverview(`overview ${i}`),
      i,
      new BookCover(
        Buffer.alloc(10),
        new FileLocation(imageDirectory + `123456789000${i}` + '.jpg'),
      ),
    );
  });

  const mockBooksService = {
    findAll: jest.fn().mockResolvedValue(mockStoredBooks),
    add: jest.fn().mockImplementation((book) => book.isbn),
    findOne: jest
      .fn()
      .mockImplementation(
        (isbn: string) =>
          mockStoredBooks.filter((book) => book.isbn.value == isbn)[0],
      ),
    remove: jest.fn().mockImplementation(),
    findPictureByIsbn: jest
      .fn()
      .mockImplementation(
        (isbn: string) =>
          mockStoredBooks.filter((book) => book.isbn.value == isbn)[0].cover,
      ),
  };

  const mockResponse = {
    set: jest.fn(),
  };

  const mockRequest = {
    dict: new Map([['host', 'api.shelf.cat/']]),
    protocol: 'https',
    originalUrl: `books`,
    get: function (key) {
      return this.dict.get(key);
    },
  } as unknown as Request;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [BooksService],
    })
      .overrideProvider(BooksService)
      .useValue(mockBooksService)
      .compile();

    controller = module.get<BooksController>(BooksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should get all the books', async () => {
    const allBooks: GetBookDto[] = await controller.findAll(mockRequest);
    expect(allBooks[0]).toEqual({
      isbn: mockStoredBooks[0].isbn.value,
      title: mockStoredBooks[0].title.value,
      author: mockStoredBooks[0].author.name,
      url: expect.any(String),
    });
    expect(allBooks[0]['url']).toContain('/books/1234567890001');
  });

  it('should add a books', async () => {
    const book: AddBookDto = {
      isbn: '9782070360024',
      title: "L'Étranger",
      author: 'Albert Camus',
      overview: 'overview',
      read_count: 1,
    };
    const response = await controller.add(book, null, mockRequest);
    expect(response.url).toContain('/books/9782070360024');
    expect(mockBooksService.add).toHaveBeenCalled();
  });

  it('should add a books without overview and readCount', async () => {
    const book = {
      isbn: '9782070360024',
      title: "L'Étranger",
      author: 'Albert Camus',
    } as AddBookDto;
    const res = await controller.add(book, null, mockRequest);
    expect(res.url).toContain('/books/9782070360024');
    expect(mockBooksService.add).toHaveBeenCalled();
  });

  it('should get a books by its ISBN', async () => {
    expect(await controller.findOne('1234567890001', mockRequest)).toEqual({
      isbn: '1234567890001',
      title: 'title 1',
      author: 'author 1',
      overview: 'overview 1',
      read_count: 1,
      picture: 'https://api.shelf.cat/books/cover',
    });
  });

  it('should get a books and its picture as url', async () => {
    mockStoredBooks[1].cover = new BookCover(
      Buffer.alloc(10),
      new FileLocation(imageDirectory + 'filename.ext'),
    );
    const req = { ...mockRequest };
    req.originalUrl = 'books/1234567890002';
    expect(
      await controller.findOne('1234567890002', req as Request),
    ).toHaveProperty(
      'picture',
      'https://api.shelf.cat/books/1234567890002/cover',
    );
  });

  it('should delete a books', async () => {
    expect(await controller.remove('9782070360024'));
  });

  it('should add a books with its cover', async () => {
    const book = {
      isbn: '9782070360024',
      title: "L'Étranger",
      author: 'Albert Camus',
    } as AddBookDto;
    const res = await controller.add(
      book,
      {
        buffer: Buffer.alloc(10),
        encoding: '7bit',
        fieldname: 'picture',
        filename: null,
        mimetype: 'image/jpeg',
        originalname: 'uploadExample.jpg',
        size: 10,
      },
      mockRequest,
    );
    expect(res.url).toContain('/books/9782070360024');
  });

  it("should get a book cover image by the book's ISBN", async () => {
    const cover = await controller.findPicture(mockResponse, '1234567890001');
    expect(cover).toBeInstanceOf(StreamableFile);
  });
});
