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
    const HTMLExpression = editor?.getHTML().replaceAll(/\s/g, "") ?? ""
    const HTMLQueries = HTMLExpression.replace(/<\/?p>/g, "").split("<br>")

    let queryIndex = 0

    HTMLQueries.forEach((query) => {
      const opUtils = new OperationsUtils(tables, queryTables)

      let operations = opUtils.getInternalOperations(query)

      while (operations.length > 0) {
        operations = opUtils.getInternalOperations(query)

        operations.forEach(({ op, sub, relation }, i) => {
          const queryTable = opUtils.executeOperation(op, sub ?? "", relation)

          queryTables.lastQueryTable = queryTable
          queryTables.history = {
            ...queryTables.history,
            [`!${queryIndex}`]: queryTable,
          }

          query = query.replaceAll(
            new RegExp(
              `${op}<sub>${__CHR}${sub}<\\/sub>\\(${relation}\\)|\\(!${
                queryIndex - 1
              }\\)`,
              "g"
            ),
            `!${queryIndex}`
          )

          queryIndex++
        })
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
