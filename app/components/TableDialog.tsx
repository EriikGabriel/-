"use client"

import { PlusIcon } from "@radix-ui/react-icons"
import { FormEvent, ReactNode, useState } from "react"

import { X } from "lucide-react"
import { ColumnType, TableType } from "../types/table"

import { DialogClose } from "@radix-ui/react-dialog"
import { useEditorContext } from "../contexts/EditorContext"
import { useTableContext } from "../contexts/TableContext"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { ComboBox } from "./ui/combobox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Input } from "./ui/input"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { Warning } from "./ui/warning"

interface TableDialogProps {
  children: ReactNode
  editTableName?: string
}

export function TableDialog({ children, editTableName }: TableDialogProps) {
  const [tableName, setTableName] = useState("")
  const [columns, setColumns] = useState<ColumnType[]>([])
  const [columnTypes, setColumnTypes] = useState<string[]>([])
  const [typeIsChanged, setTypeIsChanged] = useState(false)

  const { setTables, tables } = useTableContext()
  const { editor } = useEditorContext()

  function setFields() {
    if (!editTableName) return

    const table = tables.find((table) => table.name === editTableName)

    if (!table) return

    setTableName(table.name)
    setColumns(table.columns)
    setColumnTypes(table?.columns.map((column) => column.type))
  }

  function newColumn() {
    setColumns([
      ...columns,
      {
        name: "",
        type: "string",
        nullable: false,
        defaultValue: "",
        primaryKey: false,
      },
    ])
  }

  function deleteColumn(index: number) {
    setColumns(columns.filter((_, i) => i !== index))
  }

  function createTable(e: FormEvent) {
    e.preventDefault()

    const newTables = [...tables, { name: tableName, columns, data: [] }]

    setTables(newTables)

    localStorage.setItem("@sql-algebra:tables", JSON.stringify(newTables))

    setTableName("")
    setColumns([])

    editor?.setEditable(newTables.length > 0)
  }

  function editTable(e: FormEvent) {
    e.preventDefault()

    const oldTables = JSON.parse(
      localStorage.getItem("@sql-algebra:tables") || "[]"
    ) as TableType[]

    const oldTable = oldTables.find((t) => t.name === editTableName)!
    const oldColumnsNames = oldTable.columns.map((column) => column.name)
    const oldColumnsTypes = oldTable.columns.map((column) => column.type)

    const newTables = tables.map((table) => {
      if (table.name === editTableName) {
        const columnsTypes = columns.map((column) => column.type)

        let newData: TableType["data"] = []

        if (columnsTypes.every((type, i) => type === oldColumnsTypes[i])) {
          newData = oldTable.data.map((row) => {
            const updatedRegister = {} as TableType["data"][0]

            const columnsNames = columns.map((column) => column.name)

            columnsNames.forEach((name, i) => {
              updatedRegister[name] = row[oldColumnsNames[i]]
            })

            return updatedRegister
          })
        }

        return {
          name: tableName,
          columns,
          data: newData,
        }
      }

      return table
    })

    setTables(newTables)

    localStorage.setItem("@sql-algebra:tables", JSON.stringify(newTables))

    setTableName("")
    setColumns([])
    setTypeIsChanged(false)
  }

  return (
    <Dialog>
      <DialogTrigger onClick={setFields} asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="min-w-[65%]">
        <form
          className="flex flex-col gap-10"
          onSubmit={editTableName ? editTable : createTable}
        >
          <section className="flex flex-col gap-3">
            <DialogHeader>
              <DialogTitle>
                {editTableName ? "Editar" : "Criar"} Tabela
              </DialogTitle>
            </DialogHeader>
            <Input
              type="text"
              placeholder="Nome da tabela"
              className="w-1/4"
              autoComplete="off"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              required
            />
          </section>
          <section className="flex flex-col gap-3">
            <div className="flex justify-between">
              <DialogHeader>
                <DialogTitle>Colunas</DialogTitle>
                <DialogDescription>
                  Defina quais as colunas da tabela
                </DialogDescription>
              </DialogHeader>
              <Button
                type="button"
                size="icon"
                className="rounded-full"
                onClick={newColumn}
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>

            <div className="overflow-y-auto block max-h-80">
              <Table>
                {!columns.length && (
                  <TableCaption>
                    Clique no + para adicionar colunas na tabela
                  </TableCaption>
                )}
                <TableHeader className="w-full">
                  <TableRow className="w-full">
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Anulável</TableHead>
                    <TableHead>Valor Padrão</TableHead>
                    <TableHead>Chave Primária</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {columns.map((column, i) => (
                    <TableRow key={`col-${i}`} className="hover:bg-transparent">
                      <TableCell className="w-1/4">
                        <Input
                          type="text"
                          placeholder="Nome da coluna"
                          autoComplete="off"
                          value={column.name}
                          onChange={(e) => {
                            column.name = e.target.value
                            setColumns([...columns])
                          }}
                          required
                        />
                      </TableCell>
                      <TableCell
                        className={`w-1/5 ${
                          typeIsChanged ? "text-yellow-300" : ""
                        }`}
                      >
                        <ComboBox
                          options={[
                            { value: `string`, label: "String" },
                            { value: `number`, label: "Number" },
                            { value: `date`, label: "Date" },
                            {
                              value: `auto increment`,
                              label: "Auto Increment",
                            },
                          ]}
                          value={column.type}
                          onValueChange={(value) => {
                            column.type = value as ColumnType["type"]

                            setTypeIsChanged(
                              !columnTypes.every(
                                (type, i) => type === columns[i].type
                              )
                            )

                            if (value === "auto increment") {
                              column.nullable = false
                              column.defaultValue = ""
                              column.primaryKey = true
                            }

                            setColumns([...columns])
                          }}
                        >
                          Selecione um tipo
                        </ComboBox>
                      </TableCell>
                      <TableCell className="text-center p-0">
                        <Checkbox
                          checked={column.nullable}
                          onCheckedChange={(check) => {
                            column.nullable = !!check
                            setColumns([...columns])
                          }}
                          disabled={column.type === "auto increment"}
                        />
                      </TableCell>
                      <TableCell className="w-1/4">
                        <Input
                          type={column.type}
                          placeholder="Valor padrão"
                          value={column.defaultValue}
                          onChange={(e) => {
                            column.defaultValue = e.target.value
                            setColumns([...columns])
                          }}
                          disabled={column.type === "auto increment"}
                        />
                      </TableCell>
                      <TableCell className="text-center p-0">
                        <Checkbox
                          checked={column.primaryKey}
                          onCheckedChange={(check) => {
                            column.primaryKey = !!check
                            setColumns([...columns])
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Warning
                          title="Deletar coluna"
                          description={`Você tem certeza que deseja deletar a coluna "${column.name}"?`}
                          proceed={{
                            text: "Deletar",
                            action: () => deleteColumn(i),
                          }}
                          cancel={{ text: "Cancelar" }}
                        >
                          <Button type="button" variant="link" size="icon">
                            <X className="h-4 w-4 hover:text-red-500" />
                          </Button>
                        </Warning>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
          <section className="flex justify-end gap-5 w-full">
            {typeIsChanged && (
              <small className="text-yellow-200">
                ⚠️ O tipo de uma coluna foi alterado. Para impedir possíveis
                inconsistências, todos os dados serão apagados no processo e
                isso não poderá ser desfeito!
              </small>
            )}

            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="w-1/4 select-none"
                onClick={() => setTypeIsChanged(false)}
              >
                Cancelar
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                type="submit"
                className="w-1/4 select-none"
                disabled={
                  !!!tableName ||
                  !!!columns.length ||
                  Object.values(columns).some((column) => !column.name)
                }
              >
                {editTableName ? "Concluir" : "Criar Tabela"}
              </Button>
            </DialogClose>
          </section>
        </form>
      </DialogContent>
    </Dialog>
  )
}
