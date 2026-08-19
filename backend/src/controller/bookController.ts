import { Request, Response } from "express";
import { DocxImporterService } from "../services/docxImporter.js";
import { AppDataSource } from "../dal/dataSource.js";
import { Book } from "../dal/models/Book.js";
import { Chapter } from "../dal/models/Chapter.js";
import { Part } from "../dal/models/Part.js";

const docxService = new DocxImporterService();
const bookRepository = AppDataSource.getRepository(Book);
const chapterRepository = AppDataSource.getRepository(Chapter);
const partRepository = AppDataSource.getRepository(Part);

const bookController = {
    getAllBooks: async (req: Request, res: Response) => {
        try {
            const books = await docxService.getAllBooks();
            res.json(books);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch books" });
        }
    },

    getBook: async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const book = await docxService.getBook(id);

            if (!book) {
                res.status(404).json({ error: "Book not found" });
                return;
            }

            res.json(book);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch book" });
        }
    },

    deleteBook: async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            await docxService.deleteBook(id);
            res.json({ message: "Book deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: "Failed to delete book" });
        }
    },

    importDocx: async (req: Request, res: Response) => {
        try {
            if (!req.file) {
                res.status(400).json({ error: "No file uploaded" });
                return;
            }

            const { title, author, detectParts, detectChapters } = req.body;

            if (!title) {
                res.status(400).json({ error: "Title is required" });
                return;
            }

            const book = await docxService.importDocx(req.file.buffer, {
                title,
                author,
                detectParts: detectParts === "true",
                detectChapters: detectChapters !== "false"
            });

            res.json(book);
        } catch (error) {
            console.error("Import error:", error);
            res.status(500).json({ error: "Failed to import document" });
        }
    },

    updateBook: async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const { title, author, description, frontmatter, backmatter } = req.body;

            const book = await bookRepository.findOne({ where: { id } });
            if (!book) {
                res.status(404).json({ error: "Book not found" });
                return;
            }

            if (title !== undefined) book.title = title;
            if (author !== undefined) book.author = author;
            if (description !== undefined) book.description = description;
            if (frontmatter !== undefined) book.frontmatter = frontmatter;
            if (backmatter !== undefined) book.backmatter = backmatter;

            await bookRepository.save(book);
            res.json(book);
        } catch (error) {
            console.error("Update error:", error);
            res.status(500).json({ error: "Failed to update book" });
        }
    },

    reorderChapters: async (req: Request, res: Response) => {
        try {
            const { chapterIds } = req.body;

            if (!Array.isArray(chapterIds)) {
                res.status(400).json({ error: "chapterIds must be an array" });
                return;
            }

            for (let i = 0; i < chapterIds.length; i++) {
                await chapterRepository.update(
                    { id: chapterIds[i] },
                    { order: i + 1 }
                );
            }

            res.json({ message: "Chapters reordered successfully" });
        } catch (error) {
            console.error("Reorder error:", error);
            res.status(500).json({ error: "Failed to reorder chapters" });
        }
    },

    reorderParts: async (req: Request, res: Response) => {
        try {
            const { partIds } = req.body;

            if (!Array.isArray(partIds)) {
                res.status(400).json({ error: "partIds must be an array" });
                return;
            }

            for (let i = 0; i < partIds.length; i++) {
                await partRepository.update(
                    { id: partIds[i] },
                    { order: i + 1 }
                );
            }

            res.json({ message: "Parts reordered successfully" });
        } catch (error) {
            console.error("Reorder error:", error);
            res.status(500).json({ error: "Failed to reorder parts" });
        }
    },

    updateChapter: async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const { title, content, order } = req.body;

            const chapter = await chapterRepository.findOne({ where: { id } });
            if (!chapter) {
                res.status(404).json({ error: "Chapter not found" });
                return;
            }

            if (title !== undefined) chapter.title = title;
            if (content !== undefined) chapter.content = content;
            if (order !== undefined) chapter.order = order;

            await chapterRepository.save(chapter);
            res.json(chapter);
        } catch (error) {
            console.error("Update error:", error);
            res.status(500).json({ error: "Failed to update chapter" });
        }
    },

    updatePart: async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const { title, description, order } = req.body;

            const part = await partRepository.findOne({ where: { id } });
            if (!part) {
                res.status(404).json({ error: "Part not found" });
                return;
            }

            if (title !== undefined) part.title = title;
            if (description !== undefined) part.description = description;
            if (order !== undefined) part.order = order;

            await partRepository.save(part);
            res.json(part);
        } catch (error) {
            console.error("Update error:", error);
            res.status(500).json({ error: "Failed to update part" });
        }
    }
};

export default bookController;
