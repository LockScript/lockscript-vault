"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format, formatDistanceToNow } from "date-fns";
import {
  Bold,
  Check,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link,
  List,
  ListOrdered,
  Loader2,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface NoteEntry {
  id: string;
  title: string;
  content: string;
  titleIV: string;
  contentIV: string;
  createdAt: string;
  updatedAt: string;
}

interface NoteDetailsProps {
  note: NoteEntry;
  onEdit: (note: { title: string; content: string }) => Promise<void>;
  onDelete: () => void;
}

export function NoteDetails({ note, onEdit, onDelete }: NoteDetailsProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showWordCount, setShowWordCount] = useState(false);
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const contentInputRef = useRef<HTMLTextAreaElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wordCountRef = useRef<HTMLDivElement | null>(null);
  const [savedScrollPosition, setSavedScrollPosition] = useState<number | null>(
    null
  );
  const [savedSelectionInfo, setSavedSelectionInfo] = useState<{
    start: number;
    end: number;
  } | null>(null);

  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const charCount = content.length;

  const applyFormat = (format: string) => {
    if (!contentInputRef.current) return;

    const textarea = contentInputRef.current;
    const scrollTop = textarea.scrollTop;
    const currentContent = textarea.value;
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    const selectedText = currentContent.substring(selectionStart, selectionEnd);

    let newContent = currentContent;
    let newSelectionStart = selectionStart;
    let newSelectionEnd = selectionEnd;

    if (
      format === "bold" &&
      selectedText.startsWith("**") &&
      selectedText.endsWith("**")
    ) {
      const unformattedText = selectedText.substring(
        2,
        selectedText.length - 2
      );
      newContent =
        currentContent.substring(0, selectionStart) +
        unformattedText +
        currentContent.substring(selectionEnd);
      newSelectionStart = selectionStart;
      newSelectionEnd = selectionStart + unformattedText.length;
    } else if (selectionStart === selectionEnd) {
      if (format === "ul" || format === "ol") {
        const formattedText = format === "ul" ? "- " : "1. ";
        newContent =
          currentContent.substring(0, selectionStart) +
          formattedText +
          currentContent.substring(selectionEnd);
        newSelectionStart = selectionStart + formattedText.length;
        newSelectionEnd = newSelectionStart;
      } else {
        const placeholder = format.startsWith("h") ? "Heading" : "Text";
        let formattedText = "";

        switch (format) {
          case "h1":
            formattedText = `# ${placeholder}`;
            break;
          case "h2":
            formattedText = `## ${placeholder}`;
            break;
          case "h3":
            formattedText = `### ${placeholder}`;
            break;
          case "bold":
            formattedText = `**${placeholder}**`;
            break;
          case "italic":
            formattedText = `*${placeholder}*`;
            break;
          case "code":
            formattedText = `\`${placeholder}\``;
            break;
          case "link":
            formattedText = `[${placeholder}](url)`;
            break;
          default:
            return;
        }

        newContent =
          currentContent.substring(0, selectionStart) +
          formattedText +
          currentContent.substring(selectionEnd);

        if (format.startsWith("h")) {
          newSelectionStart =
            selectionStart + format.charAt(1).charCodeAt(0) - 48 + 1;
          newSelectionEnd = newSelectionStart + placeholder.length;
        } else {
          newSelectionStart = selectionStart + (format === "bold" ? 2 : 1);
          newSelectionEnd = newSelectionStart + placeholder.length;
        }
      }
    } else {
      let formattedText = "";

      switch (format) {
        case "h1":
          formattedText = `# ${selectedText}`;
          break;
        case "h2":
          formattedText = `## ${selectedText}`;
          break;
        case "h3":
          formattedText = `### ${selectedText}`;
          break;
        case "bold":
          formattedText = `**${selectedText}**`;
          break;
        case "italic":
          formattedText = `*${selectedText}*`;
          break;
        case "code":
          formattedText = `\`${selectedText}\``;
          break;
        case "link":
          formattedText = `[${selectedText}](url)`;
          break;
        case "ul":
          formattedText = selectedText
            .split("\n")
            .map((line) => {
              return line.trim() ? `- ${line}` : line;
            })
            .join("\n");
          break;
        case "ol":
          formattedText = selectedText
            .split("\n")
            .map((line, index) => {
              return line.trim() ? `${index + 1}. ${line}` : line;
            })
            .join("\n");
          break;
        default:
          formattedText = selectedText;
      }

      newContent =
        currentContent.substring(0, selectionStart) +
        formattedText +
        currentContent.substring(selectionEnd);
      newSelectionStart = selectionStart;
      newSelectionEnd = selectionStart + formattedText.length;
    }

    setSavedScrollPosition(scrollTop);
    setSavedSelectionInfo({ start: newSelectionStart, end: newSelectionEnd });

    if (contentInputRef.current) {
      const textarea = contentInputRef.current;
      textarea.focus();
      textarea.setSelectionRange(0, textarea.value.length);
      document.execCommand("insertText", false, newContent);
      textarea.setSelectionRange(newSelectionStart, newSelectionEnd);
      setContent(newContent);
    }
  };

  const handleTextareaKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      (e.ctrlKey || e.metaKey) &&
      (e.key === "Enter" || e.key.toLowerCase() === "s")
    ) {
      e.preventDefault();
      handleSave();
      return;
    }

    if (e.key === "Escape") {
      handleCancel();
      return;
    }

    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case "b":
          e.preventDefault();
          applyFormat("bold");
          return;
        case "i":
          e.preventDefault();
          applyFormat("italic");
          return;
        case "k":
          e.preventDefault();
          applyFormat("link");
          return;
        case "1":
          e.preventDefault();
          applyFormat("h1");
          return;
        case "2":
          e.preventDefault();
          applyFormat("h2");
          return;
        case "3":
          e.preventDefault();
          applyFormat("h3");
          return;
        case "l":
          e.preventDefault();
          applyFormat("ul");
          return;
        case "o":
          e.preventDefault();
          applyFormat("ol");
          return;
        case "`":
          e.preventDefault();
          applyFormat("code");
          return;
        case "z":
        case "y":
          return;
      }
    }

    if (e.key === "Enter" && !e.shiftKey && contentInputRef.current) {
      const textarea = contentInputRef.current;
      const currentContent = textarea.value;
      const cursorPos = textarea.selectionStart;
      const lineStart = currentContent.lastIndexOf("\n", cursorPos - 1) + 1;
      const currentLine = currentContent.substring(lineStart, cursorPos);
      const bulletMatch = currentLine.match(/^(\s*)- (.*)$/);
      const numberMatch = currentLine.match(/^(\s*)(\d+)\. (.*)$/);

      if (bulletMatch) {
        const [, indent, text] = bulletMatch;
        if (text.trim() === "") {
          e.preventDefault();

          if (document.execCommand) {
            const newContent =
              currentContent.substring(0, lineStart) +
              currentContent.substring(cursorPos);
            textarea.setSelectionRange(lineStart, cursorPos);
            document.execCommand("insertText", false, "");
            setContent(newContent);
            setTimeout(() => {
              textarea.focus();
              textarea.setSelectionRange(lineStart, lineStart);
            }, 0);
          } else {
            const newContent =
              currentContent.substring(0, lineStart) +
              currentContent.substring(cursorPos);
            setContent(newContent);
            setTimeout(() => {
              textarea.focus();
              textarea.setSelectionRange(lineStart, lineStart);
            }, 0);
          }
        } else {
          e.preventDefault();
          const insertion = `\n${indent}- `;

          if (document.execCommand) {
            textarea.setSelectionRange(cursorPos, cursorPos);
            document.execCommand("insertText", false, insertion);
            setContent(
              currentContent.substring(0, cursorPos) +
                insertion +
                currentContent.substring(cursorPos)
            );
            setTimeout(() => {
              textarea.focus();
              textarea.setSelectionRange(
                cursorPos + insertion.length,
                cursorPos + insertion.length
              );
            }, 0);
          } else {
            const newContent =
              currentContent.substring(0, cursorPos) +
              insertion +
              currentContent.substring(cursorPos);
            setContent(newContent);
            setTimeout(() => {
              textarea.focus();
              textarea.setSelectionRange(
                cursorPos + insertion.length,
                cursorPos + insertion.length
              );
            }, 0);
          }
        }
      } else if (numberMatch) {
        const [, indent, number, text] = numberMatch;
        if (text.trim() === "") {
          e.preventDefault();

          if (document.execCommand) {
            textarea.setSelectionRange(lineStart, cursorPos);
            document.execCommand("insertText", false, "");
            setContent(
              currentContent.substring(0, lineStart) +
                currentContent.substring(cursorPos)
            );
            setTimeout(() => {
              textarea.focus();
              textarea.setSelectionRange(lineStart, lineStart);
            }, 0);
          } else {
            const newContent =
              currentContent.substring(0, lineStart) +
              currentContent.substring(cursorPos);
            setContent(newContent);
            setTimeout(() => {
              textarea.focus();
              textarea.setSelectionRange(lineStart, lineStart);
            }, 0);
          }
        } else {
          e.preventDefault();
          const nextNumber = Number.parseInt(number) + 1;
          const insertion = `\n${indent}${nextNumber}. `;

          if (document.execCommand) {
            textarea.setSelectionRange(cursorPos, cursorPos);
            document.execCommand("insertText", false, insertion);
            setContent(
              currentContent.substring(0, cursorPos) +
                insertion +
                currentContent.substring(cursorPos)
            );
            setTimeout(() => {
              textarea.focus();
              textarea.setSelectionRange(
                cursorPos + insertion.length,
                cursorPos + insertion.length
              );
            }, 0);
          } else {
            const newContent =
              currentContent.substring(0, cursorPos) +
              insertion +
              currentContent.substring(cursorPos);
            setContent(newContent);
            setTimeout(() => {
              textarea.focus();
              textarea.setSelectionRange(
                cursorPos + insertion.length,
                cursorPos + insertion.length
              );
            }, 0);
          }
        }
      }
    }
  };

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note]);

  useEffect(() => {
    if (isEditingTitle) titleInputRef.current?.focus();
    if (isEditingContent) contentInputRef.current?.focus();
  }, [isEditingTitle, isEditingContent]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const handleSave = async () => {
    if (title.trim() === "") return;
    if (isSaving) return;

    setIsSaving(true);
    setIsLoading(true);

    try {
      await onEdit({ title, content });

      saveTimeoutRef.current = setTimeout(() => {
        setIsEditingTitle(false);
        setIsEditingContent(false);
        setIsSaving(false);
        setIsLoading(false);
      }, 300);
    } catch (error) {
      console.error("Error saving note:", error);
      setIsSaving(false);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle(note.title);
    setContent(note.content);
    setIsEditingTitle(false);
    setIsEditingContent(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
      handleSave();
    } else if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const handlePreviewClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "A" || target.closest("a")) {
      e.stopPropagation();
      return;
    }
    setIsEditingContent(true);
  };

  const handleWordCountClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (contentInputRef.current) {
      requestAnimationFrame(() => {
        contentInputRef.current?.focus();
      });
    }
  };

  const renderMarkdown = (text: string) => {
    const codeBlocks: string[] = [];
    const links: { text: string; url: string }[] = [];

    let processedText = text.replace(/`([^`]+)`/g, (match, code) => {
      const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
      codeBlocks.push(code);
      return placeholder;
    });

    processedText = processedText.replace(
      /\[([^\]]+)\]\(([^\)]+)\)/g,
      (match, text, url) => {
        const placeholder = `__LINK_${links.length}__`;
        links.push({ text, url });
        return placeholder;
      }
    );

    processedText = processedText
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(
        /^# (.*?)$/gm,
        "<h1 class='text-3xl font-bold mb-4 mt-6'>$1</h1>"
      )
      .replace(
        /^## (.*?)$/gm,
        "<h2 class='text-2xl font-bold mb-3 mt-5'>$1</h2>"
      )
      .replace(
        /^### (.*?)$/gm,
        "<h3 class='text-xl font-bold mb-2 mt-4'>$1</h3>"
      )
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/^\s*- (.*?)$/gm, "<li class='bullet-item'>$1</li>")
      .replace(/^\s*(\d+)\. (.*?)$/gm, "<li class='number-item'>$2</li>");

    const lines = processedText.split(/\n/);
    let html = "";
    let inBulletList = false;
    let inNumberList = false;
    let inParagraph = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const nextLine = i < lines.length - 1 ? lines[i + 1] : "";

      const isHeading = line.trim().startsWith("<h");
      const isBulletItem = line.trim().startsWith("<li class='bullet-item'>");
      const isNumberItem = line.trim().startsWith("<li class='number-item'>");

      if (isBulletItem) {
        if (!inBulletList) {
          if (inNumberList) {
            html += "</ol>";
            inNumberList = false;
          }
          if (inParagraph) {
            html += "</p>";
            inParagraph = false;
          }
          html += '<ul class="list-disc pl-6 my-4">';
          inBulletList = true;
        }
        html += line.replace("class='bullet-item'", "");
      } else if (isNumberItem) {
        if (!inNumberList) {
          if (inBulletList) {
            html += "</ul>";
            inBulletList = false;
          }
          if (inParagraph) {
            html += "</p>";
            inParagraph = false;
          }
          html += '<ol class="list-decimal pl-6 my-4">';
          inNumberList = true;
        }
        html += line.replace("class='number-item'", "");
      } else if (isHeading) {
        if (inBulletList) {
          html += "</ul>";
          inBulletList = false;
        }
        if (inNumberList) {
          html += "</ol>";
          inNumberList = false;
        }
        if (inParagraph) {
          html += "</p>";
          inParagraph = false;
        }
        html += line;
      } else if (!line.trim()) {
        if (inBulletList) {
          html += "</ul>";
          inBulletList = false;
        }
        if (inNumberList) {
          html += "</ol>";
          inNumberList = false;
        }
        if (inParagraph) {
          html += "</p>";
          inParagraph = false;
        }
        html += "<br />";
      } else {
        if (inBulletList) {
          html += "</ul>";
          inBulletList = false;
        }
        if (inNumberList) {
          html += "</ol>";
          inNumberList = false;
        }
        if (!inParagraph) {
          html += "<p>";
          inParagraph = true;
        }
        html += (inParagraph && html.endsWith("</p>") ? " " : "") + line;
        if (
          !nextLine.trim() ||
          nextLine.trim().startsWith("<h") ||
          nextLine.trim().startsWith("<li")
        ) {
          html += "</p>";
          inParagraph = false;
        }
      }
    }

    if (inBulletList) html += "</ul>";
    if (inNumberList) html += "</ol>";
    if (inParagraph) html += "</p>";

    codeBlocks.forEach((code, index) => {
      html = html.replace(
        `__CODE_BLOCK_${index}__`,
        `<code class='bg-muted px-1 py-0.5 rounded text-sm font-mono'>${code}</code>`
      );
    });

    links.forEach((link, index) => {
      html = html.replace(
        `__LINK_${index}__`,
        `<a href="${link.url}" class="text-blue-600 hover:text-blue-800 underline font-medium" target="_blank" rel="noopener noreferrer">${link.text}</a>`
      );
    });

    return html;
  };

  const ToolbarButton = ({
    icon,
    label,
    onClick,
    disabled = false,
    shortcut = null,
  }: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    disabled?: boolean;
    shortcut?: string | null;
  }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onMouseDown={(e) => {
              e.preventDefault();
              onClick();
            }}
            disabled={disabled}
            type="button"
          >
            {icon}
            <span className="sr-only">{label}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {label}
            {shortcut ? ` (${shortcut})` : ""}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const formattedDate = format(
    new Date(note.updatedAt),
    "MMMM d, yyyy 'at' h:mm a"
  );

  useEffect(() => {
    if (savedScrollPosition !== null && contentInputRef.current) {
      contentInputRef.current.scrollTop = savedScrollPosition;
      setSavedScrollPosition(null);
    }

    if (savedSelectionInfo !== null && contentInputRef.current) {
      contentInputRef.current.focus();
      contentInputRef.current.setSelectionRange(
        savedSelectionInfo.start,
        savedSelectionInfo.end
      );
      setSavedSelectionInfo(null);
    }
  }, [content, savedScrollPosition, savedSelectionInfo]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  return (
    <Card className="border-none shadow-none h-full flex flex-col">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        {isEditingTitle ? (
          <Input
            ref={titleInputRef}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            className="text-2xl font-bold h-auto py-1"
            disabled={isLoading}
            onBlur={handleSave}
          />
        ) : (
          <CardTitle
            className="text-2xl font-bold cursor-pointer"
            onClick={() => setIsEditingTitle(true)}
          >
            {note.title}
          </CardTitle>
        )}
        <div className="flex items-center gap-2">
          {isEditingTitle || isEditingContent ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSave}
                className="h-8 w-8"
                disabled={isLoading || isSaving}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                <span className="sr-only">Save</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancel}
                className="h-8 w-8"
                disabled={isLoading || isSaving}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Cancel</span>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditingTitle(true)}
                className="h-8 w-8"
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                className="h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4 pb-6">
        <div className="flex items-center gap-2 text-sm">
          <div className="bg-muted/50 px-2 py-1 rounded-md text-muted-foreground">
            Last updated{" "}
            <time
              dateTime={note.updatedAt}
              className="font-medium text-foreground"
            >
              {formatDistanceToNow(new Date(note.updatedAt))}
            </time>{" "}
            ago
          </div>
          <div className="text-muted-foreground text-xs">{formattedDate}</div>
        </div>
        <div className="flex-1 flex flex-col min-h-0">
          {isEditingContent ? (
            <div className="relative flex-1 flex flex-col">
              <div className="bg-muted/50 p-2 rounded-t-md flex flex-wrap items-center gap-1 border border-b-0 border-input">
                <div className="flex items-center gap-1 mr-2">
                  <ToolbarButton
                    icon={<Heading1 className="h-4 w-4" />}
                    label="Heading 1"
                    onClick={() => applyFormat("h1")}
                    disabled={isSaving}
                    shortcut="Ctrl+1"
                  />
                  <ToolbarButton
                    icon={<Heading2 className="h-4 w-4" />}
                    label="Heading 2"
                    onClick={() => applyFormat("h2")}
                    disabled={isSaving}
                    shortcut="Ctrl+2"
                  />
                  <ToolbarButton
                    icon={<Heading3 className="h-4 w-4" />}
                    label="Heading 3"
                    onClick={() => applyFormat("h3")}
                    disabled={isSaving}
                    shortcut="Ctrl+3"
                  />
                </div>
                <div className="flex items-center gap-1 mr-2">
                  <ToolbarButton
                    icon={<Bold className="h-4 w-4" />}
                    label="Bold"
                    onClick={() => applyFormat("bold")}
                    disabled={isSaving}
                    shortcut="Ctrl+B"
                  />
                  <ToolbarButton
                    icon={<Italic className="h-4 w-4" />}
                    label="Italic"
                    onClick={() => applyFormat("italic")}
                    disabled={isSaving}
                    shortcut="Ctrl+I"
                  />
                  <ToolbarButton
                    icon={<Code className="h-4 w-4" />}
                    label="Code"
                    onClick={() => applyFormat("code")}
                    disabled={isSaving}
                    shortcut="Ctrl+`"
                  />
                </div>
                <div className="flex items-center gap-1 mr-2">
                  <ToolbarButton
                    icon={<Link className="h-4 w-4" />}
                    label="Link"
                    onClick={() => applyFormat("link")}
                    disabled={isSaving}
                    shortcut="Ctrl+K"
                  />
                  <ToolbarButton
                    icon={<List className="h-4 w-4" />}
                    label="Bullet List"
                    onClick={() => applyFormat("ul")}
                    disabled={isSaving}
                    shortcut="Ctrl+L"
                  />
                  <ToolbarButton
                    icon={<ListOrdered className="h-4 w-4" />}
                    label="Numbered List"
                    onClick={() => applyFormat("ol")}
                    disabled={isSaving}
                    shortcut="Ctrl+O"
                  />
                </div>
                <div className="ml-auto flex items-center gap-2">
                  {isSaving && (
                    <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {isSaving ? "Saving..." : "Ctrl+S to save"}
                  </span>
                </div>
              </div>
              <div className="relative flex-1 flex flex-col">
                <Textarea
                  ref={contentInputRef}
                  value={content}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setContent(e.target.value)
                  }
                  onKeyDown={handleTextareaKeyDown}
                  className="min-h-[300px] h-full resize-none rounded-t-none font-mono flex-1"
                  disabled={isSaving}
                  onFocus={() => setShowWordCount(true)}
                  onBlur={(e) => {
                    if (
                      !wordCountRef.current?.contains(e.relatedTarget as Node)
                    ) {
                      setShowWordCount(false);
                    }
                  }}
                />
                {showWordCount && (
                  <div
                    ref={wordCountRef}
                    className="absolute top-2 right-3 bg-background/90 border border-border rounded-md px-2 py-1 text-xs shadow-sm"
                    onClick={handleWordCountClick}
                    onMouseDown={(e) => {
                      e.preventDefault();
                    }}
                  >
                    {wordCount} words | {charCount} characters
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div
              ref={previewRef}
              className="prose dark:prose-invert max-w-none cursor-pointer p-4 border border-muted rounded-md overflow-y-auto flex-1"
              style={{ overflowY: "auto", height: "100%" }}
              onClick={handlePreviewClick}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
          )}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <div>{wordCount} words</div>
          <div>{charCount} characters</div>
        </div>
      </CardContent>
    </Card>
  );
}
