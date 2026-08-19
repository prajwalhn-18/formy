import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { getFormats, getThemes, type Book } from "@/services/bookService";

interface BookPreviewProps {
    book: Book;
}

export function BookPreview({ book }: BookPreviewProps) {
    const [formats, setFormats] = useState<any[]>([]);
    const [themes, setThemes] = useState<any[]>([]);
    const [selectedFormat, setSelectedFormat] = useState<any>(null);
    const [selectedTheme, setSelectedTheme] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setIsLoading(true);
        const [formatsResult, themesResult] = await Promise.all([
            getFormats(),
            getThemes(),
        ]);

        if (formatsResult.success && formatsResult.data) {
            setFormats(formatsResult.data);
            setSelectedFormat(formatsResult.data[0]);
        }

        if (themesResult.success && themesResult.data) {
            setThemes(themesResult.data);
            setSelectedTheme(themesResult.data[0]);
        }

        setIsLoading(false);
    };

    if (isLoading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        );
    }

    const applyThemeStyles = () => {
        if (!selectedTheme) return {};

        return {
            fontFamily: selectedTheme.fonts.body,
            color: selectedTheme.colors.text,
            backgroundColor: selectedTheme.colors.background,
            lineHeight: 1.6,
        };
    };

    const applyFormatStyles = () => {
        if (!selectedFormat) return {};

        return {
            fontSize: `${selectedFormat.typography.bodySize}pt`,
            padding: `${selectedFormat.margins.top}px ${selectedFormat.margins.right}px`,
        };
    };

    const sortedChapters = book.chapters?.sort((a, b) => a.order - b.order) || [];
    const sortedParts = book.parts?.sort((a, b) => a.order - b.order) || [];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Live Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="preview-format">Format</Label>
                        <select
                            id="preview-format"
                            value={selectedFormat?.id}
                            onChange={(e) => {
                                const format = formats.find((f) => f.id === e.target.value);
                                setSelectedFormat(format);
                            }}
                            className="w-full p-2 rounded-md border bg-background text-sm"
                        >
                            {formats.map((format) => (
                                <option key={format.id} value={format.id}>
                                    {format.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="preview-theme">Theme</Label>
                        <select
                            id="preview-theme"
                            value={selectedTheme?.id}
                            onChange={(e) => {
                                const theme = themes.find((t) => t.id === e.target.value);
                                setSelectedTheme(theme);
                            }}
                            className="w-full p-2 rounded-md border bg-background text-sm"
                        >
                            {themes.map((theme) => (
                                <option key={theme.id} value={theme.id}>
                                    {theme.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div
                    className="border rounded-lg p-6 max-h-[600px] overflow-y-auto shadow-inner"
                    style={{ ...applyThemeStyles(), ...applyFormatStyles() }}
                >
                    {/* Title Page */}
                    <div className="text-center mb-12">
                        <h1
                            className="text-4xl font-bold mb-4"
                            style={{
                                fontFamily: selectedTheme?.fonts.heading,
                                color: selectedTheme?.colors.primary,
                            }}
                        >
                            {book.title}
                        </h1>
                        {book.author && (
                            <p
                                className="text-xl mb-2"
                                style={{ fontFamily: selectedTheme?.fonts.heading }}
                            >
                                by {book.author}
                            </p>
                        )}
                        {book.description && (
                            <p className="text-sm mt-4 max-w-md mx-auto">
                                {book.description}
                            </p>
                        )}
                    </div>

                    {/* Frontmatter */}
                    {book.frontmatter && (
                        <div className="mb-8 pb-8 border-b">
                            <h2
                                className="text-2xl font-semibold mb-4 text-center"
                                style={{
                                    fontFamily: selectedTheme?.fonts.heading,
                                    color: selectedTheme?.colors.primary,
                                }}
                            >
                                Frontmatter
                            </h2>
                            <div className="whitespace-pre-wrap">{book.frontmatter}</div>
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="space-y-8">
                        {book.hasParts && sortedParts.length > 0 ? (
                            sortedParts.map((part) => (
                                <div key={part.id} className="mb-12">
                                    <h2
                                        className="text-3xl font-bold mb-6 text-center"
                                        style={{
                                            fontFamily: selectedTheme?.fonts.heading,
                                            color: selectedTheme?.colors.primary,
                                            textTransform:
                                                selectedFormat?.chapterStyle.titleCase === "uppercase"
                                                    ? "uppercase"
                                                    : "none",
                                        }}
                                    >
                                        {part.title}
                                    </h2>
                                    {part.chapters
                                        ?.sort((a, b) => a.order - b.order)
                                        .map((chapter) => (
                                            <div key={chapter.id} className="mb-8">
                                                <h3
                                                    className="text-xl font-semibold mb-4"
                                                    style={{
                                                        fontFamily: selectedTheme?.fonts.heading,
                                                        color: selectedTheme?.colors.secondary,
                                                        textAlign:
                                                            selectedFormat?.chapterStyle.titleAlignment ||
                                                            "left",
                                                    }}
                                                >
                                                    {selectedFormat?.chapterStyle.numberingStyle ===
                                                    "numeric"
                                                        ? `Chapter ${chapter.order}: `
                                                        : ""}
                                                    {chapter.title}
                                                </h3>
                                                <div className="whitespace-pre-wrap">
                                                    {chapter.content}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            ))
                        ) : (
                            sortedChapters.map((chapter) => (
                                <div key={chapter.id} className="mb-8">
                                    <h2
                                        className="text-2xl font-semibold mb-4"
                                        style={{
                                            fontFamily: selectedTheme?.fonts.heading,
                                            color: selectedTheme?.colors.primary,
                                            textAlign:
                                                selectedFormat?.chapterStyle.titleAlignment || "left",
                                            textTransform:
                                                selectedFormat?.chapterStyle.titleCase === "uppercase"
                                                    ? "uppercase"
                                                    : "none",
                                        }}
                                    >
                                        {selectedFormat?.chapterStyle.numberingStyle === "numeric"
                                            ? `Chapter ${chapter.order}: `
                                            : ""}
                                        {chapter.title}
                                    </h2>
                                    <div className="whitespace-pre-wrap">{chapter.content}</div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Backmatter */}
                    {book.backmatter && (
                        <div className="mt-12 pt-8 border-t">
                            <h2
                                className="text-2xl font-semibold mb-4 text-center"
                                style={{
                                    fontFamily: selectedTheme?.fonts.heading,
                                    color: selectedTheme?.colors.primary,
                                }}
                            >
                                Backmatter
                            </h2>
                            <div className="whitespace-pre-wrap">{book.backmatter}</div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
