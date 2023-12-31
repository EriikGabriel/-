"use client"

import { useEditorContext } from "../contexts/EditorContext"
import { cn } from "../lib/utils"
import { Button } from "./ui/button"

export function ExpressionButton() {
  const { editable } = useEditorContext()

  return (
    <Button className={cn(editable ? "flex" : "hidden", "select-none")}>
      Executar consulta
    </Button>
  )
}
