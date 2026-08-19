import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Palette } from "lucide-react";
import { getThemes } from "@/services/bookService";

export default function ThemesPage() {
    const [themes, setThemes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadThemes();
    }, []);

    const loadThemes = async () => {
        setIsLoading(true);
        const result = await getThemes();
        if (result.success && result.data) {
            setThemes(result.data);
        }
        setIsLoading(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Themes</h2>
                <p className="text-muted-foreground">
                    Visual themes for styling your books
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {themes.map((theme) => (
                    <Card key={theme.id}>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <Palette className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <CardTitle>{theme.name}</CardTitle>
                            <CardDescription>{theme.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <h4 className="text-sm font-semibold mb-2">Color Scheme</h4>
                                <div className="grid grid-cols-3 gap-2">
                                    <div>
                                        <div
                                            className="h-10 rounded border"
                                            style={{ backgroundColor: theme.colors.primary }}
                                        />
                                        <p className="text-xs mt-1 text-muted-foreground">Primary</p>
                                    </div>
                                    <div>
                                        <div
                                            className="h-10 rounded border"
                                            style={{ backgroundColor: theme.colors.secondary }}
                                        />
                                        <p className="text-xs mt-1 text-muted-foreground">
                                            Secondary
                                        </p>
                                    </div>
                                    <div>
                                        <div
                                            className="h-10 rounded border"
                                            style={{ backgroundColor: theme.colors.accent }}
                                        />
                                        <p className="text-xs mt-1 text-muted-foreground">Accent</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mt-2">
                                    <div>
                                        <div
                                            className="h-10 rounded border"
                                            style={{ backgroundColor: theme.colors.background }}
                                        />
                                        <p className="text-xs mt-1 text-muted-foreground">
                                            Background
                                        </p>
                                    </div>
                                    <div>
                                        <div
                                            className="h-10 rounded border"
                                            style={{ backgroundColor: theme.colors.text }}
                                        />
                                        <p className="text-xs mt-1 text-muted-foreground">Text</p>
                                    </div>
                                    <div>
                                        <div
                                            className="h-10 rounded border"
                                            style={{ backgroundColor: theme.colors.muted }}
                                        />
                                        <p className="text-xs mt-1 text-muted-foreground">Muted</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold mb-2">Typography</h4>
                                <div className="text-sm text-muted-foreground space-y-1">
                                    <p>Body: {theme.fonts.body}</p>
                                    <p>Heading: {theme.fonts.heading}</p>
                                    <p>Code: {theme.fonts.code}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold mb-2">Spacing</h4>
                                <div className="text-sm text-muted-foreground space-y-1">
                                    <p>Small: {theme.spacing.small}px</p>
                                    <p>Medium: {theme.spacing.medium}px</p>
                                    <p>Large: {theme.spacing.large}px</p>
                                </div>
                            </div>

                            {/* Preview */}
                            <div
                                className="p-4 rounded border mt-4"
                                style={{
                                    backgroundColor: theme.colors.background,
                                    color: theme.colors.text,
                                }}
                            >
                                <h5
                                    className="font-semibold mb-1"
                                    style={{
                                        fontFamily: theme.fonts.heading,
                                        color: theme.colors.primary,
                                    }}
                                >
                                    Preview
                                </h5>
                                <p
                                    className="text-sm"
                                    style={{ fontFamily: theme.fonts.body }}
                                >
                                    The quick brown fox jumps over the lazy dog.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
