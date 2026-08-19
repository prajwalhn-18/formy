import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ArrowLeft, BookOpen, ChevronDown, ChevronRight, FileText, Loader2, Edit, Eye } from "lucide-react";
import { getBook, type Book, type Chapter } from "@/services/bookService";
import { format } from "date-fns";
import { ChapterOrganizer } from "./chapter-organizer";
import { TextBlockEditor } from "./text-block-editor";
import { FrontBackMatterEditor } from "./frontback-matter-editor";
import { ExportDialog } from "./export-dialog";
import { BookPreview } from "./book-preview";

export function BookDetail() {
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<Book | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
    const [expandedParts, setExpandedParts] = useState<Set<number>>(new Set());
    const [editMode, setEditMode] = useState(false);
    const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
    const [activeTab, setActiveTab] = useState("content");
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            loadBook(parseInt(id));
        }
    }, [id]);

    const loadBook = async (bookId: number) => {
        setIsLoading(true);
        const result = await getBook(bookId);
        if (result.success && result.data) {
            setBook(result.data);
            if (result.data.hasParts && result.data.parts && result.data.parts.length > 0) {
                const firstPart = result.data.parts[0];
                setExpandedParts(new Set([firstPart.id]));
                if (firstPart.chapters && firstPart.chapters.length > 0) {
                    setSelectedChapter(firstPart.chapters[0]);
                }
            } else if (result.data.chapters && result.data.chapters.length > 0) {
                setSelectedChapter(result.data.chapters[0]);
            }
        }
        setIsLoading(false);
    };

    const togglePart = (partId: number) => {
        const newExpanded = new Set(expandedParts);
        if (newExpanded.has(partId)) {
            newExpanded.delete(partId);
        } else {
            newExpanded.add(partId);
        }
        setExpandedParts(newExpanded);
    };

    const handleReload = async () => {
        if (id) {
            await loadBook(parseInt(id));
        }
    };

    const handleEditChapter = (chapter: Chapter) => {
        setEditingChapter(chapter);
    };

    const handleSaveChapter = async () => {
        setEditingChapter(null);
        await handleReload();
    };

    const handleCancelEdit = () => {
        setEditingChapter(null);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!book) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center h-64">
                    <p className="text-lg font-semibold mb-2">Book not found</p>
                    <Button onClick={() => navigate("/books")}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Books
                    </Button>
                </CardContent>
            </Card>
        );
    }

    const sortedParts = book.parts?.sort((a, b) => a.order - b.order) || [];
    const sortedChapters = book.chapters?.sort((a, b) => a.order - b.order) || [];

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigate("/books")}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-3xl font-bold tracking-tight">{book.title}</h2>
                        {book.hasParts && (
                            <Badge variant="secondary">Has Parts</Badge>
                        )}
                    </div>
                    <p className="text-muted-foreground">{book.author || "Unknown Author"}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Updated {format(new Date(book.updatedAt), "MMMM d, yyyy")}
                    </p>
                </div>
                <div className="flex gap-2">
                    <ExportDialog bookId={book.id} bookTitle={book.title} />
                    <Button
                        variant={editMode ? "outline" : "default"}
                        onClick={() => setEditMode(!editMode)}
                    >
                        {editMode ? (
                            <>
                                <Eye className="mr-2 h-4 w-4" />
                                View Mode
                            </>
                        ) : (
                            <>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Mode
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <Separator />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    {editMode && <TabsTrigger value="organize">Organize</TabsTrigger>}
                    {editMode && <TabsTrigger value="frontback">Front/Back Matter</TabsTrigger>}
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="structure">Structure</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4">
                    {editingChapter ? (
                        <TextBlockEditor
                            chapter={editingChapter}
                            onSave={handleSaveChapter}
                            onCancel={handleCancelEdit}
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="md:col-span-1 h-fit max-h-[600px] overflow-y-auto">
                                <CardHeader>
                                    <CardTitle className="text-lg">Table of Contents</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {book.hasParts ? (
                                        sortedParts.map((part) => (
                                            <Collapsible
                                                key={part.id}
                                                open={expandedParts.has(part.id)}
                                                onOpenChange={() => togglePart(part.id)}
                                            >
                                                <CollapsibleTrigger className="flex items-center gap-2 w-full text-left p-2 hover:bg-accent rounded-md">
                                                    {expandedParts.has(part.id) ? (
                                                        <ChevronDown className="h-4 w-4" />
                                                    ) : (
                                                        <ChevronRight className="h-4 w-4" />
                                                    )}
                                                    <span className="font-semibold">{part.title}</span>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent className="ml-6 mt-1 space-y-1">
                                                    {part.chapters?.sort((a, b) => a.order - b.order).map((chapter) => (
                                                        <Button
                                                            key={chapter.id}
                                                            variant={selectedChapter?.id === chapter.id ? "secondary" : "ghost"}
                                                            className="w-full justify-start text-sm"
                                                            onClick={() => setSelectedChapter(chapter)}
                                                        >
                                                            <FileText className="h-4 w-4 mr-2" />
                                                            {chapter.title}
                                                        </Button>
                                                    ))}
                                                </CollapsibleContent>
                                            </Collapsible>
                                        ))
                                    ) : (
                                        sortedChapters.map((chapter) => (
                                            <Button
                                                key={chapter.id}
                                                variant={selectedChapter?.id === chapter.id ? "secondary" : "ghost"}
                                                className="w-full justify-start"
                                                onClick={() => setSelectedChapter(chapter)}
                                            >
                                                <FileText className="h-4 w-4 mr-2" />
                                                {chapter.title}
                                            </Button>
                                        ))
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="md:col-span-2">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>{selectedChapter?.title || "Select a chapter"}</CardTitle>
                                        {editMode && selectedChapter && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEditChapter(selectedChapter)}
                                            >
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit Chapter
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {selectedChapter ? (
                                        <div className="prose prose-sm max-w-none">
                                            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                                                {selectedChapter.content}
                                            </pre>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-64 text-muted-foreground">
                                            <div className="text-center">
                                                <BookOpen className="h-12 w-12 mx-auto mb-4" />
                                                <p>Select a chapter to view its content</p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </TabsContent>

                {editMode && (
                    <TabsContent value="organize" className="space-y-4">
                        <ChapterOrganizer book={book} onReorder={handleReload} />
                    </TabsContent>
                )}

                {editMode && (
                    <TabsContent value="frontback" className="space-y-4">
                        <FrontBackMatterEditor book={book} onSave={handleReload} />
                    </TabsContent>
                )}

                <TabsContent value="preview" className="space-y-4">
                    <BookPreview book={book} />
                </TabsContent>

                <TabsContent value="structure" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Book Structure</CardTitle>
                            <CardDescription>Overview of your book's organization</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="p-4 bg-muted rounded-lg">
                                    <div className="text-3xl font-bold">{sortedChapters.length}</div>
                                    <div className="text-sm text-muted-foreground">Chapters</div>
                                </div>
                                {book.hasParts && (
                                    <div className="p-4 bg-muted rounded-lg">
                                        <div className="text-3xl font-bold">{sortedParts.length}</div>
                                        <div className="text-sm text-muted-foreground">Parts</div>
                                    </div>
                                )}
                                <div className="p-4 bg-muted rounded-lg">
                                    <div className="text-3xl font-bold">
                                        {sortedChapters.reduce((acc, ch) => acc + ch.content.length, 0).toLocaleString()}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Characters</div>
                                </div>
                            </div>

                            {(book.frontmatter || book.backmatter) && (
                                <div className="space-y-2">
                                    <h3 className="font-semibold">Additional Content</h3>
                                    <div className="grid gap-2">
                                        {book.frontmatter && (
                                            <div className="p-3 bg-muted rounded-lg">
                                                <div className="font-medium text-sm">Frontmatter</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {book.frontmatter.length} characters
                                                </div>
                                            </div>
                                        )}
                                        {book.backmatter && (
                                            <div className="p-3 bg-muted rounded-lg">
                                                <div className="font-medium text-sm">Backmatter</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {book.backmatter.length} characters
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {book.hasParts && (
                                <div className="space-y-3">
                                    <h3 className="font-semibold">Parts & Chapters</h3>
                                    {sortedParts.map((part) => (
                                        <div key={part.id} className="border rounded-lg p-4">
                                            <div className="font-semibold mb-2">{part.title}</div>
                                            <div className="text-sm text-muted-foreground mb-2">
                                                {part.chapters?.length || 0} chapters
                                            </div>
                                            <ul className="list-disc list-inside space-y-1 text-sm">
                                                {part.chapters?.sort((a, b) => a.order - b.order).map((chapter) => (
                                                    <li key={chapter.id}>{chapter.title}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
