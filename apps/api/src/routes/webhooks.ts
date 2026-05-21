import { Router } from 'express';
import express from 'express';
import { Webhook } from 'svix';
import { logger } from '@starform/logger';
import { env } from '../env';
import { userService } from '@starform/services';
import type { WebhookEvent } from '@clerk/express';

export const webhooksRouter = Router();

webhooksRouter.post('/clerk', express.raw({ type: 'application/json' }), async (req, res) => {
  const WEBHOOK_SECRET = env.CLERK_WEBHOOK_SECRET;

  const payload = req.body.toString('utf8');
  const headers = req.headers;

  const svix_id = headers['svix-id'] as string;
  const svix_timestamp = headers['svix-timestamp'] as string;
  const svix_signature = headers['svix-signature'] as string;

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: 'Error occured -- no svix headers' });
  }

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err: unknown) {
    logger.error(
      { err: err instanceof Error ? err : new Error(String(err)) },
      'Error verifying webhook',
    );
    return res.status(400).json({ error: 'Error verifying webhook' });
  }

  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const data = evt.data as {
      id: string;
      email_addresses: Array<{ id: string; email_address: string }>;
      primary_email_address_id: string | null;
      first_name: string | null;
      last_name: string | null;
    };
    const { id, email_addresses, primary_email_address_id, first_name, last_name } = data;
    const primaryEmailObj = email_addresses?.find((e) => e.id === primary_email_address_id);
    const email = primaryEmailObj?.email_address ?? null;
    const name = [first_name, last_name].filter(Boolean).join(' ') || null;

    if (email) {
      try {
        await userService.upsertUser(id, email, name);
        logger.info(`User ${id} upserted successfully`);
      } catch (err) {
        logger.error(
          `Error upserting user ${id}: ${err instanceof Error ? err.message : String(err)}`,
        );
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    } else {
      logger.warn(`User ${id} has no primary email address, skipping upsert`);
    }
  }

  return res.status(200).json({ success: true });
});
