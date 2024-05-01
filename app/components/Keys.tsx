"use client"

import { useEditorContext } from "@contexts/EditorContext"
import { cn } from "@lib/utils"
import { Button } from "@ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui/tooltip"
import { ReactNode } from "react"

interface KeysProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  name: string
  script?: string
  desc?: string
}

export function Keys({ children, name, desc, script, className }: KeysProps) {
  const { editor, editable } = useEditorContext()

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
            onClick={() => insertOperation(script ?? "")}
            className={cn("text-md w-10", className)}
            disabled={!editable}
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
