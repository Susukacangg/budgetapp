import type { ReportService } from './service.ts'

/** Reports are read models — no write repository in the first cut. */
export function createReportReadModel(_service: ReportService): ReportService {
  return _service
}
