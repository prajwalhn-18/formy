import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Loader2 } from "lucide-react";
import { importDocx } from "@/services/bookService";

interface BookImportDialogProps {
    onImportSuccess?: () => void;
}

export function BookImportDialog({ onImportSuccess }: BookImportDialogProps) {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [detectParts, setDetectParts] = useState(false);
    const [detectChapters, setDetectChapters] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (!selectedFile.name.endsWith(".docx")) {
                alert("Please select a .docx file");
                return;
            }
            setFile(selectedFile);
            if (!title) {
                setTitle(selectedFile.name.replace(".docx", ""));
            }
        }
    };

    const handleImport = async () => {
        if (!file || !title) {
            alert("Please select a file and provide a title");
            return;
        }

        setIsUploading(true);
        const result = await importDocx(file, {
            title,
            author,
            detectParts,
            detectChapters,
        });

        setIsUploading(false);

        if (result.success) {
            setOpen(false);
            resetForm();
            onImportSuccess?.();
        }
    };

    const resetForm = () => {
        setFile(null);
        setTitle("");
        setAuthor("");
        setDetectParts(false);
        setDetectChapters(true);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Upload className="mr-2 h-4 w-4" />
                    Import DOCX
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Import Document</DialogTitle>
                    <DialogDescription>
                        Upload a .docx file to import your book. The system will automatically detect chapters and parts based on heading styles.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="file">Document File</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="file"
                                type="file"
                                accept=".docx"
                                onChange={handleFileChange}
                                className="cursor-pointer"
                            />
                            {file && <FileText className="h-5 w-5 text-muted-foreground" />}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="title">Book Title</Label>
                        <Input
                            id="title"
                            placeholder="Enter book title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="author">Author (Optional)</Label>
                        <Input
                            id="author"
                            placeholder="Enter author name"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="detectChapters"
                                checked={detectChapters}
                                onChange={(e) => setDetectChapters(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label htmlFor="detectChapters" className="font-normal cursor-pointer">
                                Auto-detect chapters (H1/H2 headings)
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="detectParts"
                                checked={detectParts}
                                onChange={(e) => setDetectParts(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label htmlFor="detectParts" className="font-normal cursor-pointer">
                                Detect parts and chapters (H1 = Parts, H2 = Chapters)
                            </Label>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isUploading}>
                        Cancel
                    </Button>
                    <Button onClick={handleImport} disabled={!file || !title || isUploading}>
                        {isUploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Importing...
                            </>
                        ) : (
                            <>
                                <Upload className="mr-2 h-4 w-4" />
                                Import
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
