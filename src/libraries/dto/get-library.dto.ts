export class GetLibraryDto {
  id: string;
  name: string;
  books: { isbn: string; title: string; author: string; url: string }[];
}
