import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const parseMarkdownForPreview = (content: string) => {
  content = content.replace(/\*\*(.*?)\*\*/g, (match, boldText) => {
    return `<strong class="font-bold">${boldText}</strong>`;
  });
  content = content.replace(/\*(.*?)\*/g, (match, italicText) => {
    return `<em class="italic">${italicText}</em>`;
  });

  content = content.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, (match, text) => {
    return text;
  });

  content = content.replace(/^(#.*$)/gm, '');
  content = content.replace(/^\s*- .*/gm, '');
  content = content.replace(/^\s*\d+\. .*/gm, ''); 
  content = content.replace(/`(.*?)`/g, '');

  if (content.length > 100) {
    content = content.slice(0, 100) + '...';
  }

  return content;
};


interface NoteEntry {
  id: string;
  title: string;
  content: string;
  titleIV: string;
  contentIV: string;
  createdAt: string;
  updatedAt: string;
}

interface NotesTabProps {
  activeTab: string;
  selectedNote: NoteEntry | null;
  setSelectedNote: (note: NoteEntry | null) => void;
  notes: NoteEntry[];
  onDelete: (id: string) => void;
}

export function NotesTab({
  activeTab,
  selectedNote,
  setSelectedNote,
  notes,
  onDelete,
}: NotesTabProps) {
  if (!notes.length) {
    return (
      <div className="flex items-center justify-center p-8 text-center text-sm text-muted-foreground">
        No notes found.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {notes.map((note) => (
        <div
          key={note.id}
          className={cn(
            "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors",
            selectedNote?.id === note.id
              ? "bg-rose-50 dark:bg-rose-900"
              : "hover:bg-rose-50/50 dark:hover:bg-rose-900/50"
          )}
          onClick={() => setSelectedNote(note)}
        >
          <div className="min-w-0 flex-1">
            <h3 className="font-medium truncate">{note.title}</h3>
            <div
              className="text-sm text-muted-foreground truncate"
              dangerouslySetInnerHTML={{
                __html: parseMarkdownForPreview(note.content),
              }}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Updated {formatDistanceToNow(new Date(note.updatedAt))} ago
            </p>
          </div>
          {selectedNote?.id === note.id && (
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
