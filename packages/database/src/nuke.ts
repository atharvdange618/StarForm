import { db } from './client';
import { sql } from 'drizzle-orm';

async function nuke() {
  console.log('Nuking database...');

  try {
    await db.execute(sql`
      TRUNCATE TABLE submissions, form_versions, forms, themes, users CASCADE;
    `);
    console.log('Database tables truncated successfully.');
  } catch (err) {
    console.error('Error truncating tables:', err);
    throw err;
  }

  const clerkSecret = process.env.CLERK_SECRET_KEY;
  if (clerkSecret) {
    console.log('Deleting users in Clerk...');
    try {
      const response = await fetch('https://api.clerk.com/v1/users?limit=100', {
        headers: {
          Authorization: `Bearer ${clerkSecret}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to list Clerk users: ${response.statusText}`);
      }
      const users = (await response.json()) as Array<{
        id: string;
        email_addresses: Array<{ email_address: string }>;
      }>;
      console.log(`Found ${users.length} users in Clerk.`);

      for (const user of users) {
        const email = user.email_addresses[0]?.email_address ?? 'unknown email';
        console.log(`Deleting Clerk user ${user.id} (${email})...`);
        const delResponse = await fetch(`https://api.clerk.com/v1/users/${user.id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${clerkSecret}`,
          },
        });
        if (!delResponse.ok) {
          console.error(`Failed to delete Clerk user ${user.id}: ${delResponse.statusText}`);
        } else {
          console.log(`Deleted Clerk user ${user.id}`);
        }
      }
    } catch (e) {
      console.error('Error deleting Clerk users:', e);
    }
  } else {
    console.log('CLERK_SECRET_KEY not found in env, skipping Clerk users deletion.');
  }

  console.log('Nuke process completed successfully.');
  process.exit(0);
}

nuke().catch((err) => {
  console.error('Error during nuke:', err);
  process.exit(1);
});
