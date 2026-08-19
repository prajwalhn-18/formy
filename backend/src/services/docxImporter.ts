import mammoth from "mammoth";
import { AppDataSource } from "../dal/dataSource.js";
import { Book } from "../dal/models/Book.js";
import { Chapter } from "../dal/models/Chapter.js";
import { Part } from "../dal/models/Part.js";

interface ParsedChapter {
    title: string;
    content: string;
    order: number;
}

interface ParsedPart {
    title: string;
    order: number;
    chapters: ParsedChapter[];
}

interface ImportOptions {
    title: string;
    author?: string;
    detectParts?: boolean;
    detectChapters?: boolean;
}

export class DocxImporterService {
    private bookRepository = AppDataSource.getRepository(Book);
    private chapterRepository = AppDataSource.getRepository(Chapter);
    private partRepository = AppDataSource.getRepository(Part);

    async importDocx(buffer: Buffer, options: ImportOptions): Promise<Book> {
        const { title, author, detectParts = false, detectChapters = true } = options;

        const result = await mammoth.extractRawText({ buffer });
        const text = result.value;

        const book = new Book();
        book.title = title;
        book.author = author || "";
        book.hasParts = detectParts;

        await this.bookRepository.save(book);

        if (detectChapters) {
            const htmlResult = await mammoth.convertToHtml({ buffer });
            const html = htmlResult.value;

            if (detectParts) {
                const parts = this.extractPartsAndChapters(html, text);
                await this.savePartsWithChapters(book, parts);
            } else {
                const chapters = this.extractChapters(html, text);
                await this.saveChapters(book, chapters);
            }
        } else {
            const chapter = new Chapter();
            chapter.title = "Full Document";
            chapter.content = text;
            chapter.order = 1;
            chapter.book = book;
            chapter.bookId = book.id;
            await this.chapterRepository.save(chapter);
        }

        const savedBook = await this.bookRepository.findOne({
            where: { id: book.id },
            relations: ["parts", "parts.chapters", "chapters"]
        });

        if (!savedBook) {
            throw new Error("Failed to retrieve saved book");
        }

        return savedBook;
    }

    private extractChapters(html: string, fullText: string): ParsedChapter[] {
        const chapters: ParsedChapter[] = [];
        const chapterRegex = /<h[12]>(.*?)<\/h[12]>/gi;
        const matches = [...html.matchAll(chapterRegex)];

        if (matches.length === 0) {
            return [{
                title: "Full Document",
                content: fullText,
                order: 1
            }];
        }

        const textLines = fullText.split('\n');
        let currentChapter: ParsedChapter | null = null;
        let chapterContent: string[] = [];
        let order = 1;

        for (let i = 0; i < textLines.length; i++) {
            const line = textLines[i].trim();

            if (this.isChapterHeading(line, matches)) {
                if (currentChapter) {
                    currentChapter.content = chapterContent.join('\n').trim();
                    chapters.push(currentChapter);
                }

                currentChapter = {
                    title: line,
                    content: "",
                    order: order++
                };
                chapterContent = [];
            } else if (currentChapter) {
                chapterContent.push(textLines[i]);
            }
        }

        if (currentChapter) {
            currentChapter.content = chapterContent.join('\n').trim();
            chapters.push(currentChapter);
        }

        return chapters.length > 0 ? chapters : [{
            title: "Full Document",
            content: fullText,
            order: 1
        }];
    }

    private extractPartsAndChapters(html: string, fullText: string): ParsedPart[] {
        const parts: ParsedPart[] = [];
        const partRegex = /<h1>(.*?)<\/h1>/gi;
        const chapterRegex = /<h2>(.*?)<\/h2>/gi;

        const partMatches = [...html.matchAll(partRegex)];
        const chapterMatches = [...html.matchAll(chapterRegex)];

        if (partMatches.length === 0) {
            const chapters = this.extractChapters(html, fullText);
            return [{
                title: "Main",
                order: 1,
                chapters
            }];
        }

        const textLines = fullText.split('\n');
        let currentPart: ParsedPart | null = null;
        let currentChapter: ParsedChapter | null = null;
        let chapterContent: string[] = [];
        let partOrder = 1;
        let chapterOrder = 1;

        for (let i = 0; i < textLines.length; i++) {
            const line = textLines[i].trim();

            if (this.isPartHeading(line, partMatches)) {
                if (currentChapter && currentPart) {
                    currentChapter.content = chapterContent.join('\n').trim();
                    currentPart.chapters.push(currentChapter);
                }
                if (currentPart) {
                    parts.push(currentPart);
                }

                currentPart = {
                    title: line,
                    order: partOrder++,
                    chapters: []
                };
                currentChapter = null;
                chapterContent = [];
                chapterOrder = 1;
            } else if (this.isChapterHeading(line, chapterMatches)) {
                if (currentChapter && currentPart) {
                    currentChapter.content = chapterContent.join('\n').trim();
                    currentPart.chapters.push(currentChapter);
                }

                currentChapter = {
                    title: line,
                    content: "",
                    order: chapterOrder++
                };
                chapterContent = [];
            } else if (currentChapter) {
                chapterContent.push(textLines[i]);
            } else if (currentPart) {
                chapterContent.push(textLines[i]);
            }
        }

        if (currentChapter && currentPart) {
            currentChapter.content = chapterContent.join('\n').trim();
            currentPart.chapters.push(currentChapter);
        }
        if (currentPart) {
            parts.push(currentPart);
        }

        return parts.length > 0 ? parts : [{
            title: "Main",
            order: 1,
            chapters: [{
                title: "Full Document",
                content: fullText,
                order: 1
            }]
        }];
    }

    private isChapterHeading(line: string, matches: RegExpMatchArray[]): boolean {
        return matches.some(match => {
            const title = match[1].replace(/<[^>]*>/g, '').trim();
            return line === title || line.includes(title);
        });
    }

    private isPartHeading(line: string, matches: RegExpMatchArray[]): boolean {
        return matches.some(match => {
            const title = match[1].replace(/<[^>]*>/g, '').trim();
            return line === title || line.includes(title);
        });
    }

    private async saveChapters(book: Book, chapters: ParsedChapter[]): Promise<void> {
        for (const chapterData of chapters) {
            const chapter = new Chapter();
            chapter.title = chapterData.title;
            chapter.content = chapterData.content;
            chapter.order = chapterData.order;
            chapter.book = book;
            chapter.bookId = book.id;
            await this.chapterRepository.save(chapter);
        }
    }

    private async savePartsWithChapters(book: Book, parts: ParsedPart[]): Promise<void> {
        for (const partData of parts) {
            const part = new Part();
            part.title = partData.title;
            part.order = partData.order;
            part.book = book;
            part.bookId = book.id;
            await this.partRepository.save(part);

            for (const chapterData of partData.chapters) {
                const chapter = new Chapter();
                chapter.title = chapterData.title;
                chapter.content = chapterData.content;
                chapter.order = chapterData.order;
                chapter.book = book;
                chapter.bookId = book.id;
                chapter.part = part;
                chapter.partId = part.id;
                await this.chapterRepository.save(chapter);
            }
        }
    }

    async getBook(id: number): Promise<Book | null> {
        return this.bookRepository.findOne({
            where: { id },
            relations: ["parts", "parts.chapters", "chapters"]
        });
    }

    async getAllBooks(): Promise<Book[]> {
        return this.bookRepository.find({
            relations: ["parts", "chapters"]
        });
    }

    async deleteBook(id: number): Promise<void> {
        await this.bookRepository.delete(id);
    }
}
