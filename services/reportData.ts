import type { Store } from '@/constants/models';
import { balance, formatDate, money, today } from '@/services/records';
import { kindLabels } from '@/constants/models';
const escapeHtml = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch] || ch));
export function filterReport(data: Store, month: string): Store {
  return { tasks: data.tasks.filter(t => !month || t.date.startsWith(month)), entries: data.entries.filter(e => !month || e.date.startsWith(month)), notes: data.notes.filter(n => !month || n.date.startsWith(month)) };
}
function table(headers: string[], rows: unknown[][]) {
  return `<table><thead><tr>${headers.map(h => `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead><tbody>${rows.length ? rows.map(row => `<tr>${row.map(cell => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('') : `<tr><td colspan="${headers.length}">Kayıt bulunmuyor.</td></tr>`}</tbody></table>`;
}
export function reportHtml(all: Store, month: string): string {
  const data = filterReport(all, month);
  const totals = balance(all);
  return `<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8"><title>İstizan Raporu</title><style>body{font:14px Arial,sans-serif;color:#172035;padding:24px}h1{color:#8b6c32}h2{margin-top:28px}table{border-collapse:collapse;width:100%;font-size:11px}td,th{border:1px solid #ddd;padding:8px;text-align:left;white-space:pre-wrap;word-break:break-word}th{background:#f4efe5}footer{margin-top:30px;color:#666}@page{size:A4;margin:16mm}</style></head><body><h1>İSTİZAN</h1><p>Görev · İstizan · Not Takibi</p><p>Dönem: ${escapeHtml(month || 'Tüm kayıtlar')} · Oluşturulma: ${formatDate(today())}</p><p>Tüm kayıtların güncel bakiyesi: <b>${money(totals.total)}</b> · Harcanan: ${money(totals.spent)}</p><h2>Görevler</h2>${table(['Başlık', 'Tarih', 'Saat', 'Öncelik', 'Durum', 'Plan'], data.tasks.map(t => [t.title, formatDate(t.date), t.time, t.priority, t.status, t.plan]))}<h2>İstizan Kayıtları</h2>${table(['Kategori', 'Kayıt', 'Tarih', 'Kişi', 'Tutar', 'Malzeme / Yer / Miktar'], data.entries.map(e => [kindLabels[e.kind], e.name, formatDate(e.date), e.person, money(e.amount), [e.material, e.place, e.qty].filter(Boolean).join(' / ')]))}<h2>Notlar</h2>${table(['Başlık', 'Tarih', 'İçerik'], data.notes.map(n => [n.title, formatDate(n.date), n.content]))}<footer>Melih Gülegen · MGN — Cihazda oluşturulmuştur.</footer></body></html>`;
}
export function reportSheets(all: Store, month: string): [string, (string | number)[][]][] {
  const data = filterReport(all, month);
  return [
    ['Görevler', [['Başlık', 'Tarih', 'Saat', 'Öncelik', 'Durum', 'Plan'], ...data.tasks.map(t => [t.title, t.date, t.time, t.priority, t.status, t.plan])]],
    ['İstizan', [['Kategori', 'Kayıt', 'Tarih', 'Kişi', 'Tutar', 'Malzeme', 'Alınan yer', 'Miktar'], ...data.entries.map(e => [kindLabels[e.kind], e.name, e.date, e.person, e.amount, e.material || '', e.place || '', e.qty || ''])]],
    ['Notlar', [['Başlık', 'Tarih', 'İçerik'], ...data.notes.map(n => [n.title, n.date, n.content])]],
  ];
}
export function reportFilename(month: string) { return `Istizan-${month || today()}.xlsx`; }
