import * as Print from 'expo-print';
import * as XLSX from 'xlsx';
import type { Store } from '@/constants/models';
import { reportFilename, reportHtml, reportSheets } from '@/services/reportData';

// SheetJS supports browsers. Native filesystem/sharing modules are deliberately not imported.
// Browser download and print operations run only when the user invokes these functions.
export async function exportPdf(data: Store, month: string): Promise<void> {
  await Print.printAsync({ html: reportHtml(data, month) });
}
export async function exportExcel(data: Store, month: string): Promise<void> {
  const wb = XLSX.utils.book_new();
  reportSheets(data, month).forEach(([name, rows]) => {
    const sheet = XLSX.utils.aoa_to_sheet(rows);
    sheet['!cols'] = rows[0].map(() => ({ wch: 24 }));
    XLSX.utils.book_append_sheet(wb, sheet, name);
  });
  XLSX.writeFile(wb, reportFilename(month), { bookType: 'xlsx' });
}
