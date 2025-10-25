import { Plus } from 'lucide-react'

export default function Header({ onNew }) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="size-9 rounded-lg bg-gradient-to-br from-amber-400 to-rose-500" />
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Notes</h1>
          <p className="text-xs text-neutral-500">Fast, local, and private</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onNew}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 transition"
        >
          <Plus className="size-4" />
          New Note
        </button>
      </div>
    </header>
  )
}
