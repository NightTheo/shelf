import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from './persistence/book.entity';
import {BookRepositoryImp} from "./persistence/book.repository.imp";

@Module({
  imports: [TypeOrmModule.forFeature(
    [BookEntity])
  ],
  controllers: [BooksController],
  providers: [BooksService, BookRepositoryImp]
})
export class BooksModule {}
