import { Book } from "../dal/models/Book.js";
export interface ASTNode {
    type: string;
    content?: string;
    children?: ASTNode[];
    metadata?: Record<string, any>;
}
export interface BookAST {
    type: "book";
    metadata: {
        title: string;
        author?: string;
        description?: string;
        createdAt: Date;
        updatedAt: Date;
        hasParts: boolean;
        wordCount: number;
        characterCount: number;
        chapterCount: number;
        partCount: number;
    };
    children: ASTNode[];
}
export declare class BookASTService {
    generateAST(book: Book): BookAST;
    private partToAST;
    private chapterToAST;
    private countWords;
    private calculateWordCount;
    private calculateCharacterCount;
    generateTableOfContents(ast: BookAST): any[];
}
