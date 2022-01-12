import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import {getRepositoryToken} from "@nestjs/typeorm";
import {Book} from "./entities/book.entity";

describe('BooksService', () => {
  let service: BooksService;
  const mockBooksRepository = {

  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
          BooksService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockBooksRepository
        }
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
