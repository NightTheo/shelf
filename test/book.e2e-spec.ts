import { Test, TestingModule } from '@nestjs/testing';
import {INestApplication, ValidationPipe} from '@nestjs/common';
import * as request from 'supertest';
import {BooksModule} from "../src/books/books.module";
import {BookEntity} from "../src/books/persistence/book.entity";
import {getRepositoryToken} from "@nestjs/typeorm";
import {response} from "express";

describe('BookController (e2e)', () => {
  let app: INestApplication;

  const mockBooksRepository = {
    save: jest.fn().mockImplementation()
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [BooksModule],
    }).overrideProvider(getRepositoryToken(BookEntity)).useValue(mockBooksRepository)
        .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/books (POST)', () => {
    return request(app.getHttpServer())
        .post('/books')
        .send({
          isbn: "9782290032726",
          title: "Des fleurs pour Algernon",
          author: "Daniel Keyes",
          overview: "Algernon est une souris dont le traitement du Pr Nemur et du Dr Strauss vient de décupler l'intelligence."
        })
        .expect(201)
        .then(response => {
            expect(response.body).toEqual({
                isbn: "9782290032726"
            })
        })
  });

    it('/books (POST) -> throw Unprocessable Entity', () => {
        return request(app.getHttpServer())
            .post('/books')
            .send()// empty body
            .expect(422)
    });
});
