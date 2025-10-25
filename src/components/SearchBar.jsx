import { Search, Tag, X } from 'lucide-react'

export default function SearchBar({ query, onQueryChange, tags, filterTag, onFilterTagChange, onClear }) {
  return (
    <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 backdrop-blur">
      <div className="flex items-center gap-2 mb-2">
        <div className="relative flex-1">
          <Search className="size-4 absolute left-2 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-8 pr-8 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700"
          />
          {query && (
            <button onClick={() => onQueryChange('')} className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800">
              <X className="size-4" />
            </button>
          )}
        </div>
        <button onClick={onClear} className="px-2.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm">Clear</button>
      </div>
      <div className="flex items-center flex-wrap gap-2">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <Tag className="size-3.5" />
          <span>Filter by tag</span>
        </div>
        <button
          onClick={() => onFilterTagChange('')}
          className={`px-2 py-1 rounded-full border text-xs ${!filterTag ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-transparent' : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
        >All</button>
        {tags.map(t => (
          <button
            key={t}
            onClick={() => onFilterTagChange(t)}
            className={`px-2 py-1 rounded-full border text-xs capitalize ${filterTag === t ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-transparent' : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  )
}
