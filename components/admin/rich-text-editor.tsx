"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Sparkles,
  Wand2,
  FileText,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  generateArticleContent,
  improveContent,
  expandSection,
  generateImagePrompt,
} from "@/app/actions/ai/generate";
import { Loader2 } from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  articleTitle?: string;
  articleCategory?: string;
  articleExcerpt?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Start writing your article...",
  articleTitle,
  articleCategory,
  articleExcerpt,
}: RichTextEditorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [showImproveDialog, setShowImproveDialog] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [outline, setOutline] = useState("");
  const [improveInstruction, setImproveInstruction] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 hover:underline",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Typography,
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[400px] focus:outline-none px-4 py-3",
      },
    },
  });

  const handleGenerateContent = async () => {
    if (!articleTitle || !articleCategory) {
      alert("Please provide an article title and category first");
      return;
    }

    setIsGenerating(true);
    try {
      const generatedContent = await generateArticleContent({
        title: articleTitle,
        category: articleCategory,
        excerpt: articleExcerpt,
        outline,
      });

      editor?.commands.setContent(generatedContent);
      setShowGenerateDialog(false);
      setOutline("");
    } catch (error) {
      console.error("Failed to generate content:", error);
      alert("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImproveContent = async () => {
    if (!editor || !improveInstruction.trim()) {
      return;
    }

    setIsImproving(true);
    try {
      const currentContent = editor.getHTML();
      const improvedContent = await improveContent(
        currentContent,
        improveInstruction
      );

      editor.commands.setContent(improvedContent);
      setShowImproveDialog(false);
      setImproveInstruction("");
    } catch (error) {
      console.error("Failed to improve content:", error);
      alert("Failed to improve content. Please try again.");
    } finally {
      setIsImproving(false);
    }
  };

  const handleGenerateImagePrompt = async () => {
    if (!editor) return;

    const context = articleTitle || editor.getText().substring(0, 500);
    setIsGenerating(true);

    try {
      const prompt = await generateImagePrompt(context);
      setImageAlt(prompt);
    } catch (error) {
      console.error("Failed to generate image prompt:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInsertLink = () => {
    if (!linkUrl || !editor) return;

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: linkUrl })
      .run();

    setLinkUrl("");
    setShowLinkDialog(false);
  };

  const handleInsertImage = () => {
    if (!imageUrl || !editor) return;

    editor
      .chain()
      .focus()
      .setImage({ src: imageUrl, alt: imageAlt })
      .run();

    setImageUrl("");
    setImageAlt("");
    setShowImageDialog(false);
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-muted/50 border-b p-2 flex flex-wrap gap-1">
        {/* AI Tools */}
        <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1"
              disabled={!articleTitle || !articleCategory}
            >
              <Sparkles className="h-4 w-4" />
              Generate
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Article Content with AI</DialogTitle>
              <DialogDescription>
                Claude will generate a comprehensive article based on your title
                and category.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={articleTitle || ""} disabled />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input value={articleCategory || ""} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="outline">
                  Outline (Optional)
                </Label>
                <Textarea
                  id="outline"
                  placeholder="Provide specific points or sections you want to cover..."
                  value={outline}
                  onChange={(e) => setOutline(e.target.value)}
                  rows={6}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowGenerateDialog(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleGenerateContent}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Content
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showImproveDialog} onOpenChange={setShowImproveDialog}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1"
            >
              <Wand2 className="h-4 w-4" />
              Improve
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Improve Content with AI</DialogTitle>
              <DialogDescription>
                Tell Claude how you'd like to improve your content.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="instruction">Instruction</Label>
                <Textarea
                  id="instruction"
                  placeholder="e.g., Make it more concise, Add more examples, Improve the flow..."
                  value={improveInstruction}
                  onChange={(e) => setImproveInstruction(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowImproveDialog(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleImproveContent}
                disabled={isImproving || !improveInstruction.trim()}
              >
                {isImproving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Improving...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Improve Content
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Separator orientation="vertical" className="h-8" />

        {/* Format Tools */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-muted" : ""}
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-muted" : ""}
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-8" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={
            editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""
          }
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={
            editor.isActive("heading", { level: 3 }) ? "bg-muted" : ""
          }
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-8" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-muted" : ""}
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-muted" : ""}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-8" />

        {/* Link Dialog */}
        <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
          <DialogTrigger asChild>
            <Button type="button" variant="ghost" size="sm">
              <LinkIcon className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Insert Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="linkUrl">URL</Label>
                <Input
                  id="linkUrl"
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowLinkDialog(false)}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleInsertLink}>
                Insert Link
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Image Dialog */}
        <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
          <DialogTrigger asChild>
            <Button type="button" variant="ghost" size="sm">
              <ImageIcon className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Insert Image</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="imageAlt">Alt Text (for SEO)</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleGenerateImagePrompt}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Sparkles className="h-3 w-3" />
                    )}
                  </Button>
                </div>
                <Textarea
                  id="imageAlt"
                  placeholder="Description of the image"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowImageDialog(false)}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleInsertImage}>
                Insert Image
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Separator orientation="vertical" className="h-8" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="bg-background" />
    </div>
  );
}
