import { ExpressionInput } from "./components/ExpressionInput"
import { TablesList } from "./components/TablesList"

export default function Home() {
  return (
    <main className="h-screen flex flex-col items-center py-12">
      <div className="flex flex-col w-1/2 gap-5">
        <ExpressionInput />
        <TablesList />
      </div>
    </main>
  )
}
