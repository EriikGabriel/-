"use client"

import { ColumnDef } from "@tanstack/react-table"
import { TableType } from "../types/table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
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
