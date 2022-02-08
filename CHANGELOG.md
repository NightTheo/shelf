# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]


## [0.4.0] - 2022-02-8
### Added
- Endpoint `GET /books/{isbn}` Get the details of a book by its ISBN 13.
- Endpoint `GET /books` get all the books.
- Endpoint `DELETE /books/{isbn}` delete a book by its ISBN 13.
- Endpoint `POST /books` add a book.
- Unit and integration tests for the those four endpoints.
- GitHub Actions for Continuous Integration.
- This CHANGELOG which starts at version 0.4.0.

[Unreleased]: https://github.com/NightTheo/shelf/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/NightTheo/shelf/releases/tag/v0.4.0