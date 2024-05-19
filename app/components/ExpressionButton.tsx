"use client"

import { QueryTableType } from "@@types/table"
import { __CHR } from "@constants/text"
import { useEditorContext } from "@contexts/EditorContext"
import { useTableContext } from "@contexts/TableContext"
import { cn } from "@lib/utils"
import { Button } from "@ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui/tooltip"
import { OperationsUtils } from "@utils/operations"
import { DatabaseZap } from "lucide-react"

export function ExpressionButton() {
  const { editor, editable } = useEditorContext()
  const { tables, setResultTable } = useTableContext()

  const queryTables: QueryTableType = {
    lastQueryTable: { name: "", columns: [], data: [] },
    history: {},
  }

  function executeQueries() {
    if (!editor) return

    const quotationValues: string[] = editor.getHTML().match(/"(.*?)"/g) ?? []
    const quotationMap: { [key: string]: string } = quotationValues.reduce(
      (acc, str) => ({ ...acc, [str.replaceAll(/\s/g, "")]: str }),
      {}
    )

    let HTMLExpression = editor.getHTML().replaceAll(/\s/g, "") ?? ""
    HTMLExpression.match(/".*?"/g)?.forEach((str) => {
      HTMLExpression = HTMLExpression.replaceAll(str, quotationMap[str])
    })

    const HTMLQueries = HTMLExpression.replace(/<\/?p>/g, "").split("<br>")

    let queryIndex = 0

    HTMLQueries.forEach((query) => {
      const opUtils = new OperationsUtils(tables, queryTables)
      const relationAssignment = query.match(/.+(?=←)/g)?.[0]

      let operations = opUtils.getInternalOperations(query)

      while (operations.length > 0) {
        operations = opUtils.getInternalOperations(query)

        operations.forEach(({ op, sub, relation }, i) => {
          const queryTable = opUtils.executeOperation(op, sub ?? "", relation)
          const subQueryRegex = new RegExp(
            `${op}<sub>${__CHR}${sub}<\\/sub>\\(${relation}\\)|\\(!${queryIndex}\\)`,
            "g"
          )

          queryTables.lastQueryTable = queryTable
          queryTables.history = {
            ...queryTables.history,
            [`!${queryIndex}`]: queryTable,
          }

          query = query.replaceAll(subQueryRegex, `!${queryIndex}`)
          queryIndex++
        })
      }

      if (relationAssignment) {
        queryTables.history = {
          ...queryTables.history,
          [relationAssignment]: queryTables.lastQueryTable,
        }
      }
    })

    setResultTable(queryTables?.lastQueryTable)
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
