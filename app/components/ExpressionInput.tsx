"use client"

import Placeholder from "@tiptap/extension-placeholder"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import StarterKit from "@tiptap/starter-kit"

import { EditorContent, useEditor } from "@tiptap/react"
import { Fira_Code } from "next/font/google"
import { useEffect } from "react"
import { __CHR } from "../constants/text"
import { cn } from "../lib/utils"

const firaCode = Fira_Code({ subsets: ["latin"] })

export function ExpressionInput() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Digite a expressão..." }),
      Subscript,
      Superscript,
    ],

    editorProps: {
      attributes: {
        class:
          "flex py-4 text-xl w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-5",
      },
    },
  })

  function handleSelect() {
    if (!editor) return

    const anchor = editor.state.selection.$anchor

    const charSize = 1
    const newCursorPos = anchor.pos + charSize + 1

    editor.commands.insertContent(`σ<sub>${__CHR}</sub>()`)

    editor.chain().focus().setTextSelection(newCursorPos).run()
  }

  useEffect(() => {
    if (!editor) return

    editor.setEditable(false)
  }, [editor])

  return (
    <EditorContent
      editor={editor}
      className={cn(
        firaCode.className,
        !editor?.isEditable && "cursor-not-allowed"
      )}
    />
  )
}
