"use client"

import XRegExp from "xregexp"
import { useEditorContext } from "../contexts/EditorContext"
import { useTableContext } from "../contexts/TableContext"
import { cn } from "../lib/utils"
import { ResultTableType } from "../types/table"
import { Button } from "./ui/button"

export function ExpressionButton() {
  const { editor, editable } = useEditorContext()
  const { tables } = useTableContext()

  function executeOperation(op: string, a: string, b: string) {}

  function parenthesisInternal(str: string) {
    const matches = XRegExp.matchRecursive(str, "\\(", "\\)", "g", {
      valueNames: [null, null, "match", null],
    })

    matches.forEach((match) => {
      const { value } = match

      let hasParenthesis = XRegExp.test(value, "\\(|\\)")

      while (hasParenthesis) {
        const matches = XRegExp.matchRecursive(value, "\\(", "\\)", "g", {
          valueNames: [null, null, "match", null],
        })
      }
    })

    console.warn(matches)
  }

  function executeQueries() {
    const HTMLExpression = editor?.getHTML().replaceAll(/\s/g, "") ?? ""
    const HTMLQueries = HTMLExpression.replace(/<\/?p>/g, "").split("<br>")

    console.log(HTMLQueries)
    console.log(tables)

    const resultTable = {} as ResultTableType

    HTMLQueries.forEach((query) => {
      console.warn(parenthesisInternal(query))
    })
  }

  return (
    <Button
      className={cn(editable ? "flex" : "hidden", "select-none")}
      onClick={executeQueries}
      disabled={!!!editor?.getText().length ?? true}
    >
      Executar consulta
    </Button>
  )
}
