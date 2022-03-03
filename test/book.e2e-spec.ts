import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { BooksModule } from '../src/books/books.module';
import { BookEntity } from '../src/books/persistence/book.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from '../src/books/domain/book';

describe('BookController (e2e)', () => {
  let app: INestApplication;

  const mockBooks: Map<string, BookEntity> = new Map([
    [
      '1234567890001',
      {
        isbn: '1234567890001',
        title: 'title 1',
        author: 'author 1',
        overview: 'overview 1',
        read_count: 1,
        cover_image: '1234567890001.jpg',
      },
    ],
  ]);

  const mockBooksRepository = {
    save: jest.fn().mockImplementation((book: Book) =>
      mockBooks.set(book.isbn.value, {
        isbn: book.isbn.value,
        title: book.title.value,
        author: book.author.name,
        overview: book.overview?.value,
        read_count: book.readCount,
        cover_image: book.isbn.value + '.jpg',
      }),
    ),
    findOne: jest
      .fn()
      .mockImplementation((isbn: string) => mockBooks.get(isbn)),
    find: jest.fn().mockResolvedValue(Array.from(mockBooks.values())),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [BooksModule],
    })
      .overrideProvider(getRepositoryToken(BookEntity))
      .useValue(mockBooksRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/books (POST)', () => {
    return request(app.getHttpServer())
      .post('/books')
      .send({
        isbn: '9782290032726',
        title: 'Des fleurs pour Algernon',
        author: 'Daniel Keyes',
        overview: 'Algernon est une souris dont le traitement ....',
        read_count: 1,
      })
      .expect(201)
      .then((response) => {
        expect(response.body.url).toContain('/books/9782290032726');
      });
  });

  it('/books (POST) should create a book when given an ISBN with dashes', () => {
    return request(app.getHttpServer())
      .post('/books')
      .send({
        isbn: '978-2-29-003272-6',
        title: '...',
        author: '...',
        overview: '...',
        read_count: 1,
      })
      .expect(201)
      .then((response) => {
        expect(response.body.url).toContain('/books/9782290032726');
      });
  });

  it('/books (POST) should create a book without overview and read_count', () => {
    return request(app.getHttpServer())
      .post('/books')
      .send({
        isbn: '978-2290032727',
        title: '...',
        author: '...',
      })
      .expect(201)
      .then((response) => {
        expect(response.body.url).toContain('/books/9782290032727');
      });
  });

  it('/books (POST) should create a book when given an ISBN with dashes (not all)', () => {
    return request(app.getHttpServer())
      .post('/books')
      .send({
        isbn: '978-229003272-6',
        title: '...',
        author: '...',
        overview: '...',
        read_count: 1,
      })
      .expect(201)
      .then((response) => {
        expect(response.body.url).toContain('/books/9782290032726');
      });
  });

  it('/books (POST) empty DTO -> throw Unprocessable Entity', () => {
    return request(app.getHttpServer())
      .post('/books')
      .send() // empty body
      .expect(422);
  });

  it('/books (POST) bad isbn -> throw Unprocessable Entity', () => {
    return request(app.getHttpServer())
      .post('/books')
      .send({
        isbn: 'badIsbn',
        title: '...',
        author: '...',
        overview: '...',
        read_count: 1,
      })
      .expect(422);
  });

  it('/books (POST) existing book -> throw Unprocessable Entity', () => {
    return request(app.getHttpServer())
      .post('/books')
      .send({
        isbn: '1234567890001', // already exists
        title: '...',
        author: '...',
      })
      .expect(422);
  });

  it('/books (GET)', () => {
    return request(app.getHttpServer())
      .get('/books')
      .expect(200)
      .then((response) => {
        expect(response.body).toContainEqual({
          isbn: '1234567890001',
          title: 'title 1',
          author: 'author 1',
          url: expect.stringContaining('/books/1234567890001'),
        });
      });
  });

  it('/books/1234567890001 (GET)', () => {
    return request(app.getHttpServer())
      .get('/books/1234567890001')
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
          isbn: '1234567890001',
          title: 'title 1',
          author: 'author 1',
          overview: 'overview 1',
          read_count: 1,
          picture: expect.stringContaining('/books/1234567890001/cover'),
        });
      });
  });

  it('/books/0000000000000 (GET)', () => {
    return request(app.getHttpServer()).get('/books/0000000000000').expect(404);
  });
});
