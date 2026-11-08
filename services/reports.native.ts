import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as XLSX from 'xlsx';
import type { Store } from '@/constants/models';
import { reportFilename, reportHtml, reportSheets } from '@/services/reportData';

// The installed Expo SDK exposes the asynchronous filesystem API at the package root.
// Keep native filesystem and sharing imports out of the web/SSR bundle.
export async function exportPdf(data: Store, month: string): Promise<void> {
  if (!await Sharing.isAvailableAsync()) throw new Error('Bu cihazda paylaşım kullanılamıyor.');
  const result = await Print.printToFileAsync({ html: reportHtml(data, month) });
  try {
    await Sharing.shareAsync(result.uri, { mimeType: 'application/pdf', UTI: '.pdf', dialogTitle: 'İstizan PDF raporu' });
  } finally {
    await FileSystem.deleteAsync(result.uri, { idempotent: true }).catch(() => undefined);
  }
}
export async function exportExcel(data: Store, month: string): Promise<void> {
  if (!await Sharing.isAvailableAsync() || !FileSystem.cacheDirectory) throw new Error('Bu cihazda dosya paylaşımı kullanılamıyor.');
  const wb = XLSX.utils.book_new();
  reportSheets(data, month).forEach(([name, rows]) => {
    const sheet = XLSX.utils.aoa_to_sheet(rows);
    sheet['!cols'] = rows[0].map(() => ({ wch: 24 }));
    XLSX.utils.book_append_sheet(wb, sheet, name);
  });
  const uri = FileSystem.cacheDirectory + reportFilename(month);
  try {
    // React Native has no browser download API. Serialize to base64, then share a local file.
    const contents: string = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
    await FileSystem.writeAsStringAsync(uri, contents, { encoding: FileSystem.EncodingType.Base64 });
    await Sharing.shareAsync(uri, { mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', dialogTitle: 'İstizan Excel raporu' });
  } finally {
    await FileSystem.deleteAsync(uri, { idempotent: true }).catch(() => undefined);
  }
}
