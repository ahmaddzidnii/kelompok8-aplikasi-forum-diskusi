import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";
import { type JsonValue } from "@prisma/client/runtime/library";

import {
  Link,
  HorizontalRule,
  CodeBlockLowlight,
  Selection,
  Color,
  UnsetAllMarks,
  Image,
  ResetMarksOnEnter,
} from "@/components/minimal-tiptap/extensions";

export const transformJsonToHtml = (json: JsonValue) => {
  return generateHTML(json as object, [
    StarterKit.configure({
      horizontalRule: false,
      codeBlock: false,
      paragraph: { HTMLAttributes: { class: "text-node" } },
      heading: { HTMLAttributes: { class: "heading-node" } },
      blockquote: { HTMLAttributes: { class: "block-node" } },
      bulletList: { HTMLAttributes: { class: "list-node" } },
      orderedList: { HTMLAttributes: { class: "list-node" } },
      code: { HTMLAttributes: { class: "inline", spellcheck: "false" } },
      dropcursor: { width: 2, class: "ProseMirror-dropcursor border" },
    }),
    Link,
    Underline,
    Color,
    TextStyle,
    Selection,
    Typography,
    UnsetAllMarks,
    HorizontalRule,
    ResetMarksOnEnter,
    CodeBlockLowlight,
    Image,
  ]);
};
