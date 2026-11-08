import { useCallback, useState } from 'react';
import { useRecords } from '@/hooks/useRecords';
import { exportExcel, exportPdf } from '@/services/reports';
export function useReports() {
  const { data } = useRecords();
  const [month, setMonth] = useState('');
  const [busy, setBusy] = useState<'pdf' | 'excel' | ''>('');
  const [error, setError] = useState('');
  const run = useCallback(async (type: 'pdf' | 'excel') => {
    if (busy) return;
    if (month && !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) { setError('Ayı YYYY-AA biçiminde girin (ör. 2026-11).'); return; }
    setBusy(type); setError('');
    try { await (type === 'pdf' ? exportPdf(data, month) : exportExcel(data, month)); }
    catch (e) { setError(e instanceof Error ? e.message : 'Rapor oluşturulamadı. Tekrar deneyin.'); }
    finally { setBusy(''); }
  }, [data, month, busy]);
  return { month, setMonth, busy, error, run };
}
