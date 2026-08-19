import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { GripVertical, ChevronDown, ChevronRight } from "lucide-react";
import { type Part, type Chapter, reorderChapters, reorderParts } from "@/services/bookService";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SortableChapterProps {
    chapter: Chapter;
}

function SortableChapter({ chapter }: SortableChapterProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: chapter.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-2 p-2 bg-background border rounded-md mb-2"
        >
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
                <p className="text-sm font-medium">{chapter.title}</p>
                <p className="text-xs text-muted-foreground">
                    {chapter.content.length} characters
                </p>
            </div>
            <Badge variant="outline" className="text-xs">
                Order: {chapter.order}
            </Badge>
        </div>
    );
}

interface SortablePartProps {
    part: Part;
    expandedParts: Set<number>;
    togglePart: (id: number) => void;
}

function SortablePart({ part, expandedParts, togglePart }: SortablePartProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: part.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="border rounded-lg mb-3 bg-muted/50"
        >
            <Collapsible
                open={expandedParts.has(part.id)}
                onOpenChange={() => togglePart(part.id)}
            >
                <CollapsibleTrigger className="flex items-center gap-2 w-full p-3 hover:bg-accent rounded-t-lg">
                    <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                    </div>
                    {expandedParts.has(part.id) ? (
                        <ChevronDown className="h-4 w-4" />
                    ) : (
                        <ChevronRight className="h-4 w-4" />
                    )}
                    <span className="font-semibold flex-1 text-left">{part.title}</span>
                    <Badge variant="secondary" className="text-xs">
                        {part.chapters?.length || 0} chapters
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                        Order: {part.order}
                    </Badge>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-3 pt-0">
                    <div className="mt-2 text-xs text-muted-foreground">
                        Chapters in this part cannot be reordered independently. Reorder all chapters in the "Chapters Only" tab.
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
}

interface ChapterOrganizerProps {
    book: {
        id: number;
        hasParts: boolean;
        parts?: Part[];
        chapters?: Chapter[];
    };
    onReorder: () => void;
}

export function ChapterOrganizer({ book, onReorder }: ChapterOrganizerProps) {
    const [activeTab, setActiveTab] = useState<"chapters" | "parts">(
        book.hasParts ? "parts" : "chapters"
    );
    const [expandedParts, setExpandedParts] = useState<Set<number>>(new Set());

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const sortedChapters = [...(book.chapters || [])].sort((a, b) => a.order - b.order);
    const sortedParts = [...(book.parts || [])].sort((a, b) => a.order - b.order);

    const [chapters, setChapters] = useState(sortedChapters);
    const [parts, setParts] = useState(sortedParts);

    const togglePart = (partId: number) => {
        const newExpanded = new Set(expandedParts);
        if (newExpanded.has(partId)) {
            newExpanded.delete(partId);
        } else {
            newExpanded.add(partId);
        }
        setExpandedParts(newExpanded);
    };

    const handleChapterDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = chapters.findIndex((ch) => ch.id === active.id);
            const newIndex = chapters.findIndex((ch) => ch.id === over.id);

            const newChapters = arrayMove(chapters, oldIndex, newIndex);
            setChapters(newChapters);

            const chapterIds = newChapters.map((ch) => ch.id);
            await reorderChapters(chapterIds);
            onReorder();
        }
    };

    const handlePartDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = parts.findIndex((p) => p.id === active.id);
            const newIndex = parts.findIndex((p) => p.id === over.id);

            const newParts = arrayMove(parts, oldIndex, newIndex);
            setParts(newParts);

            const partIds = newParts.map((p) => p.id);
            await reorderParts(partIds);
            onReorder();
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Organize Structure</CardTitle>
            </CardHeader>
            <CardContent>
                {book.hasParts && (
                    <div className="flex gap-2 mb-4">
                        <Button
                            variant={activeTab === "parts" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setActiveTab("parts")}
                        >
                            Parts ({parts.length})
                        </Button>
                        <Button
                            variant={activeTab === "chapters" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setActiveTab("chapters")}
                        >
                            Chapters ({chapters.length})
                        </Button>
                    </div>
                )}

                {activeTab === "chapters" && (
                    <div>
                        <p className="text-sm text-muted-foreground mb-3">
                            Drag and drop to reorder chapters
                        </p>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleChapterDragEnd}
                        >
                            <SortableContext
                                items={chapters.map((ch) => ch.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {chapters.map((chapter) => (
                                    <SortableChapter key={chapter.id} chapter={chapter} />
                                ))}
                            </SortableContext>
                        </DndContext>
                    </div>
                )}

                {activeTab === "parts" && book.hasParts && (
                    <div>
                        <p className="text-sm text-muted-foreground mb-3">
                            Drag and drop to reorder parts
                        </p>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handlePartDragEnd}
                        >
                            <SortableContext
                                items={parts.map((p) => p.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {parts.map((part) => (
                                    <SortablePart
                                        key={part.id}
                                        part={part}
                                        expandedParts={expandedParts}
                                        togglePart={togglePart}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
