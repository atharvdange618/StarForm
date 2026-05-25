import { sql, eq, desc, and } from 'drizzle-orm';
import { db } from '@starform/database/client';
import { submissions, formVersions, forms } from '@starform/database';

interface FieldDistribution {
  fieldId: string;
  fieldLabel: string;
  fieldType: string;
  values: { label: string; count: number }[];
}

interface DailyBucket {
  day: string;
  count: number;
}

interface HourlyBucket {
  hour: number;
  count: number;
}

export interface FormStats {
  totalSubmissions: number;
  uniqueRespondents: number;
  timeline: DailyBucket[];
  hourlyDistribution: HourlyBucket[];
  fieldDistributions: FieldDistribution[];
  dropOffRates: { fieldId: string; fieldLabel: string; completionRate: number }[];
  firstSubmissionAt: string | null;
  lastSubmissionAt: string | null;
}

export async function getFormStats(formId: string): Promise<FormStats> {
  const [summaryResult, hourlyResult, submissionRows] = await Promise.all([
    db.execute(sql`
      SELECT
        (SELECT COUNT(*) FROM ${submissions} WHERE form_id = ${formId}) as total_submissions,
        (SELECT COUNT(DISTINCT respondent_hash) FROM ${submissions} WHERE form_id = ${formId}) as unique_respondents,
        COALESCE(json_agg(
          json_build_object('day', daily_counts.day, 'count', daily_counts.count)
        ), '[]') as timeline
      FROM (
        SELECT DATE_TRUNC('day', created_at) as day, COUNT(*) as count
        FROM ${submissions}
        WHERE form_id = ${formId}
        GROUP BY DATE_TRUNC('day', created_at)
        ORDER BY DATE_TRUNC('day', created_at)
      ) as daily_counts
    `),
    db.execute(sql`
      SELECT
        EXTRACT(HOUR FROM created_at)::int as hour,
        COUNT(*) as count
      FROM ${submissions}
      WHERE form_id = ${formId}
      GROUP BY EXTRACT(HOUR FROM created_at)
      ORDER BY hour
    `),
    db.query.submissions.findMany({
      where: eq(submissions.formId, formId),
      columns: { data: true, createdAt: true },
      orderBy: [desc(submissions.createdAt)],
    }),
  ]);

  const summary = summaryResult[0] as Record<string, unknown> | undefined;
  const totalSubmissions = Number(summary?.total_submissions ?? 0);
  const uniqueRespondents = Number(summary?.unique_respondents ?? 0);

  const rawTimeline = (summary?.timeline as { day: unknown; count: unknown }[] | undefined) ?? [];
  const timeline: DailyBucket[] = rawTimeline.map((t) => ({
    day: String(t.day ?? ''),
    count: Number(t.count ?? 0),
  }));

  const rawHourly = hourlyResult as unknown as { hour: unknown; count: unknown }[];
  const hourlyDistribution: HourlyBucket[] = rawHourly.map((r) => ({
    hour: Number(r.hour ?? 0),
    count: Number(r.count ?? 0),
  }));

  const form = await db.query.forms.findFirst({
    where: eq(forms.id, formId),
    columns: { publishedVersion: true },
  });

  const fieldDistributions: FieldDistribution[] = [];
  const dropOffRates: { fieldId: string; fieldLabel: string; completionRate: number }[] = [];

  if (form?.publishedVersion) {
    const version = await db.query.formVersions.findFirst({
      where: and(eq(formVersions.formId, formId), eq(formVersions.version, form.publishedVersion)),
      columns: { fields: true },
    });

    if (version) {
      const fields = (version.fields as { id: string; label: string; type: string }[]) ?? [];
      const submissionDataList = submissionRows.map((s) => s.data as Record<string, unknown>);

      for (const field of fields) {
        if (['shortText', 'longText', 'email'].includes(field.type)) {
          const filled = submissionDataList.filter(
            (d) => d[field.id] !== undefined && d[field.id] !== null && d[field.id] !== '',
          ).length;
          dropOffRates.push({
            fieldId: field.id,
            fieldLabel: field.label,
            completionRate:
              totalSubmissions > 0 ? Math.round((filled / totalSubmissions) * 100) : 0,
          });
        } else {
          const valueCounts = new Map<string, number>();
          let filled = 0;
          for (const d of submissionDataList) {
            const val = d[field.id];
            if (val !== undefined && val !== null && val !== '') {
              filled++;
              const displayVal = Array.isArray(val) ? (val as unknown[]).join(', ') : String(val);
              valueCounts.set(displayVal, (valueCounts.get(displayVal) ?? 0) + 1);
            }
          }
          fieldDistributions.push({
            fieldId: field.id,
            fieldLabel: field.label,
            fieldType: field.type,
            values: Array.from(valueCounts.entries())
              .map(([label, count]) => ({ label, count }))
              .sort((a, b) => b.count - a.count),
          });
          dropOffRates.push({
            fieldId: field.id,
            fieldLabel: field.label,
            completionRate:
              totalSubmissions > 0 ? Math.round((filled / totalSubmissions) * 100) : 0,
          });
        }
      }
    }
  }

  const firstRow = submissionRows[0];
  const lastRow = submissionRows[submissionRows.length - 1];
  const firstSubmissionAt = lastRow?.createdAt ? lastRow.createdAt.toISOString() : null;
  const lastSubmissionAt = firstRow?.createdAt ? firstRow.createdAt.toISOString() : null;

  return {
    totalSubmissions,
    uniqueRespondents,
    timeline,
    hourlyDistribution,
    fieldDistributions,
    dropOffRates,
    firstSubmissionAt,
    lastSubmissionAt,
  };
}
