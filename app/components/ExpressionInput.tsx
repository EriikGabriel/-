"use client"

import { EditorContent } from "@tiptap/react"
import { Fira_Code } from "next/font/google"
import { useEffect } from "react"
import { __CHR } from "../constants/text"
import { cn } from "../lib/utils"
import { useEditorContext } from "../contexts/EditorContext"

const firaCode = Fira_Code({ subsets: ["latin"] })

export function ExpressionInput() {
  const { editor } = useEditorContext()

  useEffect(() => {
    if (!editor) return

    editor.setEditable(true)
  }, [editor])

  return (
    <div>
      <EditorContent
        editor={editor}
        className={cn(
          firaCode.className,
          !editor?.isEditable && "cursor-not-allowed"
        )}
      />
    </div>
  )
}
