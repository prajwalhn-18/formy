import { Book } from "../dal/models/Book.js";
interface ImportOptions {
    title: string;
    author?: string;
    detectParts?: boolean;
    detectChapters?: boolean;
}
export declare class DocxImporterService {
    private bookRepository;
    private chapterRepository;
    private partRepository;
    importDocx(buffer: Buffer, options: ImportOptions): Promise<Book>;
    private extractChapters;
    private extractPartsAndChapters;
    private isChapterHeading;
    private isPartHeading;
    private saveChapters;
    private savePartsWithChapters;
    getBook(id: number): Promise<Book | null>;
    getAllBooks(): Promise<Book[]>;
    deleteBook(id: number): Promise<void>;
}
export {};
