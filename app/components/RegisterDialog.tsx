import { TableType } from "@@types/table"
import { useTableContext } from "@contexts/TableContext"
import { Button } from "@ui/button"
import { Input } from "@ui/input"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@ui/sheet"
import { FormEvent, ReactNode, useEffect, useState } from "react"

interface RegisterDialogProps {
  tableName: string
  dataColumns: TableType["columns"]
  editRegisterId?: number
  children?: ReactNode
}

export function RegisterDialog({
  tableName,
  dataColumns,
  editRegisterId,
  children,
}: RegisterDialogProps) {
  const [register, setRegister] = useState({} as TableType["data"][0])

  const { setTables } = useTableContext()

  function saveRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const data = Object.fromEntries(formData.entries())

    dataColumns.map((dataCol) => {
      if (dataCol.defaultValue && !data[dataCol.name]) {
        data[dataCol.name] = dataCol.defaultValue
      }
    })

    // find columns with auto increment
    const autoIncrementColumns = dataColumns.filter(
      (dataCol) => dataCol.type === "auto increment"
    )

    const storedTables = JSON.parse(
      localStorage.getItem("@sql-algebra:tables") || "[]"
    )

    if (storedTables) {
      const tableIndex = storedTables.findIndex(
        (table: TableType) => table.name === tableName
      )

      autoIncrementColumns.forEach((autoIncrementColumn) => {
        const lastAutoIncrement = storedTables[tableIndex].data.reduce(
          (acc: number, row: TableType["data"][0]) => {
            const value = parseInt(row[autoIncrementColumn.name], 10)
            return value > acc ? value : acc
          },
          0
        )

        data[autoIncrementColumn.name] = (lastAutoIncrement + 1).toString()
      })

      if (editRegisterId !== undefined) {
        storedTables[tableIndex].data[editRegisterId] = data
      } else {
        storedTables[tableIndex].data.push(data)
      }

      setTables(storedTables)
      localStorage.setItem("@sql-algebra:tables", JSON.stringify(storedTables))
    }
  }

  function getRegister() {
    if (editRegisterId !== undefined) {
      const storedTables = JSON.parse(
        localStorage.getItem("@sql-algebra:tables") || "[]"
      )

      if (storedTables) {
        const tableIndex = storedTables.findIndex(
          (table: TableType) => table.name === tableName
        )

        const register = storedTables[tableIndex].data[editRegisterId]
        setRegister(register)
      }
    }
  }

  useEffect(() => {
    if (editRegisterId !== undefined) {
      const storedTables = JSON.parse(
        localStorage.getItem("@sql-algebra:tables") || "[]"
      )

      if (storedTables) {
        const tableIndex = storedTables.findIndex(
          (table: TableType) => table.name === tableName
        )

        const register = storedTables[tableIndex].data[editRegisterId]
        setRegister(register)
      }
    }
  }, [editRegisterId, tableName])

  return (
    <Sheet onOpenChange={() => getRegister()}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>
            {editRegisterId !== undefined ? "Editar " : "Novo "} registro
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={saveRegister} id="form-register">
          <div className="flex flex-wrap mt-6 gap-5">
            {dataColumns.map(
              (dataCol) =>
                dataCol.type !== "auto increment" && (
                  <div key={dataCol.name} className="flex flex-col">
                    <label htmlFor={dataCol.name} className="font-bold">
                      {dataCol.name}:
                    </label>
                    <Input
                      value={register[dataCol.name] ?? ""}
                      onChange={(e) =>
                        setRegister({
                          ...register,
                          [dataCol.name]: e.target.value,
                        })
                      }
                      id={dataCol.name}
                      name={dataCol.name}
                      type={dataCol.type}
                      placeholder={dataCol.defaultValue}
                      autoComplete="off"
                      required={!dataCol.nullable && !dataCol.defaultValue}
                      className="flex"
                    />
                  </div>
                )
            )}
          </div>

          <SheetClose className="flex mt-8" asChild>
            <Button type="submit">Salvar</Button>
          </SheetClose>
        </form>
      </SheetContent>
    </Sheet>
  )
}
