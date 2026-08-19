import { Book } from "../dal/models/Book.js";
import { Part } from "../dal/models/Part.js";
import { Chapter } from "../dal/models/Chapter.js";

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

export class BookASTService {
    generateAST(book: Book): BookAST {
        const ast: BookAST = {
            type: "book",
            metadata: {
                title: book.title,
                author: book.author,
                description: book.description,
                createdAt: book.createdAt,
                updatedAt: book.updatedAt,
                hasParts: book.hasParts,
                wordCount: this.calculateWordCount(book),
                characterCount: this.calculateCharacterCount(book),
                chapterCount: book.chapters?.length || 0,
                partCount: book.parts?.length || 0,
            },
            children: [],
        };

        // Add frontmatter if present
        if (book.frontmatter) {
            ast.children.push({
                type: "frontmatter",
                content: book.frontmatter,
                metadata: {
                    wordCount: this.countWords(book.frontmatter),
                    characterCount: book.frontmatter.length,
                },
            });
        }

        // Add main content
        if (book.hasParts && book.parts) {
            const sortedParts = book.parts.sort((a, b) => a.order - b.order);
            ast.children.push({
                type: "mainmatter",
                children: sortedParts.map((part) => this.partToAST(part)),
            });
        } else if (book.chapters) {
            const sortedChapters = book.chapters.sort((a, b) => a.order - b.order);
            ast.children.push({
                type: "mainmatter",
                children: sortedChapters.map((chapter) => this.chapterToAST(chapter)),
            });
        }

        // Add backmatter if present
        if (book.backmatter) {
            ast.children.push({
                type: "backmatter",
                content: book.backmatter,
                metadata: {
                    wordCount: this.countWords(book.backmatter),
                    characterCount: book.backmatter.length,
                },
            });
        }

        return ast;
    }

    private partToAST(part: Part): ASTNode {
        const sortedChapters = part.chapters?.sort((a, b) => a.order - b.order) || [];

        return {
            type: "part",
            metadata: {
                id: part.id,
                title: part.title,
                description: part.description,
                order: part.order,
                chapterCount: sortedChapters.length,
            },
            children: sortedChapters.map((chapter) => this.chapterToAST(chapter)),
        };
    }

    private chapterToAST(chapter: Chapter): ASTNode {
        const paragraphs = chapter.content
            .split("\n\n")
            .filter((p) => p.trim())
            .map((content) => ({
                type: "paragraph",
                content: content.trim(),
                metadata: {
                    wordCount: this.countWords(content),
                    characterCount: content.length,
                },
            }));

        return {
            type: "chapter",
            metadata: {
                id: chapter.id,
                title: chapter.title,
                order: chapter.order,
                wordCount: this.countWords(chapter.content),
                characterCount: chapter.content.length,
                paragraphCount: paragraphs.length,
            },
            children: paragraphs,
        };
    }

    private countWords(text: string): number {
        return text
            .trim()
            .split(/\s+/)
            .filter((word) => word.length > 0).length;
    }

    private calculateWordCount(book: Book): number {
        let total = 0;

        if (book.frontmatter) {
            total += this.countWords(book.frontmatter);
        }

        if (book.chapters) {
            total += book.chapters.reduce(
                (sum, chapter) => sum + this.countWords(chapter.content),
                0
            );
        }

        if (book.backmatter) {
            total += this.countWords(book.backmatter);
        }

        return total;
    }

    private calculateCharacterCount(book: Book): number {
        let total = 0;

        if (book.frontmatter) {
            total += book.frontmatter.length;
        }

        if (book.chapters) {
            total += book.chapters.reduce(
                (sum, chapter) => sum + chapter.content.length,
                0
            );
        }

        if (book.backmatter) {
            total += book.backmatter.length;
        }

        return total;
    }

    generateTableOfContents(ast: BookAST): any[] {
        const toc: any[] = [];

        const mainmatter = ast.children.find((node) => node.type === "mainmatter");
        if (!mainmatter || !mainmatter.children) {
            return toc;
        }

        mainmatter.children.forEach((node) => {
            if (node.type === "part") {
                toc.push({
                    type: "part",
                    title: node.metadata?.title,
                    order: node.metadata?.order,
                    children: node.children?.map((chapter) => ({
                        type: "chapter",
                        title: chapter.metadata?.title,
                        order: chapter.metadata?.order,
                        id: chapter.metadata?.id,
                    })),
                });
            } else if (node.type === "chapter") {
                toc.push({
                    type: "chapter",
                    title: node.metadata?.title,
                    order: node.metadata?.order,
                    id: node.metadata?.id,
                });
            }
        });

        return toc;
    }
}
