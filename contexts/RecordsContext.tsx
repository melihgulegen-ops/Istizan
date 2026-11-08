import { createContext, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import type { Entry, Note, RecordKind, Store, Task } from '@/constants/models';
import { emptyStore, loadStore, saveStore } from '@/services/storage';
import { putRecord, removeRecord } from '@/services/records';
interface RecordsContextValue { data: Store; ready: boolean; error: string; saving: boolean; retry: () => void; upsert: (kind: RecordKind, record: Task | Entry | Note) => Promise<boolean>; remove: (kind: RecordKind, id: string) => Promise<boolean>; toggleTask: (id: string) => Promise<boolean> }
export const RecordsContext = createContext<RecordsContextValue | undefined>(undefined);
export function RecordsProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Store>(emptyStore);
  const current = useRef<Store>(emptyStore());
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const busy = useRef(false);
  useEffect(() => {
    let alive = true;
    loadStore().then(result => { if (alive) { current.current = result; setData(result); setReady(true); setError(''); } }).catch(() => { if (alive) { setReady(false); setError('Kayıtlar okunamadı. Verileriniz korunuyor; yeniden deneyin.'); } });
    return () => { alive = false; };
  }, [revision]);
  const commit = useCallback(async (next: Store) => {
    if (!ready || busy.current) return false;
    busy.current = true; setSaving(true);
    try { await saveStore(next); current.current = next; setData(next); setError(''); return true; }
    catch { setError('Kaydedilemedi. Depolama alanını kontrol edip tekrar deneyin.'); return false; }
    finally { busy.current = false; setSaving(false); }
  }, [ready]);
  const upsert = useCallback((kind: RecordKind, record: Task | Entry | Note) => commit(putRecord(current.current, kind, record)), [commit]);
  const remove = useCallback((kind: RecordKind, id: string) => commit(removeRecord(current.current, kind, id)), [commit]);
  const toggleTask = useCallback((id: string) => {
    const task = current.current.tasks.find(t => t.id === id);
    return task ? upsert('task', { ...task, status: task.status === 'Tamamlandı' ? 'Planlandı' : 'Tamamlandı' }) : Promise.resolve(false);
  }, [upsert]);
  const retry = useCallback(() => setRevision(n => n + 1), []);
  return <RecordsContext.Provider value={{ data, ready, error, saving, retry, upsert, remove, toggleTask }}>{children}</RecordsContext.Provider>;
}
