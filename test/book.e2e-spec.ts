import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { BooksModule } from '../src/books/books.module';
import { BookEntity } from '../src/books/persistence/book.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import e from 'express';

describe('BookController (e2e)', () => {
  let app: INestApplication;

  const mockBooks = [
    {
      isbn: '1234567890001',
      title: 'title 1',
      author: 'author 1',
      overview: 'overview 1',
      read_count: 1,
    },
    {
      isbn: '1234567890002',
      title: 'title 2',
      author: 'author 2',
      overview: 'overview 2',
      read_count: 2,
    },
  ];

  const mockBooksRepository = {
    save: jest.fn().mockImplementation(),
    find: jest.fn().mockResolvedValue(mockBooks),
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
        overview:
          "Algernon est une souris dont le traitement du Pr Nemur et du Dr Strauss vient de décupler l'intelligence.",
        readCount: 1,
      })
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual({
          isbn: '9782290032726',
        });
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
        readCount: 1,
      })
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual({
          isbn: '9782290032726',
        });
      });
  });

  it('/books (POST) should create a book without overview and readCount', () => {
    return request(app.getHttpServer())
      .post('/books')
      .send({
        isbn: '978-2290032727',
        title: '...',
        author: '...',
      })
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual({
          isbn: '9782290032727',
        });
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
        readCount: 1,
      })
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual({
          isbn: '9782290032726',
        });
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
        readCount: 1,
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
          overview: 'overview 1',
          readCount: 1,
        });
      });
  });
});
