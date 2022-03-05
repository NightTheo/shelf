import { TypeOrmModule } from '@nestjs/typeorm';
import { LibraryEntity } from './persistence/LibraryEntity';
import { LibrariesController } from './exposition/libraries.controller';
import { LibrariesService } from './application/libraries.service';
import { Module } from '@nestjs/common';
import { LibraryRepositoryTypeORM } from './persistence/library.repository.typeorm';
import { BookRepositoryShelfApi } from './persistence/book.repository.shelf-api';

@Module({
  imports: [TypeOrmModule.forFeature([LibraryEntity])],
  controllers: [LibrariesController],
  providers: [
    LibrariesService,
    LibraryRepositoryTypeORM,
    BookRepositoryShelfApi,
  ],
})
export class LibrariesModule {}
