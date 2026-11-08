import type { EditorDraft, Entry, Note, RecordKind, Store, Task } from '@/constants/models';
export function today() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
export function money(value: number) { return `${value.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺`; }
export function formatDate(value: string) { const [y, m, d] = value.split('-'); return `${d}.${m}.${y}`; }
export function dateHeading() { return new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }); }
export function balance(entries: Entry[]) {
  const month = today().slice(0, 7);
  const signed = (e: Entry) => e.kind === 'malzeme' ? -e.amount : e.amount;
  return { total: entries.reduce((s, e) => s + signed(e), 0), carry: entries.filter(e => e.date.slice(0, 7) < month).reduce((s, e) => s + signed(e), 0), current: entries.filter(e => e.date.startsWith(month)).reduce((s, e) => s + signed(e), 0), spent: entries.filter(e => e.kind === 'malzeme').reduce((s, e) => s + e.amount, 0) };
}
export function getDraft(kind: RecordKind, store: Store, id?: string, category?: string): EditorDraft {
  const base: EditorDraft = { title: '', date: today(), time: '', priority: 'Orta', plan: '', status: 'Planlandı', entryKind: category === 'iade' || category === 'malzeme' ? category : 'yatan', person: '', amount: '', material: '', place: '', qty: '', content: '' };
  if (kind === 'task') { const t = store.tasks.find(x => x.id === id); return t ? { ...base, ...t } : base; }
  if (kind === 'note') { const n = store.notes.find(x => x.id === id); return n ? { ...base, ...n } : base; }
  const e = store.entries.find(x => x.id === id);
  return e ? { ...base, title: e.name, date: e.date, entryKind: e.kind, person: e.person, amount: String(e.amount), material: e.material || '', place: e.place || '', qty: e.qty || '' } : base;
}
export function validateDraft(kind: RecordKind, draft: EditorDraft): string {
  if (!draft.title.trim()) return 'Lütfen bir başlık veya kayıt adı girin.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.date)) return 'Tarihi YYYY-AA-GG biçiminde girin.';
  const d = new Date(`${draft.date}T12:00:00`);
  const [year, month, day] = draft.date.split('-').map(Number);
  if (!Number.isFinite(d.getTime()) || d.getFullYear() !== year || d.getMonth() + 1 !== month || d.getDate() !== day) return 'Geçerli bir tarih girin.';
  if (kind === 'task' && draft.time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(draft.time)) return 'Saati SS:DD biçiminde girin (ör. 14:30).';
  const amount = Number(draft.amount.replace(',', '.'));
  if (kind === 'entry' && (!draft.amount.trim() || !Number.isFinite(amount) || amount <= 0)) return 'Tutar sıfırdan büyük olmalı (ör. 1250,50).';
  return '';
}
export function draftRecord(kind: RecordKind, draft: EditorDraft, id?: string): Task | Entry | Note {
  const recordId = id || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  if (kind === 'task') return { id: recordId, title: draft.title.trim(), date: draft.date, time: draft.time, priority: draft.priority, plan: draft.plan, status: draft.status };
  if (kind === 'note') return { id: recordId, title: draft.title.trim(), date: draft.date, content: draft.content };
  return { id: recordId, name: draft.title.trim(), date: draft.date, kind: draft.entryKind, person: draft.person, amount: Number(draft.amount.replace(',', '.')), material: draft.material, place: draft.place, qty: draft.qty };
}
export function putRecord(data: Store, kind: RecordKind, record: Task | Entry | Note): Store {
  if (kind === 'task') return { ...data, tasks: [...data.tasks.filter(t => t.id !== record.id), record as Task] };
  if (kind === 'entry') return { ...data, entries: [...data.entries.filter(e => e.id !== record.id), record as Entry] };
  return { ...data, notes: [...data.notes.filter(n => n.id !== record.id), record as Note] };
}
export function removeRecord(data: Store, kind: RecordKind, id: string): Store {
  if (kind === 'task') return { ...data, tasks: data.tasks.filter(t => t.id !== id) };
  if (kind === 'entry') return { ...data, entries: data.entries.filter(e => e.id !== id) };
  return { ...data, notes: data.notes.filter(n => n.id !== id) };
}
