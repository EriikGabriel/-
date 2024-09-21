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

      let unaryOperations = opUtils.getInternalUnaryOperations(query)

      console.log(unaryOperations)

      while (unaryOperations.length > 0) {
        unaryOperations = opUtils.getInternalUnaryOperations(query)

        console.log({ unaryOperations })

        unaryOperations.forEach(({ op, sub, relation }, i) => {
          let binaryOperations = opUtils.getInternalBinaryOperations(relation)

          while (binaryOperations.length > 0) {
            binaryOperations = opUtils.getInternalBinaryOperations(relation)

            binaryOperations.forEach(
              ({ op, relation1, relation2, sub1, sub2 }) => {
                const queryTable = opUtils.executeBinaryOperation(
                  op,
                  relation1,
                  relation2,
                  sub1,
                  sub2
                )
                // const binaryQueryRegex = new RegExp(
                //   `${left}<${__CHR}${op}${__CHR}${right}\\(${relation}\\)`,
                //   "g"
                // )

                // queryTables.lastQueryTable = queryTable
                // queryTables.history = {
                //   ...queryTables.history,
                //   [`!${queryIndex}`]: queryTable,
                // }

                // relation = relation.replaceAll(
                //   binaryQueryRegex,
                //   `!${queryIndex}`
                // )
                queryIndex++
              }
            )

            binaryOperations = []
          }

          const queryTable = opUtils.executeUnaryOperation(
            op,
            sub ?? "",
            relation
          )
          const subQueryRegex = new RegExp(
            `${op}<sub>${__CHR}${
              sub === "*" ? "\\" : ""
            }${sub}<\\/sub>\\(${relation}\\)|\\(!${queryIndex}\\)`,
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
