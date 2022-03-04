import { TypeOrmModule } from '@nestjs/typeorm';
import { LibraryEntity } from './persistence/LibraryEntity';
import { LibrariesController } from './exposition/libraries.controller';
import { LibrariesService } from './application/libraries.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([LibraryEntity])],
  controllers: [LibrariesController],
  providers: [LibrariesService],
})
export class LibrariesModule {}
