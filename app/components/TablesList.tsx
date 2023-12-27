"use client"

import { KeyboardEvent, useEffect, useRef, useState } from "react"

import { PlusIcon } from "lucide-react"
import { useTableContext } from "../contexts/TableContext"
import { createColumns } from "./Columns"
import { DataTable } from "./DataTable"
import { TableDialog } from "./TableDialog"
import { Button } from "./ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"

export function TablesList() {
  const tabsRef = useRef<HTMLDivElement>(null)
  const [tabs, setTabs] = useState<string[]>([])
  const [tabName, setTabName] = useState("")

  const { setTables, tables } = useTableContext()

  function handleCreateTable(event: KeyboardEvent<HTMLInputElement>) {
    const tabName = event.currentTarget.value

    if (event.key !== "Enter" || !tabName || tabs.includes(tabName)) return

    setTabs([...tabs, tabName])
    setTabName("")
  }

  useEffect(() => {
    const storageTables = JSON.parse(
      localStorage.getItem("@sql-algebra:tables") ?? "[]"
    )

    if (storageTables) setTables(storageTables)
  }, [setTables])

  return (
    <Tabs defaultValue="default" className="w-full" ref={tabsRef}>
      <TabsList>
        {tables.map((tab) => (
          <TabsTrigger key={tab.name} value={tab.name}>
            {tab.name}
          </TabsTrigger>
        ))}
        <TableDialog>
          <Button
            variant="outline"
            size="icon"
            className="p-2 flex items-center text-center justify-center w-full"
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </TableDialog>
      </TabsList>
      <TabsContent value="default">Crie uma nova tabela</TabsContent>

      {tables.map((tab) => (
        <TabsContent value={tab.name} key={tab.name}>
          <DataTable
            tableName={tab.name}
            dataColumns={tab.columns}
            columns={createColumns(tab.columns)}
            data={tab.data}
          />
        </TabsContent>
      ))}
    </Tabs>
  )
}
