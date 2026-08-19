import { useState, useEffect } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GripVertical, Save, X, Plus, Trash2 } from "lucide-react";
import { type Chapter, updateChapter } from "@/services/bookService";
import { Separator } from "@/components/ui/separator";

interface TextBlock {
    id: string;
    content: string;
}

interface SortableTextBlockProps {
    block: TextBlock;
    onEdit: (id: string, content: string) => void;
    onDelete: (id: string) => void;
}

function SortableTextBlock({ block, onEdit, onDelete }: SortableTextBlockProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: block.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex gap-2 mb-3 p-3 bg-muted/30 rounded-md border"
        >
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing pt-2">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
                <textarea
                    value={block.content}
                    onChange={(e) => onEdit(block.id, e.target.value)}
                    className="w-full min-h-[100px] p-2 rounded-md border bg-background resize-y font-sans text-sm"
                    placeholder="Enter text block content..."
                />
            </div>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(block.id)}
                className="self-start"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}

interface TextBlockEditorProps {
    chapter: Chapter;
    onSave: () => void;
    onCancel: () => void;
}

export function TextBlockEditor({ chapter, onSave, onCancel }: TextBlockEditorProps) {
    const [title, setTitle] = useState(chapter.title);
    const [textBlocks, setTextBlocks] = useState<TextBlock[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        // Split content into paragraphs
        const paragraphs = chapter.content
            .split("\n\n")
            .filter((p) => p.trim())
            .map((content, index) => ({
                id: `block-${index}`,
                content: content.trim(),
            }));

        setTextBlocks(paragraphs.length > 0 ? paragraphs : [{ id: "block-0", content: "" }]);
    }, [chapter.content]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = textBlocks.findIndex((block) => block.id === active.id);
            const newIndex = textBlocks.findIndex((block) => block.id === over.id);

            setTextBlocks(arrayMove(textBlocks, oldIndex, newIndex));
        }
    };

    const handleEditBlock = (id: string, content: string) => {
        setTextBlocks(textBlocks.map((block) =>
            block.id === id ? { ...block, content } : block
        ));
    };

    const handleDeleteBlock = (id: string) => {
        if (textBlocks.length > 1) {
            setTextBlocks(textBlocks.filter((block) => block.id !== id));
        }
    };

    const handleAddBlock = () => {
        const newId = `block-${Date.now()}`;
        setTextBlocks([...textBlocks, { id: newId, content: "" }]);
    };

    const handleSave = async () => {
        setIsSaving(true);
        const content = textBlocks
            .filter((block) => block.content.trim())
            .map((block) => block.content)
            .join("\n\n");

        await updateChapter(chapter.id, { title, content });
        setIsSaving(false);
        onSave();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Chapter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="chapter-title">Chapter Title</Label>
                    <Input
                        id="chapter-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter chapter title"
                        className="mt-1"
                    />
                </div>

                <Separator />

                <div>
                    <div className="flex items-center justify-between mb-3">
                        <Label>Text Blocks</Label>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleAddBlock}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Block
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">
                        Drag and drop to reorder text blocks. Each block represents a paragraph.
                    </p>

                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={textBlocks.map((block) => block.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {textBlocks.map((block) => (
                                <SortableTextBlock
                                    key={block.id}
                                    block={block}
                                    onEdit={handleEditBlock}
                                    onDelete={handleDeleteBlock}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                </div>

                <Separator />

                <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={onCancel}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
