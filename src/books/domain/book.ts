import {Isbn} from "./isbn";
import {Author} from "./author";
import {BookTitle} from "./book-title";
import {BookOverview} from "./book-overview";
import {Picture} from "./picture";
import {BookBuilder} from "./book.builder";

export class Book {
    private readonly _isbn: Isbn;
    private readonly _title: BookTitle;
    private readonly _author: Author;
    private readonly _overview: BookOverview;
    private picture: Picture;


    constructor(isbn: Isbn, title: BookTitle, author: Author, overview: BookOverview) {
        this._isbn = isbn;
        this._title = title;
        this._author = author;
        this._overview = overview
    }

    get isbn(): Isbn {
        return this._isbn;
    }

    get title(): BookTitle {
        return this._title;
    }

    get author(): Author {
        return this._author;
    }

    get overview(): BookOverview {
        return this._overview;
    }

    static builder(): BookBuilder {
        return new BookBuilder();
    };
}
