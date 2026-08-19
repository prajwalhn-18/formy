import express from "express";
import multer from "multer";
import userController from "../controller/index.js";
import bookController from "../controller/bookController.js";
import exportController from "../controller/exportController.js";

const router = express.Router({ mergeParams: true });
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", (req, res) => {
    res.send("This is a simple route");
});

router.get("/users", async (req, res) => {
    const getUser = await userController.getUsers();
    res.send(getUser);
});

router.get("/books", bookController.getAllBooks);

router.get("/books/:id", bookController.getBook);

router.delete("/books/:id", bookController.deleteBook);

router.put("/books/:id", bookController.updateBook);

router.post("/books/import", upload.single("file"), bookController.importDocx);

router.put("/chapters/:id", bookController.updateChapter);

router.put("/parts/:id", bookController.updatePart);

router.post("/books/reorder-chapters", bookController.reorderChapters);

router.post("/books/reorder-parts", bookController.reorderParts);

// Export routes
router.get("/books/:id/ast", exportController.getBookAST);

router.get("/books/:id/toc", exportController.getTableOfContents);

router.post("/books/:id/export/pdf", exportController.exportPDF);

router.get("/formats", exportController.getAllFormats);

router.get("/formats/:id", exportController.getFormat);

router.get("/themes", exportController.getAllThemes);

router.get("/themes/:id", exportController.getTheme);

export default router;