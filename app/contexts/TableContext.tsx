"use client"

import { ReactNode, createContext, useContext, useState } from "react"
import { TableType } from "../types/table"

interface TableContextProviderProps {
  children: ReactNode
}

export type TableContextType = {
  tables: TableType[]
  setTables: (tables: TableType[]) => void
  resultTable: TableType | null
  setResultTable: (table: TableType) => void
}

const TableContext = createContext({} as TableContextType)

export function TableContextProvider({ children }: TableContextProviderProps) {
  const [tables, setTables] = useState<TableType[]>([])
  const [resultTable, setResultTable] = useState<TableType | null>(null)

  return (
    <TableContext.Provider
      value={{ setTables, tables, resultTable, setResultTable }}
    >
      {children}
    </TableContext.Provider>
  )
}

export const useTableContext = () => useContext(TableContext)
