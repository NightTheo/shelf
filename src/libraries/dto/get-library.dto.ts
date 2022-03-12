export class GetLibraryDto {
  id: string;
  name: string;
  book_count: number;
  books: { isbn: string; title: string; author: string; url: string }[];
}
