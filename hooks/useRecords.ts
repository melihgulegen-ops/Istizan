import { useContext, useMemo } from 'react';
import { RecordsContext } from '@/contexts/RecordsContext';
import { balance } from '@/services/records';
export function useRecords() {
  const context = useContext(RecordsContext);
  if (!context) throw new Error('RecordsProvider eksik.');
  const totals = useMemo(() => balance(context.data.entries), [context.data.entries]);
  const upcoming = useMemo(() => context.data.tasks.filter(t => t.status === 'Planlandı').sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)), [context.data.tasks]);
  return { ...context, totals, upcoming };
}
