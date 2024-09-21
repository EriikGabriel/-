export type UnaryOperationType = {
  op: string
  sub?: string
  relation: string
}

export type BinaryOperationType = {
  op: string
  relation1: string
  relation2: string
  sub1?: string
  sub2?: string
}
