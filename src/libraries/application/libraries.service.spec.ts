import { Test, TestingModule } from '@nestjs/testing';
import { LibrariesService } from './libraries.service';
import { LibraryRepositoryTypeORM } from '../persistence/library.repository.typeorm';

describe('LibrariesService', () => {
  let service: LibrariesService;

  const mockLibraryRepositoryTypeORM = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LibrariesService, LibraryRepositoryTypeORM],
    })
      .overrideProvider(LibraryRepositoryTypeORM)
      .useValue(mockLibraryRepositoryTypeORM)
      .compile();

    service = module.get<LibrariesService>(LibrariesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
