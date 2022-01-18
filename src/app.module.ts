import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {BooksModule} from './books/books.module';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypeOrmModule, TypeOrmModuleOptions} from "@nestjs/typeorm";
import {createConnection} from "typeorm";
import { BookEntity } from './books/persistence/book.entity';

@Module({
  imports: [
      ConfigModule.forRoot({isGlobal: true}),
      TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
              return {
                type: configService.get('DB_TYPE'),
                host: configService.get('DB_HOST'),
                port: +configService.get<number>('DB_PORT'),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_DATABASE'),
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: true
              } as TypeOrmModuleOptions;
          },
          connectionFactory: async (options) => {
              return await createConnection(options);
          },
      }),
      BooksModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
