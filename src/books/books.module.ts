import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from './entities/book.entity';
import {BookRepositoryImp} from "./repository/book.repository.imp";

@Module({
  imports: [TypeOrmModule.forFeature(
    [BookEntity])
  ],
  controllers: [BooksController],
  providers: [BooksService, BookRepositoryImp]
})
export class BooksModule {}
