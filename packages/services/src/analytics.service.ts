import { sql } from 'drizzle-orm';
import { db } from '@starform/database/client';
import { submissions } from '@starform/database';

export async function getFormStats(formId: string) {
  const result = await db.execute(sql`
    WITH daily_counts AS (
      SELECT
        DATE_TRUNC('day', created_at) as day,
        COUNT(*) as count
      FROM ${submissions}
      WHERE form_id = ${formId}
      GROUP BY DATE_TRUNC('day', created_at)
    )
    SELECT
      (SELECT COUNT(*) FROM ${submissions} WHERE form_id = ${formId}) as total_submissions,
      (SELECT COUNT(DISTINCT respondent_hash) FROM ${submissions} WHERE form_id = ${formId}) as unique_respondents,
      COALESCE(json_agg(
        json_build_object('day', daily_counts.day, 'count', daily_counts.count)
      ), '[]') as timeline
    FROM daily_counts
  `);

  return result[0];
}
