"use client"

import { TableType } from "@@types/table"
import { ColumnDef } from "@tanstack/react-table"

export type ColumnType = Record<string, unknown>

export const createColumns = (columnDefinitions: TableType["columns"]) => {
  return columnDefinitions.map((columnDefinition) => {
    return {
      accessorKey: columnDefinition.name,
      header: columnDefinition.name,
      type: columnDefinition.type,
    } as ColumnDef<ColumnType>
  })
}
