const leftInternalRegex = "((π|σ)(.*?)\\(|\\()"

const logicalOperationsMap: { [key: string]: string } = {
  "=": "=",
  "≠": "!=",
  "∧": "&&",
  "∨": "||",
  "¬": "!",
  ">": ">",
  "<": "<",
  "≥": ">=",
  "≤": "<=",
}
const logicalOperations = Object.keys(logicalOperationsMap).join("|")

export { leftInternalRegex, logicalOperations, logicalOperationsMap }
