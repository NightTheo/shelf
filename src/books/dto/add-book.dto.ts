import { IsNotEmpty, MaxLength, Min } from 'class-validator';

export class AddBookDto {
  @IsNotEmpty()
  @MaxLength(17)
  isbn: string;

  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsNotEmpty()
  @MaxLength(150)
  author: string;

  @MaxLength(1500)
  overview: string;

  @Min(0)
  readCount: number;
}
