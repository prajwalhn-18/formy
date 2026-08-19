import PDFDocument from "pdfkit";
import { Book } from "../dal/models/Book.js";
import { FormatPreset } from "./formatPresets.js";
import { Theme } from "./themeSystem.js";
import { BookASTService } from "./bookAst.js";

type PDFDoc = InstanceType<typeof PDFDocument>;

interface PDFOptions {
    format: FormatPreset;
    theme: Theme;
    includeTableOfContents: boolean;
    includeFrontmatter: boolean;
    includeBackmatter: boolean;
    pageNumbers: boolean;
}

export class PDFRendererService {
    private astService = new BookASTService();

    async generatePDF(book: Book, options: PDFOptions): Promise<PDFDoc> {
        const doc = new PDFDocument({
            size: this.getPageSize(options.format.pageSize),
            margins: options.format.margins,
            info: {
                Title: book.title,
                Author: book.author || "Unknown",
            },
        });

        // Generate AST for structured processing
        const ast = this.astService.generateAST(book);

        // Title page
        this.addTitlePage(doc, book, options);

        // Table of Contents
        if (options.includeTableOfContents) {
            doc.addPage();
            this.addTableOfContents(doc, ast, options);
        }

        // Frontmatter
        if (options.includeFrontmatter && book.frontmatter) {
            doc.addPage();
            this.addFrontmatter(doc, book.frontmatter, options);
        }

        // Main content
        const sortedChapters = book.chapters?.sort((a, b) => a.order - b.order) || [];
        const sortedParts = book.parts?.sort((a, b) => a.order - b.order) || [];

        if (book.hasParts && sortedParts.length > 0) {
            sortedParts.forEach((part, index) => {
                if (index > 0 || options.includeTableOfContents || options.includeFrontmatter) {
                    doc.addPage();
                }
                this.addPartTitle(doc, part.title, options);

                const partChapters = part.chapters?.sort((a, b) => a.order - b.order) || [];
                partChapters.forEach((chapter, chapterIndex) => {
                    if (chapterIndex > 0 || options.format.chapterStyle.startOnNewPage) {
                        doc.addPage();
                    }
                    this.addChapter(doc, chapter.title, chapter.content, chapter.order, options);
                });
            });
        } else {
            sortedChapters.forEach((chapter, index) => {
                if (index > 0 && options.format.chapterStyle.startOnNewPage) {
                    doc.addPage();
                } else if (index === 0 && (options.includeTableOfContents || options.includeFrontmatter)) {
                    doc.addPage();
                }
                this.addChapter(doc, chapter.title, chapter.content, chapter.order, options);
            });
        }

        // Backmatter
        if (options.includeBackmatter && book.backmatter) {
            doc.addPage();
            this.addBackmatter(doc, book.backmatter, options);
        }

        // Add page numbers
        if (options.pageNumbers) {
            this.addPageNumbers(doc);
        }

        doc.end();
        return doc;
    }

    private getPageSize(size: string): [number, number] {
        const sizes: Record<string, [number, number]> = {
            A4: [595.28, 841.89],
            A5: [419.53, 595.28],
            letter: [612, 792],
            "6x9": [432, 648],
        };
        return sizes[size] || sizes.letter;
    }

    private addTitlePage(doc: any, book: Book, options: PDFOptions) {
        const pageWidth = doc.page.width;
        const pageHeight = doc.page.height;

        doc.font("Helvetica-Bold")
            .fontSize(options.format.typography.headingSize * 2)
            .text(book.title, 0, pageHeight / 3, {
                align: "center",
                width: pageWidth,
            });

        if (book.author) {
            doc.moveDown(2)
                .font("Helvetica")
                .fontSize(options.format.typography.headingSize)
                .text(`by ${book.author}`, {
                    align: "center",
                });
        }

        if (book.description) {
            doc.moveDown(3)
                .font("Helvetica")
                .fontSize(options.format.typography.bodySize)
                .text(book.description, {
                    align: "center",
                    width: pageWidth * 0.7,
                });
        }
    }

