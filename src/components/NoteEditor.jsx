import { useEffect, useMemo, useState } from 'react'
import { Pin, PinOff, Save, Trash2 } from 'lucide-react'

export default function NoteEditor({ note, onChange, onDelete, onTogglePin }) {
  const [title, setTitle] = useState(note.title || '')
  const [content, setContent] = useState(note.content || '')
  const [tagsInput, setTagsInput] = useState(note.tags?.join(', ') || '')

  // Keep local state in sync when note changes selection
  useEffect(() => {
    setTitle(note.title || '')
    setContent(note.content || '')
    setTagsInput(note.tags?.join(', ') || '')
  }, [note.id])

  // Debounced propagate changes up
  useEffect(() => {
    const t = setTimeout(() => {
      const tags = tagsInput
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(Boolean)
      onChange({ title, content, tags })
    }, 200)
    return () => clearTimeout(t)
  }, [title, content, tagsInput])

  const charCount = useMemo(() => content.length, [content])

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 backdrop-blur overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <button onClick={onTogglePin} className="px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 inline-flex items-center gap-2 text-sm">
            {note.pinned ? <PinOff className="size-4" /> : <Pin className="size-4" />}
            {note.pinned ? 'Unpin' : 'Pin'}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-neutral-500 hidden sm:block">{new Date(note.updatedAt).toLocaleString()}</div>
          <button onClick={() => onChange({})} className="px-3 py-1.5 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 inline-flex items-center gap-2">
            <Save className="size-4" />
            Save
          </button>
          <button onClick={onDelete} className="px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 inline-flex items-center gap-2">
            <Trash2 className="size-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full text-lg sm:text-xl font-semibold bg-transparent outline-none border-none"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note here... Use #tags inline to auto-tag."
          className="w-full min-h-[40vh] sm:min-h-[50vh] resize-y bg-transparent outline-none border-none leading-relaxed"
        />
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
          <label className="text-neutral-500">Tags</label>
          <input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="comma, separated, tags"
            className="flex-1 px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700"
          />
          <div className="ml-auto text-xs text-neutral-500">{charCount} chars</div>
        </div>
      </div>
    </div>
  )
}
