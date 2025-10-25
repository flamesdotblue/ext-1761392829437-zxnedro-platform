import { Pin, PinOff, Trash2, Copy } from 'lucide-react'

function formatDate(ts) {
  try {
    const d = new Date(ts)
    return d.toLocaleString()
  } catch {
    return ''
  }
}

export default function NoteList({ notes, selectedId, onSelect, onDelete, onTogglePin, onDuplicate }) {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-white/60 dark:bg-neutral-900/60 backdrop-blur">
      {notes.length === 0 ? (
        <div className="p-6 text-center text-neutral-500">No notes yet</div>
      ) : (
        <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {notes.map(n => (
            <li key={n.id} className={`group flex items-stretch ${selectedId === n.id ? 'bg-neutral-100/60 dark:bg-neutral-800/40' : ''}`}>
              <button
                onClick={() => onSelect(n.id)}
                className="flex-1 text-left p-3"
              >
                <div className="flex items-center gap-2">
                  {n.pinned && <Pin className="size-3 text-amber-500" />}
                  <p className="font-medium truncate">{n.title || 'Untitled'}</p>
                </div>
                <p className="text-sm text-neutral-500 line-clamp-2 mt-1">{n.content || 'No content'}</p>
                <div className="mt-2 flex items-center gap-2">
                  {n.tags?.slice(0, 4).map(tag => (
                    <span key={tag} className="text-[10px] uppercase tracking-wide bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-1.5 py-0.5 rounded">#{tag}</span>
                  ))}
                  <span className="ml-auto text-xs text-neutral-400">{formatDate(n.updatedAt)}</span>
                </div>
              </button>
              <div className="opacity-0 group-hover:opacity-100 transition flex items-center gap-1 pr-2">
                <button onClick={() => onTogglePin(n.id)} className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800" title={n.pinned ? 'Unpin' : 'Pin'}>
                  {n.pinned ? <PinOff className="size-4" /> : <Pin className="size-4" />}
                </button>
                <button onClick={() => onDuplicate(n.id)} className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800" title="Duplicate">
                  <Copy className="size-4" />
                </button>
                <button onClick={() => onDelete(n.id)} className="p-2 rounded hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600" title="Delete">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
