import { ArrayMaxSize, ArrayMinSize, IsNotEmpty } from 'class-validator';

export class UpdateLibraryBooksDto {
  @ArrayMinSize(0)
  @ArrayMaxSize(100)
  books: string[];
}
