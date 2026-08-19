import { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import { Download, Loader2 } from "lucide-react";
import { getFormats, getThemes, exportPDF } from "@/services/bookService";

interface ExportDialogProps {
    bookId: number;
    bookTitle: string;
}

export function ExportDialog({ bookId, bookTitle }: ExportDialogProps) {
    const [open, setOpen] = useState(false);
    const [formats, setFormats] = useState<any[]>([]);
    const [themes, setThemes] = useState<any[]>([]);
    const [selectedFormat, setSelectedFormat] = useState("novel");
    const [selectedTheme, setSelectedTheme] = useState("classic");
    const [includeTableOfContents, setIncludeTableOfContents] = useState(true);
    const [includeFrontmatter, setIncludeFrontmatter] = useState(true);
    const [includeBackmatter, setIncludeBackmatter] = useState(true);
    const [pageNumbers, setPageNumbers] = useState(true);
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        loadFormatsAndThemes();
    }, []);

    const loadFormatsAndThemes = async () => {
        const [formatsResult, themesResult] = await Promise.all([
            getFormats(),
            getThemes(),
        ]);

        if (formatsResult.success && formatsResult.data) {
            setFormats(formatsResult.data);
        }

        if (themesResult.success && themesResult.data) {
            setThemes(themesResult.data);
        }
    };

    const handleExport = async () => {
        setIsExporting(true);

        await exportPDF(bookId, {
            formatId: selectedFormat,
            themeId: selectedTheme,
            includeTableOfContents,
            includeFrontmatter,
            includeBackmatter,
            pageNumbers,
        });

        setIsExporting(false);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">
                    <Download className="mr-2 h-4 w-4" />
                    Export PDF
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Export to PDF</DialogTitle>
                    <DialogDescription>
                        Configure export settings for "{bookTitle}"
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="format">Format Preset</Label>
                        <select
                            id="format"
                            value={selectedFormat}
                            onChange={(e) => setSelectedFormat(e.target.value)}
                            className="w-full p-2 rounded-md border bg-background"
                        >
                            {formats.map((format) => (
                                <option key={format.id} value={format.id}>
                                    {format.name} - {format.description}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="theme">Theme</Label>
                        <select
                            id="theme"
                            value={selectedTheme}
                            onChange={(e) => setSelectedTheme(e.target.value)}
                            className="w-full p-2 rounded-md border bg-background"
                        >
                            {themes.map((theme) => (
                                <option key={theme.id} value={theme.id}>
                                    {theme.name} - {theme.description}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label>Options</Label>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="toc"
                                checked={includeTableOfContents}
                                onChange={(e) => setIncludeTableOfContents(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label htmlFor="toc" className="font-normal cursor-pointer">
                                Include Table of Contents
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="frontmatter"
                                checked={includeFrontmatter}
                                onChange={(e) => setIncludeFrontmatter(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label htmlFor="frontmatter" className="font-normal cursor-pointer">
                                Include Frontmatter
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="backmatter"
                                checked={includeBackmatter}
                                onChange={(e) => setIncludeBackmatter(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label htmlFor="backmatter" className="font-normal cursor-pointer">
                                Include Backmatter
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="pageNumbers"
                                checked={pageNumbers}
                                onChange={(e) => setPageNumbers(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label htmlFor="pageNumbers" className="font-normal cursor-pointer">
                                Include Page Numbers
                            </Label>
                        </div>
                    </div>

                    <div className="p-3 bg-muted rounded-md text-sm">
                        <p className="font-semibold mb-1">Selected Configuration:</p>
                        <p className="text-muted-foreground">
                            Format: {formats.find((f) => f.id === selectedFormat)?.name || selectedFormat}
                            <br />
                            Theme: {themes.find((t) => t.id === selectedTheme)?.name || selectedTheme}
                        </p>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isExporting}>
                        Cancel
                    </Button>
                    <Button onClick={handleExport} disabled={isExporting}>
                        {isExporting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Exporting...
                            </>
                        ) : (
                            <>
                                <Download className="mr-2 h-4 w-4" />
                                Export
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