    private addTableOfContents(doc: any, ast: any, options: PDFOptions) {
        doc.font("Helvetica-Bold")
            .fontSize(options.format.typography.headingSize)
            .text("Table of Contents", { align: "center" });

        doc.moveDown(2);

        const toc = this.astService.generateTableOfContents(ast);

        toc.forEach((item) => {
            if (item.type === "part") {
                doc.font("Helvetica-Bold")
                    .fontSize(options.format.typography.bodySize + 1)
                    .text(item.title);
                doc.moveDown(0.5);

                item.children?.forEach((chapter: any) => {
                    const chapterTitle = this.getChapterTitle(
                        chapter.order,
                        chapter.title,
                        options.format.chapterStyle.numberingStyle
                    );
                    doc.font("Helvetica")
                        .fontSize(options.format.typography.bodySize)
                        .text(`    ${chapterTitle}`);
                    doc.moveDown(0.3);
                });
                doc.moveDown(0.7);
            } else if (item.type === "chapter") {
                const chapterTitle = this.getChapterTitle(
                    item.order,
                    item.title,
                    options.format.chapterStyle.numberingStyle
                );
                doc.font("Helvetica")
                    .fontSize(options.format.typography.bodySize)
                    .text(chapterTitle);
                doc.moveDown(0.5);
            }
        });
    }

    private addFrontmatter(doc: any, frontmatter: string, options: PDFOptions) {
        doc.font("Helvetica-Bold")
            .fontSize(options.format.typography.headingSize)
            .text("Frontmatter", { align: "center" });

        doc.moveDown(2);

        doc.font("Helvetica")
            .fontSize(options.format.typography.bodySize)
            .text(frontmatter, {
                align: "left",
                lineGap: options.format.typography.lineHeight,
            });
    }

    private addBackmatter(doc: any, backmatter: string, options: PDFOptions) {
        doc.font("Helvetica-Bold")
            .fontSize(options.format.typography.headingSize)
            .text("Backmatter", { align: "center" });

        doc.moveDown(2);

        doc.font("Helvetica")
            .fontSize(options.format.typography.bodySize)
            .text(backmatter, {
                align: "left",
                lineGap: options.format.typography.lineHeight,
            });
    }

    private addPartTitle(doc: any, title: string, options: PDFOptions) {
        doc.font("Helvetica-Bold")
            .fontSize(options.format.typography.headingSize * 1.5)
            .text(this.formatTitle(title, options.format.chapterStyle.titleCase), {
                align: options.format.chapterStyle.titleAlignment,
            });

        doc.moveDown(3);
    }

    private addChapter(
        doc: any,
        title: string,
        content: string,
        order: number,
        options: PDFOptions
    ) {
        const chapterTitle = this.getChapterTitle(
            order,
            title,
            options.format.chapterStyle.numberingStyle
        );

        doc.font("Helvetica-Bold")
            .fontSize(options.format.typography.headingSize)
            .text(this.formatTitle(chapterTitle, options.format.chapterStyle.titleCase), {
                align: options.format.chapterStyle.titleAlignment,
            });

        doc.moveDown(2);

        const paragraphs = content.split("\n\n").filter((p) => p.trim());

        paragraphs.forEach((paragraph, index) => {
            if (index > 0 && options.format.layout.firstLineIndent > 0) {
                doc.x += options.format.layout.firstLineIndent;
            }

            doc.font("Helvetica")
                .fontSize(options.format.typography.bodySize)
                .text(paragraph.trim(), {
                    align: "left",
                    lineGap: options.format.typography.lineHeight,
                });

            if (index < paragraphs.length - 1) {
                doc.moveDown(options.format.typography.paragraphSpacing / 10);
            }
        });
    }

    private getChapterTitle(
        order: number,
        title: string,
        style: "numeric" | "roman" | "none"
    ): string {
        if (style === "none") return title;
        if (style === "roman") return `${this.toRoman(order)}. ${title}`;
        return `Chapter ${order}: ${title}`;
    }

    private formatTitle(title: string, style: "uppercase" | "capitalize" | "none"): string {
        if (style === "uppercase") return title.toUpperCase();
        if (style === "capitalize") {
            return title
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(" ");
        }
        return title;
    }

    private toRoman(num: number): string {
        const romanNumerals: [number, string][] = [
            [1000, "M"],
            [900, "CM"],
            [500, "D"],
            [400, "CD"],
            [100, "C"],
            [90, "XC"],
            [50, "L"],
            [40, "XL"],
            [10, "X"],
            [9, "IX"],
            [5, "V"],
            [4, "IV"],
            [1, "I"],
        ];

        let result = "";
        for (const [value, numeral] of romanNumerals) {
            while (num >= value) {
                result += numeral;
                num -= value;
            }
        }
        return result;
    }

    private addPageNumbers(doc: any) {
        const pages = doc.bufferedPageRange();
        for (let i = 0; i < pages.count; i++) {
            doc.switchToPage(pages.start + i);
            doc.font("Helvetica")
                .fontSize(10)
                .text(
                    `${i + 1}`,
                    0,
                    doc.page.height - 50,
                    { align: "center" }
                );
        }
    }
}
