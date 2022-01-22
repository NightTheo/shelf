import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {BooksModule} from './books/books.module';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypeOrmModule, TypeOrmModuleOptions} from "@nestjs/typeorm";
import {createConnection} from "typeorm";
import { BookEntity } from './books/persistence/book.entity';
import {APP_FILTER} from "@nestjs/core";
import {AllExceptionsFilter} from "./all-exceptions.filter";

@Module({
  imports: [
      ConfigModule.forRoot({isGlobal: true}),
      TypeOrmModule.forRootAsync(ormConfig),
      BooksModule
  ],
  controllers: [AppController],
  providers: [
      AppService,
      {
          provide: APP_FILTER,
          useClass: AllExceptionsFilter,
      }
  ],
})
export class AppModule {}
