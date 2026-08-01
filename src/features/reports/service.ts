import type { PeriodSummary } from './model.ts'

export type ReportService = {
  periodSummary(year: number, month: number): Promise<PeriodSummary | null>
}

export function createReportService(): ReportService {
  return {
    periodSummary: async () => null,
  }
}
