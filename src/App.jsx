import { useEffect, useMemo, useRef, useState } from 'react'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import NoteList from './components/NoteList'
import NoteEditor from './components/NoteEditor'

const STORAGE_KEY = 'notes.v1';
const STORAGE_SELECTED_KEY = 'notes.selectedId';

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function extractHashTags(text) {
  const tags = new Set()
  const regex = /(^|\s)#([\p{L}\p{N}_-]+)/gu
  let m
  while ((m = regex.exec(text))) {
    tags.add(m[2].toLowerCase())
  }
  return Array.from(tags)
}

export default function App() {
  const [notes, setNotes] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return []
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })
  const [selectedId, setSelectedId] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_SELECTED_KEY) || ''
    } catch {
      return ''
    }
  })
  const [query, setQuery] = useState('')
  const [filterTag, setFilterTag] = useState('')

  const selectedNote = useMemo(() => notes.find(n => n.id === selectedId) || null, [notes, selectedId])

  // Persist notes and selectedId
  const saveTimeout = useRef(null)
  useEffect(() => {
    clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
    }, 200)
    return () => clearTimeout(saveTimeout.current)
  }, [notes])

  useEffect(() => {
    if (selectedId) localStorage.setItem(STORAGE_SELECTED_KEY, selectedId)
  }, [selectedId])

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC')
      const mod = isMac ? e.metaKey : e.ctrlKey
      if (mod && e.key.toLowerCase() === 'n') {
        e.preventDefault()
        handleCreateNote()
      }
      if (mod && e.key.toLowerCase() === 's') {
        e.preventDefault()
        // Saving is automatic; provide a subtle UX by bumping updatedAt
        if (selectedNote) {
          bumpUpdated(selectedNote.id)
        }
      }
      if (e.key === 'Delete' && selectedNote) {
        e.preventDefault()
        handleDeleteNote(selectedNote.id)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedNote])

  function bumpUpdated(id) {
    setNotes(ns => ns.map(n => n.id === id ? { ...n, updatedAt: Date.now() } : n))
  }

  function handleCreateNote() {
    const now = Date.now()
    const newNote = {
      id: uid(),
      title: 'Untitled note',
      content: '',
      tags: [],
      pinned: false,
      createdAt: now,
      updatedAt: now,
    }
    setNotes(ns => [newNote, ...ns])
    setSelectedId(newNote.id)
  }

  function handleUpdateNote(id, patch) {
    setNotes(ns => ns.map(n => {
      if (n.id !== id) return n
      const next = { ...n, ...patch }
      // Derive tags from both manual tags and #hashtags in content
      const hashTags = extractHashTags(next.content || '')
      const manualTags = Array.isArray(next.tags) ? next.tags : []
      const tagSet = new Set([...manualTags.map(t => t.toLowerCase()), ...hashTags])
      next.tags = Array.from(tagSet)
      next.updatedAt = Date.now()
      return next
    }))
  }

  function handleDeleteNote(id) {
    const note = notes.find(n => n.id === id)
    if (!note) return
    const ok = confirm(`Delete note "${note.title || 'Untitled'}"? This cannot be undone.`)
    if (!ok) return
    setNotes(ns => ns.filter(n => n.id !== id))
    if (selectedId === id) {
      // Select next available note
      const remaining = notes.filter(n => n.id !== id)
      setSelectedId(remaining[0]?.id || '')
    }
  }

  function handleTogglePin(id) {
    setNotes(ns => ns.map(n => n.id === id ? { ...n, pinned: !n.pinned, updatedAt: Date.now() } : n))
  }

  function handleDuplicate(id) {
    const src = notes.find(n => n.id === id)
    if (!src) return
    const now = Date.now()
    const copy = {
      ...src,
      id: uid(),
      title: src.title ? `${src.title} (copy)` : 'Untitled note (copy)',
      createdAt: now,
      updatedAt: now,
      pinned: false,
    }
    setNotes(ns => [copy, ...ns])
    setSelectedId(copy.id)
  }

  const allTags = useMemo(() => {
    const set = new Set()
    notes.forEach(n => n.tags?.forEach(t => set.add(t)))
    return Array.from(set).sort()
  }, [notes])

  const filteredNotes = useMemo(() => {
    const q = query.trim().toLowerCase()
    return notes
      .filter(n => {
        if (filterTag && !n.tags?.includes(filterTag)) return false
        if (!q) return true
        return (
          (n.title || '').toLowerCase().includes(q) ||
          (n.content || '').toLowerCase().includes(q) ||
          (n.tags || []).some(t => t.toLowerCase().includes(q))
        )
      })
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
        return b.updatedAt - a.updatedAt
      })
  }, [notes, query, filterTag])

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-4">
        <Header onNew={handleCreateNote} />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <aside className="lg:col-span-4 xl:col-span-3 space-y-3">
            <SearchBar
              query={query}
              onQueryChange={setQuery}
              tags={allTags}
              filterTag={filterTag}
              onFilterTagChange={setFilterTag}
              onClear={() => { setQuery(''); setFilterTag('') }}
            />
            <NoteList
              notes={filteredNotes}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onDelete={handleDeleteNote}
              onTogglePin={handleTogglePin}
              onDuplicate={handleDuplicate}
            />
          </aside>
          <main className="lg:col-span-8 xl:col-span-9">
            {selectedNote ? (
              <NoteEditor
                note={selectedNote}
                onChange={(patch) => handleUpdateNote(selectedNote.id, patch)}
                onDelete={() => handleDeleteNote(selectedNote.id)}
                onTogglePin={() => handleTogglePin(selectedNote.id)}
              />
            ) : (
              <div className="h-[70vh] grid place-items-center border border-neutral-200 dark:border-neutral-800 rounded-xl">
                <div className="text-center p-6">
                  <p className="text-lg font-medium mb-2">No note selected</p>
                  <p className="text-neutral-500 mb-4">Create a new note or select one from the list.</p>
                  <button onClick={handleCreateNote} className="px-4 py-2 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 transition">New Note</button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
