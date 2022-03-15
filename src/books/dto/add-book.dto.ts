import { IsNotEmpty, IsOptional, MaxLength, Min } from 'class-validator';

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

  @IsOptional()
  @MaxLength(1500)
  overview: string;

  @IsOptional()
  @Min(0)
  read_count: number;
}
