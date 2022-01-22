import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {BooksModule} from './books/books.module';
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ormConfig} from "./orm.config";

@Module({
  imports: [
      ConfigModule.forRoot({isGlobal: true}),
      TypeOrmModule.forRootAsync(ormConfig),
      BooksModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
