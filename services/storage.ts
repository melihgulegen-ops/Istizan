import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Store, Task, Entry, Note } from '@/constants/models';
const key = 'istizan.mobile.v1';
export const emptyStore = (): Store => ({ tasks: [], entries: [], notes: [] });
const validDate = (value: unknown) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
export async function loadStore(): Promise<Store> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return emptyStore();
  const data = JSON.parse(raw);
  if (!data || !Array.isArray(data.tasks) || !Array.isArray(data.entries) || !Array.isArray(data.notes)) throw new Error('Kayıt dosyası okunamadı.');
  const tasksValid = data.tasks.every((t: Task) => typeof t.id === 'string' && typeof t.title === 'string' && validDate(t.date) && typeof t.time === 'string' && typeof t.plan === 'string' && ['Planlandı', 'Tamamlandı'].includes(t.status) && ['Düşük', 'Orta', 'Yüksek'].includes(t.priority));
  const entriesValid = data.entries.every((e: Entry) => typeof e.id === 'string' && typeof e.name === 'string' && validDate(e.date) && typeof e.person === 'string' && ['yatan', 'iade', 'malzeme'].includes(e.kind) && Number.isFinite(e.amount) && e.amount >= 0);
  const notesValid = data.notes.every((n: Note) => typeof n.id === 'string' && typeof n.title === 'string' && validDate(n.date) && typeof n.content === 'string');
  if (!tasksValid || !entriesValid || !notesValid) throw new Error('Kayıt biçimi geçersiz. Mevcut veriler değiştirilmedi.');
  return data;
}
let queue: Promise<void> = Promise.resolve();
export function saveStore(data: Store): Promise<void> {
  const snapshot = JSON.stringify(data);
  const operation = queue.catch(() => undefined).then(() => AsyncStorage.setItem(key, snapshot));
  queue = operation;
  return operation;
}
