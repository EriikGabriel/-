export type ColumnType = {
  name: string
  type: "string" | "number" | "date" | "auto increment"
  nullable: boolean
  defaultValue: string
  primaryKey: boolean
}

export type TableType = {
  name: string
  columns: ColumnType[]
  data: { [key: string]: string }[]
}

export type QueryTableType = {
  lastQueryTable: TableType
  history: { [rel: string]: TableType }
}
