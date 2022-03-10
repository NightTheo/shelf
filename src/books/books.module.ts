import { Module } from '@nestjs/common';
import { BooksService } from './application/books.service';
import { BooksController } from './exposition/controller/books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from './persistence/book.entity';
import { BookRepositoryTypeORM } from './persistence/book.repository.typeORM';
import { BookCoverFileSystemRepository } from './persistence/book-cover.file-system.repository';
import { BookCoverMinioRepository } from './persistence/book-cover.minio.repository';
import { MinioClientModule } from '../minio/minio.module';
import { LibraryRepositoryShelfApi } from './persistence/library.repository.shelf-api';
import { IsbnValidatorGoogleApi } from '../shared/isbn/isbn.validator.google-api';

@Module({
  imports: [TypeOrmModule.forFeature([BookEntity]), MinioClientModule],
  controllers: [BooksController],
  providers: [
    BooksService,
    BookRepositoryTypeORM,
    BookCoverFileSystemRepository,
    BookCoverMinioRepository,
    LibraryRepositoryShelfApi,
    IsbnValidatorGoogleApi,
  ],
})
export class BooksModule {}
