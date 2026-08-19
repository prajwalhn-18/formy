import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save } from "lucide-react";
import { type Book, updateBook } from "@/services/bookService";

interface FrontBackMatterEditorProps {
    book: Book;
    onSave: () => void;
}

export function FrontBackMatterEditor({ book, onSave }: FrontBackMatterEditorProps) {
    const [frontmatter, setFrontmatter] = useState(book.frontmatter || "");
    const [backmatter, setBackmatter] = useState(book.backmatter || "");
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        await updateBook(book.id, {
            frontmatter: frontmatter || undefined,
            backmatter: backmatter || undefined,
        });
        setIsSaving(false);
        onSave();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Front & Back Matter</CardTitle>
                <CardDescription>
                    Add frontmatter (dedication, preface, etc.) and backmatter (appendix, glossary, etc.)
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="frontmatter">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="frontmatter">Frontmatter</TabsTrigger>
                        <TabsTrigger value="backmatter">Backmatter</TabsTrigger>
                    </TabsList>

                    <TabsContent value="frontmatter" className="space-y-4">
                        <div>
                            <Label htmlFor="frontmatter">Frontmatter Content</Label>
                            <p className="text-xs text-muted-foreground mb-2">
                                Add content that appears before the main text (dedication, preface, acknowledgments, etc.)
                            </p>
                            <textarea
                                id="frontmatter"
                                value={frontmatter}
                                onChange={(e) => setFrontmatter(e.target.value)}
                                className="w-full min-h-[300px] p-3 rounded-md border bg-background resize-y font-sans text-sm"
                                placeholder="Enter frontmatter content...&#10;&#10;Example:&#10;Dedication&#10;&#10;To my family...&#10;&#10;Preface&#10;&#10;This book explores..."
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="backmatter" className="space-y-4">
                        <div>
                            <Label htmlFor="backmatter">Backmatter Content</Label>
                            <p className="text-xs text-muted-foreground mb-2">
                                Add content that appears after the main text (appendix, glossary, bibliography, etc.)
                            </p>
                            <textarea
                                id="backmatter"
                                value={backmatter}
                                onChange={(e) => setBackmatter(e.target.value)}
                                className="w-full min-h-[300px] p-3 rounded-md border bg-background resize-y font-sans text-sm"
                                placeholder="Enter backmatter content...&#10;&#10;Example:&#10;Appendix A&#10;&#10;Additional resources...&#10;&#10;Glossary&#10;&#10;Term: Definition..."
                            />
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end mt-4">
                    <Button onClick={handleSave} disabled={isSaving}>
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
