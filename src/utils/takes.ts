const DB_NAME = 'punchline'
const DB_VERSION = 1
const STORE = 'takes'

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE)
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error ?? new Error('IndexedDB open failed'))
  })
}

export async function saveTake(sessionId: string, blob: Blob): Promise<void> {
  const db = await openDb()
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).put(blob, sessionId)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error ?? new Error('saveTake failed'))
    })
  } finally {
    db.close()
  }
}

export async function loadTake(sessionId: string): Promise<Blob | null> {
  const db = await openDb()
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly')
      const req = tx.objectStore(STORE).get(sessionId)
      req.onsuccess = () => resolve((req.result as Blob | undefined) ?? null)
      req.onerror = () => reject(req.error ?? new Error('loadTake failed'))
    })
  } finally {
    db.close()
  }
}

export async function pruneTakes(keepIds: string[]): Promise<void> {
  const keep = new Set(keepIds)
  const db = await openDb()
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite')
      const store = tx.objectStore(STORE)
      const req = store.openCursor()
      req.onsuccess = () => {
        const cursor = req.result
        if (!cursor) return
        if (!keep.has(String(cursor.key))) {
          cursor.delete()
        }
        cursor.continue()
      }
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error ?? new Error('pruneTakes failed'))
    })
  } finally {
    db.close()
  }
}
