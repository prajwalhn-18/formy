import PDFDocument from "pdfkit";
import { Book } from "../dal/models/Book.js";
import { FormatPreset } from "./formatPresets.js";
import { Theme } from "./themeSystem.js";
type PDFDoc = InstanceType<typeof PDFDocument>;
interface PDFOptions {
    format: FormatPreset;
    theme: Theme;
    includeTableOfContents: boolean;
    includeFrontmatter: boolean;
    includeBackmatter: boolean;
    pageNumbers: boolean;
}
export declare class PDFRendererService {
    private astService;
    generatePDF(book: Book, options: PDFOptions): Promise<PDFDoc>;
    private getPageSize;
    private addTitlePage;
    private addTableOfContents;
    private addFrontmatter;
    private addBackmatter;
    private addPartTitle;
    private addChapter;
    private getChapterTitle;
    private formatTitle;
    private toRoman;
    private addPageNumbers;
}
export {};
