"use client"

import { DatabaseZap } from "lucide-react"
import XRegExp from "xregexp"
import { useEditorContext } from "../contexts/EditorContext"
import { useTableContext } from "../contexts/TableContext"
import { cn } from "../lib/utils"
import { ResultTableType } from "../types/table"
import { Button } from "./ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"

type OperationType = {
  op: string
  sub?: string
  relation: string
}

export function ExpressionButton() {
  const { editor, editable } = useEditorContext()
  const { tables } = useTableContext()

  function executeOperation(op: string, sub: string, relation: string) {}

  function internalOperation(str: string) {
    let internal = XRegExp.matchRecursive(
      str,
      "((π|σ)(.*?)\\(|\\()",
      "\\)",
      "g",
      { valueNames: [null, "left", "match", null] }
    )
    const response: OperationType[] = []

    const transformedRes: OperationType[] = internal.reduce<OperationType[]>(
      (acc, current) => {
        if (current.name === "left") {
          const regexSub = /(?<=<sub>).*?(?=<\/sub>)/g
          const matches = current.value.match(regexSub) ?? []

          acc.push({ op: current.value[0], sub: matches[0], relation: "" })
        } else if (current.name === "match" && acc[acc.length - 1]) {
          acc[acc.length - 1].relation = current.value
        }
        return acc
      },
      []
    )

    const internalVal = internal
      .map((element) => (element.name === "match" ? element.value : ""))
      .filter((e) => e.length > 0)

    const hasParenthesis = internalVal.some((e) => /\(.*?\)/.test(e))
    if (!hasParenthesis) return transformedRes

    internalVal.forEach((item) => response.push(...internalOperation(item)))
    return response
  }

  function executeQueries() {
    const HTMLExpression = editor?.getHTML().replaceAll(/\s/g, "") ?? ""
    const HTMLQueries = HTMLExpression.replace(/<\/?p>/g, "").split("<br>")

    console.log(HTMLQueries)
    console.log(tables)

    const resultTable = {} as ResultTableType

    HTMLQueries.forEach((query) => {
      const operations = internalOperation(query)

      console.log(operations)

      operations.forEach(({ op, sub, relation }) => {
        executeOperation(op, sub ?? "", relation)
      })
    })
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className={cn(editable ? "flex" : "hidden", "select-none h-full ")}
            onClick={executeQueries}
            disabled={!!!editor?.getText().length ?? true}
          >
            <DatabaseZap />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Executar consulta</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
