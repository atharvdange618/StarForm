import { Router } from 'express';
import { getAuth } from '@clerk/express';
import { formService, submissionService, userService } from '@starform/services';
import { csvExportLimiter } from '../middleware/rateLimit.js';

export const csvRouter = Router();

function escapeCsvField(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

csvRouter.get('/:id/responses.csv', csvExportLimiter, async (req, res) => {
  try {
    const { userId: clerkId } = getAuth(req);
    if (!clerkId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const dbUser = await userService.me(clerkId);
    if (!dbUser) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({ error: 'Form ID is required' });
      return;
    }

    let form;
    try {
      form = await formService.getById(id, dbUser.id);
    } catch {
      res.status(404).json({ error: 'Form not found' });
      return;
    }

    if (!form.publishedVersion) {
      res.status(400).json({ error: 'Form has no published version' });
      return;
    }

    const version = await formService.getPublishedVersion(id, form.publishedVersion);
    const fields = (version.fields as { id: string; label: string }[]) ?? [];

    let allSubmissions = await submissionService.list(id, dbUser.id, 1, 1000);
    let page = 2;
    while (allSubmissions.length >= 1000) {
      const nextPage = await submissionService.list(id, dbUser.id, page, 1000);
      if (nextPage.length === 0) break;
      allSubmissions = allSubmissions.concat(nextPage);
      page++;
    }

    const headers = ['Submission ID', 'Submitted At', ...fields.map((f) => f.label)];
    const csvLines = [headers.map(escapeCsvField).join(',')];

    for (const row of allSubmissions) {
      const data = (row.data as Record<string, unknown>) ?? {};
      const line = [
        row.id,
        row.createdAt.toISOString(),
        ...fields.map((f) => escapeCsvField(data[f.id] ?? '')),
      ];
      csvLines.push(line.join(','));
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="form-${form.slug}-responses.csv"`);
    res.send(csvLines.join('\n'));
  } catch (err) {
    res.status(500).json({ error: 'Failed to export CSV' });
  }
});
