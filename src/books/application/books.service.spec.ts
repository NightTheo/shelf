import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { BookRepositoryTypeORM } from '../persistence/book.repository.typeORM';
import { Book } from '../domain/book';
import { Isbn } from '../domain/isbn';
import { NotFoundException } from '@nestjs/common';
import { AddBookDto } from '../dto/add-book.dto';
import { IsbnFormatException } from '../domain/IsbnFormatException';
import { BookAdapter } from '../adapters/book.adapter';
import { BufferFile } from '../exposition/controller/buffer-file';
import { BookCover } from '../domain/book-cover';
import { BookCoverFileSystemRepository } from '../persistence/book-cover.file-system.repository';
import { FilesUtils } from '../../utils/files/files.utils';

describe('BooksService', () => {
  let service: BooksService;
  const mockBooks: Map<string, Book> = new Map([
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
  const mockFileStorage = new Set<string>();
  const mockBooksRepositoryImp = {
    find: jest.fn().mockResolvedValue(Array.from(mockBooks.values())),
    save: jest.fn((book: Book) => {}),
    delete: jest.fn((isbn) => {
      mockBooks.delete(isbn);
    }),
    findOne: jest.fn((isbn: Isbn) => mockBooks.get(isbn.value)),
  };

  const mockBookCoverRepository = {
    save: jest.fn((bookCover: BookCover) => {
      const name = FilesUtils.fileNameOfPath(bookCover.location.path);
      mockFileStorage.add(name);
      return name;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        BookRepositoryTypeORM,
        BookCoverFileSystemRepository,
      ],
    })
      .overrideProvider(BookRepositoryTypeORM)
      .useValue(mockBooksRepositoryImp)
      .overrideProvider(BookCoverFileSystemRepository)
      .useValue(mockBookCoverRepository)
      .compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get all the books', async () => {
    const allBooks: Book[] = await service.findAll();
    expect(allBooks).toEqual(Array.from(mockBooks.values()));
  });

  it('should add a books', async () => {
    const book: AddBookDto = {
      isbn: '9782070360024',
      title: "L'Étranger",
      author: 'Albert Camus',
      overview: 'overview',
      readCount: 1,
    };
    await service.add(book, {
      buffer: Buffer.alloc(10),
      originalname: '9782070360024.jpg',
    } as BufferFile);
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
      service.add({ isbn: 'BadIsbn', ...book }, null),
    ).rejects.toThrow(IsbnFormatException);
    await expect(() =>
      service.add({ isbn: 'BadIsbn', ...book }, null),
    ).rejects.toThrow(
      "ISBN-13 format is: 'aaa-b-cc-dddddd-e' (with or without dashes)",
    );
  });

  it('should found a books by its isbn', async function () {
    expect(await service.findOne(new Isbn('1234567890001'))).toEqual(
      mockBooks.get('1234567890001'),
    );
  });

  it('should delete a books', async function () {
    expect(await service.remove('1234567890001'));
  });

  it('should not found isbn throw NotFoundException', function () {
    expect(() => service.remove('0000000000000')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should add a books with cover image', async () => {
    const book: AddBookDto = {
      isbn: '9782070360024',
      title: "L'Étranger",
      author: 'Albert Camus',
      overview: null,
      readCount: null,
    };
    const cover: BufferFile = {
      buffer: null,
      encoding: '7bit',
      fieldname: 'cover_image',
      filename: '9782070360024.jpg',
      mimetype: 'image/jpeg',
      originalname: 'uploadExample.jpg',
      size: 1,
    };
    await service.add(book, cover);
    expect(mockFileStorage.has(cover.originalname)).toBeTruthy();
  });
});
