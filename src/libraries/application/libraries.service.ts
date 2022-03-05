import { Injectable } from '@nestjs/common';
import { LibraryRepositoryTypeORM } from '../persistence/library.repository.typeorm';

@Injectable()
export class LibrariesService {
  constructor(private libraryRepository: LibraryRepositoryTypeORM) {}
}
