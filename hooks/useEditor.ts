import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import type { EditorDraft, RecordKind } from '@/constants/models';
import { draftRecord, getDraft, validateDraft } from '@/services/records';
import { useRecords } from '@/hooks/useRecords';
export function useEditor(kind: RecordKind, id?: string, category?: string) {
  const { data, ready, upsert, remove, saving } = useRecords();
  const router = useRouter();
  const [draft, setDraft] = useState<EditorDraft>(() => getDraft(kind, data, id, category));
  const [error, setError] = useState('');
  useEffect(() => { if (ready) setDraft(getDraft(kind, data, id, category)); }, [ready, id, kind, category]);
  const change = useCallback(<K extends keyof EditorDraft>(key: K, value: EditorDraft[K]) => { setDraft(d => ({ ...d, [key]: value })); setError(''); }, []);
  const save = useCallback(async () => {
    const issue = validateDraft(kind, draft);
    if (issue) { setError(issue); return; }
    if (await upsert(kind, draftRecord(kind, draft, id))) router.back();
    else setError('Kayıt saklanamadı. Lütfen tekrar deneyin.');
  }, [draft, kind, id, upsert, router]);
  const deleteItem = useCallback(async () => { if (id && await remove(kind, id)) router.back(); else setError('Kayıt silinemedi. Tekrar deneyin.'); }, [id, kind, remove, router]);
  return { draft, change, save, deleteItem, error, saving, ready };
}
