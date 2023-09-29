import { ExpressionInput } from "./components/ExpressionInput"

export default function Home() {
  return (
    <main className="h-screen flex flex-col items-center py-12">
      <div className="w-1/2">
        <ExpressionInput />
      </div>
    </main>
  )
}
