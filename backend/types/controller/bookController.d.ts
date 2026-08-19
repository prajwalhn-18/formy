import { Request, Response } from "express";
declare const bookController: {
    getAllBooks: (req: Request, res: Response) => Promise<void>;
    getBook: (req: Request, res: Response) => Promise<void>;
    deleteBook: (req: Request, res: Response) => Promise<void>;
    importDocx: (req: Request, res: Response) => Promise<void>;
    updateBook: (req: Request, res: Response) => Promise<void>;
    reorderChapters: (req: Request, res: Response) => Promise<void>;
    reorderParts: (req: Request, res: Response) => Promise<void>;
    updateChapter: (req: Request, res: Response) => Promise<void>;
    updatePart: (req: Request, res: Response) => Promise<void>;
};
export default bookController;
