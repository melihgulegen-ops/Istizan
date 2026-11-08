export type RecordKind = 'task' | 'entry' | 'note';
export type EntryKind = 'yatan' | 'iade' | 'malzeme';
export type Priority = 'Düşük' | 'Orta' | 'Yüksek';
export interface Task { id: string; title: string; date: string; time: string; priority: Priority; plan: string; status: 'Planlandı' | 'Tamamlandı' }
export interface Entry { id: string; kind: EntryKind; name: string; date: string; person: string; amount: number; material?: string; place?: string; qty?: string }
export interface Note { id: string; title: string; date: string; content: string }
export interface Store { tasks: Task[]; entries: Entry[]; notes: Note[] }
export interface EditorDraft { title: string; date: string; time: string; priority: Priority; plan: string; status: Task['status']; entryKind: EntryKind; person: string; amount: string; material: string; place: string; qty: string; content: string }
export const kindLabels: Record<EntryKind, string> = { yatan: 'Yatan', iade: 'İade', malzeme: 'Malzemeler' };
export const pageLabels: Record<RecordKind, string> = { task: 'Görev', entry: 'İstizan', note: 'Not' };
