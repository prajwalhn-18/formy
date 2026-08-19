import { Request, Response } from "express";
declare const exportController: {
    getBookAST: (req: Request, res: Response) => Promise<void>;
    getTableOfContents: (req: Request, res: Response) => Promise<void>;
    getAllFormats: (req: Request, res: Response) => Promise<void>;
    getFormat: (req: Request, res: Response) => Promise<void>;
    getAllThemes: (req: Request, res: Response) => Promise<void>;
    getTheme: (req: Request, res: Response) => Promise<void>;
    exportPDF: (req: Request, res: Response) => Promise<void>;
};
export default exportController;
