import { OperationType } from "@@types/operation"
import { QueryTableType, TableType } from "@@types/table"
import {
  leftInternalRegex,
  logicalOperations,
  logicalOperationsMap,
} from "@constants/operation"
import { __CHR } from "@constants/text"
import XRegExp from "xregexp"

export class OperationsUtils {
  /*---------------------------*
   |          Construtor       |  
   *---------------------------*/

  constructor(
    private tables: TableType[],
    private queryTables: QueryTableType
  ) {
    this.tables = tables
    this.queryTables = queryTables
  }

  /*--------------------------*
   |        Operações         |  
   *--------------------------*/

  projection(columns: string[], relation: string): TableType {
    const matchTable =
      this.tables.find((table) => table.name === relation) ??
      this.queryTables.history[relation]
    const matchColumn = matchTable?.columns.find((c) =>
      columns.includes(c.name)
    )

    if (!matchTable || !matchColumn) return { name: "", columns: [], data: [] }

    const projectedData = matchTable.data.map((row) => ({
      ...columns.reduce(
        (projection, column) => ({ ...projection, [column]: row[column] }),
        {}
      ),
    }))

    const projectedColumns = matchTable.columns.filter((column) =>
      columns.includes(column.name)
    )

    return { ...matchTable, data: projectedData, columns: projectedColumns }
  }

  selection(condition: string, relation: string): TableType {
    const matchTable =
      this.tables.find((table) => table.name === relation) ??
      this.queryTables.history[relation]

    if (!matchTable) return { name: "", columns: [], data: [] }

    const selectedData = matchTable.data.filter((row) => {
      const logicalOpRegex = new RegExp(logicalOperations, "g")
      const logicalAttrRegex = new RegExp(`\\w+(?=${logicalOperations})`, "g")

      const attributes = condition.match(logicalAttrRegex) ?? []

      let valueCondition = condition

      attributes.forEach((attr) => {
        valueCondition = valueCondition
          .replaceAll(attr, `"${row[attr]}"`)
          .replaceAll(/(?<!=)\=(?!=)/g, "==")
      })

      valueCondition.match(logicalOpRegex)?.forEach((op) => {
        valueCondition = valueCondition.replaceAll(op, logicalOperationsMap[op])
      })

      try {
        return eval(valueCondition)
      } catch (e) {
        return false
      }
    })

    return { ...matchTable, data: selectedData }
  }

  /*--------------------------*
   | Manipulação de Operações |  
   *--------------------------*/

  getInternalOperations(str: string) {
    let internal = XRegExp.matchRecursive(str, leftInternalRegex, "\\)", "g", {
      valueNames: [null, "left", "match", null],
    })

    const response: OperationType[] = []

    const transformedRes: OperationType[] = internal.reduce<OperationType[]>(
      (acc, current) => {
        if (current.name === "left") {
          const subRegex = /(?<=<sub>).*?(?=<\/sub>)/g
          const opRegex = /π|σ/g

          const matches = current.value.match(subRegex) ?? []

          acc.push({
            op: opRegex.exec(current.value)?.[0] ?? "",
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

    if (!hasParenthesis) {
      return transformedRes.filter((item) => item.op.length > 0)
    }

    internalVal.forEach((item) =>
      response.push(...this.getInternalOperations(item))
    )
    return response
  }

  executeOperation(op: string, sub: string, relation: string): TableType {
    console.log({ op, sub, relation })
    switch (op) {
      case "π":
        const columns = sub.split(",")
        return this.projection(columns, relation)
      case "σ":
        const condition = sub
        return this.selection(condition, relation)
      default:
        return { name: "", columns: [], data: [] }
    }
  }
}
