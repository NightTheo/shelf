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
import { FilesUtils } from '../../../utils/files.utils';
import { BufferFile } from './buffer-file';
import any = jasmine.any;
import { StreamableFile, Response } from '@nestjs/common';
const streamBuffers = require('stream-buffers');

describe('BooksController', () => {
  let controller: BooksController;
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
      null,
    );
  });

  const mockBooksService = {
    findAll: jest.fn().mockResolvedValue(mockStoredBooks),
    add: jest.fn().mockImplementation((book) => book.isbn),
    findOne: jest
      .fn()
      .mockImplementation(
        (isbn: Isbn) =>
          mockStoredBooks.filter((book) => book.isbn.value == isbn.value)[0],
      ),
    remove: jest.fn().mockImplementation(),
  };
  const mockResponse = {
    set: jest.fn(),
  };

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
    const allBooks: GetBookDto[] = await controller.findAll();
    expect(allBooks[0]).toEqual({
      isbn: mockStoredBooks[0].isbn.value,
      title: mockStoredBooks[0].title.value,
      author: mockStoredBooks[0].author.name,
      overview: mockStoredBooks[0].overview.value,
      readCount: mockStoredBooks[0].readCount,
    });
  });

  it('should add a books', async () => {
    const book: AddBookDto = {
      isbn: '9782070360024',
      title: "L'Étranger",
      author: 'Albert Camus',
      overview: 'overview',
      readCount: 1,
    };
    expect(await controller.add(book, null)).toEqual({ isbn: book.isbn });
    expect(mockBooksService.add).toHaveBeenCalled();
  });

  it('should add a books without overview and readCount', async () => {
    const book = {
      isbn: '9782070360024',
      title: "L'Étranger",
      author: 'Albert Camus',
    } as AddBookDto;
    expect(await controller.add(book, null)).toEqual({ isbn: book.isbn });
    expect(mockBooksService.add).toHaveBeenCalled();
  });

  it('should get a books by its ISBN', async () => {
    expect(await controller.findOne('1234567890001')).toEqual({
      isbn: '1234567890001',
      title: 'title 1',
      author: 'author 1',
      overview: 'overview 1',
      readCount: 1,
    });
  });

  it('should delete a books', async () => {
    expect(await controller.remove('9782070360024'));
  });

  it('should add a books with its cover', async () => {
    const imageBuffer = (await FilesUtils.fileToBuffer(
      __dirname + '/../../../../test/assets/images/uploadExample.jpg',
    )) as Buffer;
    const readableStreamBuffer = new streamBuffers.ReadableStreamBuffer({
      frequency: 10,
      chunkSize: 2048,
    });
    readableStreamBuffer.put(imageBuffer as Buffer);
    expect(imageBuffer.length).toBeGreaterThan(0);
    const book = {
      isbn: '9782070360024',
      title: "L'Étranger",
      author: 'Albert Camus',
    } as AddBookDto;
    expect(
      await controller.add(book, {
        buffer: imageBuffer,
        encoding: '7bit',
        fieldname: 'picture',
        filename: null,
        mimetype: 'image/jpeg',
        originalname: 'uploadExample.jpg',
        size: imageBuffer.length,
      }),
    ).toEqual({ isbn: book.isbn });
  });

  it("should get a book cover image by the book's ISBN", () => {
    const cover = controller.findPicture(mockResponse, '9782070360024');
    expect(cover).toBeInstanceOf(StreamableFile);
  });
});
