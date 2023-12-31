"use client"

import { EditorContent } from "@tiptap/react"
import { Fira_Code } from "next/font/google"
import { useEffect } from "react"
import { useEditorContext } from "../contexts/EditorContext"
import { cn } from "../lib/utils"
import { TableType } from "../types/table"

const firaCode = Fira_Code({ subsets: ["latin"] })

export function ExpressionInput() {
  const { editor } = useEditorContext()

  useEffect(() => {
    if (!editor) return

    const getItem = localStorage.getItem("@sql-algebra:tables") || "[]"
    const stored = JSON.parse(getItem) as TableType[]

    editor.setEditable(stored.length > 0)
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
