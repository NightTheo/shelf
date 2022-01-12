import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

describe('BooksController', () => {
  let controller: BooksController;
  const mockBooksService = {
    create: jest.fn(dto => {
      return {
        isbn: dto.isbn,
        title: dto.title,
        author: dto.author
      }
    })
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

  it('should create a book', ()=> {
    const createDto = {
      isbn: '2070360024',
      title: 'L\'Étranger',
      author: 'Albert Camus',
      overview: 'Quand la sonnerie a encore retenti, que la porte du box s\'est ouverte, c\'est le silence...'
    }
    expect(controller.create(createDto)).toEqual({
      isbn: createDto.isbn,
      title: createDto.title,
      author: createDto.author
    })
  })
});
