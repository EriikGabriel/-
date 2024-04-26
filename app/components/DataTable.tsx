"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Columns, Pencil, Trash, X } from "lucide-react"
import { useEditorContext } from "../contexts/EditorContext"
import { useTableContext } from "../contexts/TableContext"
import { cn } from "../lib/utils"
import { TableType } from "../types/table"
import { RegisterDialog } from "./RegisterDialog"
import { TableDialog } from "./TableDialog"
import { Button } from "./ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { Warning } from "./ui/warning"

interface DataTableProps<TData, TValue> {
  tableName: string
  dataColumns: TableType["columns"]
  columns: ColumnDef<TData, TValue>[]
  data?: TData[]
  onlyRead?: boolean
  className?: string
}

export function DataTable<TData, TValue>({
  tableName,
  dataColumns,
  columns,
  data = [],
  onlyRead = false,
  className,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const { setTables } = useTableContext()
  const { setEditable } = useEditorContext()

  function deleteTable() {
    const tables = JSON.parse(
      localStorage.getItem("@sql-algebra:tables") ?? "[]"
    )

    const filteredTables = tables.filter(
      (table: TableType) => table.name !== tableName
    )

    setTables(filteredTables)
    localStorage.setItem("@sql-algebra:tables", JSON.stringify(filteredTables))

    setEditable(filteredTables.length > 0)
  }

  function editTable() {
    const tables = JSON.parse(
      localStorage.getItem("@sql-algebra:tables") ?? "[]"
    )

    setTables(tables)
  }

  function deleteRegister(registerId: number) {
    const storedTables = JSON.parse(
      localStorage.getItem("@sql-algebra:tables") || "[]"
    )

    if (storedTables) {
      const tableIndex = storedTables.findIndex(
        (table: TableType) => table.name === tableName
      )

      storedTables[tableIndex].data.splice(registerId, 1)

      setTables(storedTables)
      localStorage.setItem("@sql-algebra:tables", JSON.stringify(storedTables))
    }
  }

  return (
    <div className="w-full">
      {!onlyRead && (
        <div className="flex items-center py-4 justify-between">
          <RegisterDialog tableName={tableName} dataColumns={dataColumns}>
            <Button>Novo registro</Button>
          </RegisterDialog>
          <div className="flex gap-3">
            <TableDialog editTableName={tableName}>
              <Button
                variant="outline"
                size="icon"
                className="mb-4 mt-2"
                onClick={editTable}
              >
                <Columns className="h-4 w-4" />
              </Button>
            </TableDialog>

            <Warning
              title="Você tem certeza?"
              description={`Você não poderá desfazer essa ação. Toda a sua tabela "${tableName}" será apagada.`}
              cancel={{ text: "Cancelar" }}
              proceed={{ text: "Apagar", action: deleteTable }}
            >
              <Button variant="destructive" size="icon" className="mb-4 mt-2">
                <Trash className="h-4 w-4" />
              </Button>
            </Warning>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table className={cn("rounded", className)}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
                {table.getRowModel().rows?.length > 0 && !onlyRead && (
                  <TableHead key="actions" />
                )}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, i) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  {!onlyRead && (
                    <TableCell key="actions">
                      <div className="flex justify-end items-center h-full gap-4 pr-4">
                        <RegisterDialog
                          tableName={tableName}
                          dataColumns={dataColumns}
                          editRegisterId={i}
                        >
                          <Button
                            variant="link"
                            size="icon"
                            className="w-6 h-6 hover:text-yellow-500"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </RegisterDialog>

                        <Button
                          variant="link"
                          size="icon"
                          className="w-6 h-6 hover:text-red-500"
                          onClick={() => deleteRegister(i)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow className="w-full">
                <TableCell
                  colSpan={columns.length}
                  className="h-24 w-full text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
