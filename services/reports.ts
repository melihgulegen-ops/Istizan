// TypeScript fallback. Metro resolves reports.web.ts for web/SSR and reports.native.ts for phones.
export { exportPdf, exportExcel } from './reports.native';
