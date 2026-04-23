"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
  memo,
} from "react";
import { Editor, EditorContent, EditorContext, useEditor } from "@tiptap/react";

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Selection } from "@tiptap/extensions";
import Link from "@tiptap/extension-link";

// --- Tables ---
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button";
import { Spacer } from "@/components/tiptap-ui-primitive/spacer";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar";

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu";
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu";
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button";
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button";
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/components/tiptap-ui/color-highlight-popover";
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/components/tiptap-ui/link-popover";
import { MarkButton } from "@/components/tiptap-ui/mark-button";
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button";
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button";

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon";
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon";
import { LinkIcon } from "@/components/tiptap-icons/link-icon";

// --- Hooks ---
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint";

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const MainToolbarContent = memo(function MainToolbarContent({
  onHighlighterClick,
  onLinkClick,
  isMobile,
}: {
    onHighlighterClick: () => void;
    onLinkClick: () => void;
    isMobile: boolean;
}) {
  return (
    <>
      <Spacer />

      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
        <ListDropdownMenu
          types={["bulletList", "orderedList", "taskList"]}
          portal={isMobile}
        />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <Spacer />

      {isMobile && <ToolbarSeparator />}
    </>
  );
});

const MobileToolbarContent = memo(function MobileToolbarContent({
  type,
  onBack,
}: {
    type: "highlighter" | "link";
    onBack: () => void;
}) {
  return (
    <>
      <ToolbarGroup>
        <Button data-style="ghost" onClick={onBack}>
          <ArrowLeftIcon className="tiptap-button-icon" />
          {type === "highlighter" ? (
            <HighlighterIcon className="tiptap-button-icon" />
          ) : (
            <LinkIcon className="tiptap-button-icon" />
          )}
        </Button>
      </ToolbarGroup>

      <ToolbarSeparator />

      {type === "highlighter" ? (
        <ColorHighlightPopoverContent />
      ) : (
        <LinkContent />
      )}
    </>
  );
});

export interface SimpleEditorHandle {
  getEditor: () => Editor | null;
  getPendingImages: () => Map<string, File>;
  clearPendingImages: () => void;
}

interface SimpleEditorProps {
  onEditorReady?: (editor: Editor) => void;
  initialContent?: string;
}

export const SimpleEditor = forwardRef<SimpleEditorHandle, SimpleEditorProps>(
  function SimpleEditor({ onEditorReady, initialContent }, ref) {
    const isMobile = useIsBreakpoint();
    const [mobileView, setMobileView] = useState<"main" | "highlighter" | "link">(
      "main"
    );

    // Track pending images: blob URL -> File
    const pendingImagesRef = useRef<Map<string, File>>(new Map());

    // Deferred upload: kembalikan blob URL untuk preview, simpan File untuk upload nanti
    const handleImageUpload = useCallback(async (file: File): Promise<string> => {
      if (file.size > MAX_FILE_SIZE) {
        throw new Error("Ukuran file maksimal 5MB");
      }
      if (!file.type.startsWith("image/")) {
        throw new Error("File harus berupa gambar (JPG/PNG)");
      }

      const blobUrl = URL.createObjectURL(file);
      pendingImagesRef.current.set(blobUrl, file);
      return blobUrl;
    }, []);

    const editor = useEditor({
      immediatelyRender: false,
      editorProps: {
        attributes: {
          autocomplete: "off",
          autocorrect: "off",
          autocapitalize: "off",
          "aria-label": "Area konten utama, mulai mengetik untuk memasukkan teks.",
          class: "simple-editor",
        },
      },
      extensions: [
        StarterKit.configure({ horizontalRule: false }),
        Table.configure({
          resizable: true,
          lastColumnResizable: true,
          allowTableNodeSelection: true,
        }),
        TableRow,
        TableHeader,
        TableCell,
        Link.configure({
          openOnClick: false,
          HTMLAttributes: { class: "text-primary underline" },
        }),
        HorizontalRule,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        TaskList,
        TaskItem.configure({ nested: true }),
        Highlight.configure({ multicolor: true }),
        Image,
        Typography,
        Superscript,
        Subscript,
        Selection,
        ImageUploadNode.configure({
          accept: "image/*",
          maxSize: MAX_FILE_SIZE,
          limit: 10,
          upload: handleImageUpload,
          onError: (error) => console.error("Upload gagal:", error),
        }),
      ],
      content: initialContent || "<p>Mulai menulis di sini...</p>",
    });

    // Expose methods via ref
    useImperativeHandle(
      ref,
      () => ({
        getEditor: () => editor,
        getPendingImages: () => pendingImagesRef.current,
        clearPendingImages: () => {
          pendingImagesRef.current.forEach((_, blobUrl) => {
            URL.revokeObjectURL(blobUrl);
          });
          pendingImagesRef.current.clear();
        },
      }),
      [editor]
    );

    useEffect(() => {
      if (!isMobile && mobileView !== "main") {
        setMobileView("main");
      }
    }, [isMobile, mobileView]);

    useEffect(() => {
      if (editor && onEditorReady) {
        onEditorReady(editor);
      }
    }, [editor, onEditorReady]);

    // Cleanup blob URLs saat unmount
    useEffect(() => {
      return () => {
        pendingImagesRef.current.forEach((_, blobUrl) => {
          URL.revokeObjectURL(blobUrl);
        });
      };
    }, []);

    return (
      <div className="simple-editor-wrapper">
        <EditorContext.Provider value={{ editor }}>
          {/*
            PENTING: Hapus inline style `bottom` di mobile.
            Dulu pakai `rect.y` dari useCursorVisibility untuk positioning toolbar,
            tapi ini menyebabkan toolbar jadi fixed dan konten infinite scroll.
            Sekarang toolbar sticky top — ikut flow layout normal.
          */}
          <Toolbar>
            {mobileView === "main" ? (
              <MainToolbarContent
                onHighlighterClick={() => setMobileView("highlighter")}
                onLinkClick={() => setMobileView("link")}
                isMobile={isMobile}
              />
            ) : (
              <MobileToolbarContent
                type={mobileView === "highlighter" ? "highlighter" : "link"}
                onBack={() => setMobileView("main")}
              />
            )}
          </Toolbar>

          <EditorContent
            editor={editor}
            role="presentation"
            className="simple-editor-content"
          />
        </EditorContext.Provider>
      </div>
    );
  }
);