"use client"

import { TableType } from "@@types/table"
import { useEditorContext } from "@contexts/EditorContext"
import { cn } from "@lib/utils"
import { EditorContent } from "@tiptap/react"
import { Fira_Code } from "next/font/google"
import { useEffect } from "react"
import { ExpressionButton } from "./ExpressionButton"

const firaCode = Fira_Code({ subsets: ["latin"] })

export function ExpressionInput() {
  const { editor, editable, setEditable } = useEditorContext()

  useEffect(() => {
    if (!editor) return

    const getItem = localStorage.getItem("@sql-algebra:tables") || "[]"
    const stored = JSON.parse(getItem) as TableType[]

    setEditable(stored.length > 0)
  }, [setEditable, editor])

  return (
    <div className="flex gap-3">
      <EditorContent
        editor={editor}
        className={cn(
          firaCode.className,
          "w-full",
          !editable && "hidden cursor-not-allowed"
        )}
      />
      <ExpressionButton />
    </div>
  )
}
