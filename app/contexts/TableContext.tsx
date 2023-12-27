"use client"

import { ReactNode, createContext, useContext, useState } from "react"
import { TableType } from "../types/table"

interface TableContextProviderProps {
  children: ReactNode
}

export type TableContextType = {
  tables: TableType[]
  setTables: (tables: TableType[]) => void
}

const TableContext = createContext({} as TableContextType)

export function TableContextProvider({ children }: TableContextProviderProps) {
  const [tables, setTables] = useState<TableType[]>([])

  return (
    <TableContext.Provider value={{ setTables, tables }}>
      {children}
    </TableContext.Provider>
  )
}

export const useTableContext = () => useContext(TableContext)
