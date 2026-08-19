import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText } from "lucide-react";
import { getFormats } from "@/services/bookService";

export default function FormatsPage() {
    const [formats, setFormats] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadFormats();
    }, []);

    const loadFormats = async () => {
        setIsLoading(true);
        const result = await getFormats();
        if (result.success && result.data) {
            setFormats(result.data);
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
                <h2 className="text-3xl font-bold tracking-tight">Format Presets</h2>
                <p className="text-muted-foreground">
                    Professional formatting presets for different types of books
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {formats.map((format) => (
                    <Card key={format.id}>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <Badge variant="outline" className="text-xs capitalize">
                                    {format.category}
                                </Badge>
                            </div>
                            <CardTitle>{format.name}</CardTitle>
                            <CardDescription>{format.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <h4 className="text-sm font-semibold mb-2">Page Settings</h4>
                                <div className="text-sm text-muted-foreground space-y-1">
                                    <p>Size: {format.pageSize}</p>
                                    <p>
                                        Margins: {format.margins.top}mm (top) × {format.margins.right}mm (right)
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold mb-2">Typography</h4>
                                <div className="text-sm text-muted-foreground space-y-1">
                                    <p>Body: {format.typography.bodyFont}</p>
                                    <p>Heading: {format.typography.headingFont}</p>
                                    <p>Size: {format.typography.bodySize}pt</p>
                                    <p>Line Height: {format.typography.lineHeight}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold mb-2">Chapter Style</h4>
                                <div className="text-sm text-muted-foreground space-y-1">
                                    <p>
                                        New Page: {format.chapterStyle.startOnNewPage ? "Yes" : "No"}
                                    </p>
                                    <p className="capitalize">
                                        Numbering: {format.chapterStyle.numberingStyle}
                                    </p>
                                    <p className="capitalize">
                                        Alignment: {format.chapterStyle.titleAlignment}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
