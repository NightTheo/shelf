# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2022-03-08
### Added
- Libraries management :
  - `GET /libraries` get all the libraries (with their books).
  - `GET /libraries/{uuid}` get the details of a library.
  - `POST /libraries` create a new library with books (array of isbn in the body)
  - `DELETE /libraries/{uuid}` delete a library
  - `PATH /libraries/{uuid}` update the list of books in a library
  - When a book is deleted by `DELETE /books/{isbn}`, the book is removed from all libraries
- `PATCH /books/{isbn}` update a book information
- When a book is added, the given ISBN is checked by calling the [Google API](https://www.googleapis.com/books/v1/volumes?q=isbn:9782221252055)
- Documentation of the use of docker, docker-compose, git, GitHub, ... in the [README.md](./README.md)

## [0.5.0] - 2022-03-03
### Added
- Upload a book's picture when you add a new book is now possible on the endpoint `POST /books`.
- A BookCoverRepository witch handle persistence in the domain has two implementations:
  - BookCoverFileSystemRepository: save or delete on the FS of the application.
  - **BookCoverMinioRepository**: use the storage object [Minio](https://hub.docker.com/r/minio/minio/)
- The Current implementation of BookCoverRepository used is BookCoverMinioRepository
- On the details of a book `GET /books/{isbn}`, if this book has a picture, the property `picture` is an url to the endpoint `GET /books/{isbn}/cover`.
- A field `picture` in the Book table in database as a string for store the file's path (FS or minio).

### Changed
- Make the responses of the endpoints `GET /books` more 'HATEOAS': the collection display only the isbn, the title 
and the author of each book plus the `url` of the endpoint `GET /books/{isbn}` witch contains the other details like
the overview, the picture and the read count.

## [0.4.0] - 2022-02-08
### Added
- Endpoint `GET /books/{isbn}` Get the details of a book by its ISBN 13.
- Endpoint `GET /books` get all the books.
- Endpoint `DELETE /books/{isbn}` delete a book by its ISBN 13.
- Endpoint `POST /books` add a book.
- Unit and integration tests for the those four endpoints.
- GitHub Actions for Continuous Integration.
- This CHANGELOG which starts at version 0.4.0.

[Unreleased]: https://github.com/NightTheo/shelf/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/NightTheo/shelf/releases/tag/v1.0.0
[0.5.0]: https://github.com/NightTheo/shelf/releases/tag/v0.5.0
[0.4.0]: https://github.com/NightTheo/shelf/releases/tag/v0.4.0