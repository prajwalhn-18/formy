import { Request, Response } from "express";
import { AppDataSource } from "../dal/dataSource.js";
import { Book } from "../dal/models/Book.js";
import { BookASTService } from "../services/bookAst.js";
import { FormatPresetService, FORMAT_PRESETS } from "../services/formatPresets.js";
import { ThemeService, THEMES } from "../services/themeSystem.js";
import { PDFRendererService } from "../services/pdfRenderer.js";

const bookRepository = AppDataSource.getRepository(Book);
const astService = new BookASTService();
const formatService = new FormatPresetService();
const themeService = new ThemeService();
const pdfService = new PDFRendererService();

const exportController = {
    getBookAST: async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const book = await bookRepository.findOne({
                where: { id },
                relations: ["parts", "parts.chapters", "chapters"],
            });

            if (!book) {
                res.status(404).json({ error: "Book not found" });
                return;
            }

            const ast = astService.generateAST(book);
            res.json(ast);
        } catch (error) {
            console.error("AST generation error:", error);
            res.status(500).json({ error: "Failed to generate AST" });
        }
    },

    getTableOfContents: async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const book = await bookRepository.findOne({
                where: { id },
                relations: ["parts", "parts.chapters", "chapters"],
            });

            if (!book) {
                res.status(404).json({ error: "Book not found" });
                return;
            }

            const ast = astService.generateAST(book);
            const toc = astService.generateTableOfContents(ast);
            res.json(toc);
        } catch (error) {
            console.error("TOC generation error:", error);
            res.status(500).json({ error: "Failed to generate table of contents" });
        }
    },

    getAllFormats: async (req: Request, res: Response) => {
        try {
            const formats = formatService.getAllPresets();
            res.json(formats);
        } catch (error) {
            console.error("Format fetch error:", error);
            res.status(500).json({ error: "Failed to fetch formats" });
        }
    },

    getFormat: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const format = formatService.getPreset(id);

            if (!format) {
                res.status(404).json({ error: "Format not found" });
                return;
            }

            res.json(format);
        } catch (error) {
            console.error("Format fetch error:", error);
            res.status(500).json({ error: "Failed to fetch format" });
        }
    },

    getAllThemes: async (req: Request, res: Response) => {
        try {
            const themes = themeService.getAllThemes();
            res.json(themes);
        } catch (error) {
            console.error("Theme fetch error:", error);
            res.status(500).json({ error: "Failed to fetch themes" });
        }
    },

    getTheme: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const theme = themeService.getTheme(id);

            if (!theme) {
                res.status(404).json({ error: "Theme not found" });
                return;
            }

            res.json(theme);
        } catch (error) {
            console.error("Theme fetch error:", error);
            res.status(500).json({ error: "Failed to fetch theme" });
        }
    },

    exportPDF: async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const {
                formatId = "novel",
                themeId = "classic",
                includeTableOfContents = true,
                includeFrontmatter = true,
                includeBackmatter = true,
                pageNumbers = true,
            } = req.body;

            const book = await bookRepository.findOne({
                where: { id },
                relations: ["parts", "parts.chapters", "chapters"],
            });

            if (!book) {
                res.status(404).json({ error: "Book not found" });
                return;
            }

            const format = FORMAT_PRESETS[formatId] || FORMAT_PRESETS.novel;
            const theme = THEMES[themeId] || THEMES.classic;

            const pdfDoc = await pdfService.generatePDF(book, {
                format,
                theme,
                includeTableOfContents,
                includeFrontmatter,
                includeBackmatter,
                pageNumbers,
            });

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
                "Content-Disposition",
                `attachment; filename="${book.title.replace(/[^a-z0-9]/gi, "_")}.pdf"`
            );

            pdfDoc.pipe(res);
        } catch (error) {
            console.error("PDF export error:", error);
            res.status(500).json({ error: "Failed to export PDF" });
        }
    },
};

export default exportController;
