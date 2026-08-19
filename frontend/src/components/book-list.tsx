import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Trash2, Loader2, BookMarked } from "lucide-react";
import { getAllBooks, deleteBook, type Book } from "@/services/bookService";
import { BookImportDialog } from "./book-import-dialog";
import { format } from "date-fns";

export function BookList() {
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const navigate = useNavigate();

    const loadBooks = async () => {
        setIsLoading(true);
        const result = await getAllBooks();
        if (result.success && result.data) {
            setBooks(result.data);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadBooks();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this book?")) {
            return;
        }

        setDeletingId(id);
        const result = await deleteBook(id);
        setDeletingId(null);

        if (result.success) {
            setBooks(books.filter((book) => book.id !== id));
        }
    };

    const handleViewBook = (id: number) => {
        navigate(`/books/${id}`);
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
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Books</h2>
                    <p className="text-muted-foreground">
                        Manage your book collection
                    </p>
                </div>
                <BookImportDialog onImportSuccess={loadBooks} />
            </div>

            {books.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center h-64">
                        <BookMarked className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-semibold mb-2">No books yet</p>
                        <p className="text-muted-foreground mb-4">Get started by importing your first book</p>
                        <BookImportDialog onImportSuccess={loadBooks} />
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {books.map((book) => (
                        <Card key={book.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                                    {book.hasParts && (
                                        <Badge variant="secondary" className="text-xs">
                                            Has Parts
                                        </Badge>
                                    )}
                                </div>
                                <CardTitle className="line-clamp-1">{book.title}</CardTitle>
                                <CardDescription className="line-clamp-1">
                                    {book.author || "Unknown Author"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {book.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                        {book.description}
                                    </p>
                                )}
                                <div className="flex gap-2 text-xs text-muted-foreground">
                                    <span>{book.chapters?.length || 0} chapters</span>
                                    {book.hasParts && <span>• {book.parts?.length || 0} parts</span>}
                                </div>
                                <div className="text-xs text-muted-foreground mt-2">
                                    Updated {format(new Date(book.updatedAt), "MMM d, yyyy")}
                                </div>
                            </CardContent>
                            <CardFooter className="flex gap-2">
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => handleViewBook(book.id)}
                                >
                                    <BookOpen className="mr-2 h-4 w-4" />
                                    View
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(book.id)}
                                    disabled={deletingId === book.id}
                                >
                                    {deletingId === book.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="h-4 w-4" />
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
