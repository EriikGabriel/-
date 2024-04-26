"use client"

import { DatabaseZap } from "lucide-react"
import XRegExp from "xregexp"
import { __CHR } from "../constants/text"
import { useEditorContext } from "../contexts/EditorContext"
import { useTableContext } from "../contexts/TableContext"
import { cn } from "../lib/utils"
import { TableType } from "../types/table"
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

type QueryTableType = {
  lastQueryTable: TableType
  history: { [rel: string]: TableType }
}

export function ExpressionButton() {
  const { editor, editable } = useEditorContext()
  const { tables, setResultTable } = useTableContext()

  const queryTables: QueryTableType = {
    lastQueryTable: { name: "", columns: [], data: [] },
    history: {},
  }

  function projection(columns: string[], relation: string): TableType {
    const matchingTable = tables.find((table) => table.name === relation)

    if (!matchingTable) {
      throw new Error(`Relation '${relation}' not found in tables`)
    }

    const projectedData = matchingTable.data.map((row) => ({
      ...columns.reduce(
        (projection, column) => ({ ...projection, [column]: row[column] }),
        {}
      ),
    }))

    const projectedColumns = matchingTable.columns.filter((column) =>
      columns.includes(column.name)
    )

    return { ...matchingTable, data: projectedData, columns: projectedColumns }
  }

  function executeOperation(
    op: string,
    sub: string,
    relation: string
  ): TableType {
    switch (op) {
      case "π":
        const columns = sub.split(",")
        return projection(columns, relation)
      case "σ":
        console.log("Seleção")
        return { name: "Seleção", columns: [], data: [] }
      default:
        return { name: "Seleção", columns: [], data: [] }
    }
  }

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

          acc.push({
            op: current.value[0],
            sub: matches[0]?.replaceAll(new RegExp(`${__CHR}`, "g"), ""),
            relation: "",
          })
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

    HTMLQueries.forEach((query) => {
      const operations = internalOperation(query)

      operations.forEach(({ op, sub, relation }, i) => {
        const queryTable = executeOperation(op, sub ?? "", relation)

        queryTables.lastQueryTable = queryTable
        queryTables.history = { ...queryTables.history, [`$${i}`]: queryTable }
      })
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
