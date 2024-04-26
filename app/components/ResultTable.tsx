"use client"

import { useTableContext } from "../contexts/TableContext"
import { createColumns } from "./Columns"
import { DataTable } from "./DataTable"

export function ResultTable() {
  const { resultTable } = useTableContext()

  return (
    resultTable && (
      <div className="flex flex-col gap-3 mt-5 bg-slate-800/20 border border-white/20 rounded-md p-2 pt-3">
        <h1 className="text-center text-md font-light">
          Resultado da consulta
        </h1>
        <DataTable
          onlyRead={true}
          tableName={resultTable?.name ?? "Resultado"}
          dataColumns={resultTable?.columns ?? []}
          columns={createColumns(resultTable?.columns ?? [])}
          data={resultTable?.data}
          className="bg-slate-900"
        />
      </div>
    )
  )
}
