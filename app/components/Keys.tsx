"use client"

import { ReactNode } from "react"
import { useEditorContext } from "../contexts/EditorContext"
import { cn } from "../lib/utils"
import { Button } from "./ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"

interface KeysProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  name: string
  script?: string
  desc?: string
}

export function Keys({ children, name, desc, script, className }: KeysProps) {
  const { editor } = useEditorContext()

  function insertOperation(script: string) {
    if (!editor) return

    const anchor = editor.state.selection.$anchor

    const charSize = children?.toString().length ?? 1
    const newCursorPos = anchor.pos + charSize + 1

    editor.commands.insertContent(script)

    editor.chain().focus().setTextSelection(newCursorPos).run()
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={() => insertOperation(script ?? "")}
            className={cn("text-sm w-10", className)}
            disabled={!editor?.isEditable}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{name}</p>
          <small>{desc}</small>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
