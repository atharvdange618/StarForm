import { db } from './client';
import { themes, users, forms, formVersions, submissions } from './schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

const globalThemes = [
  {
    name: 'startup',
    isGlobal: true,
    config: {
      colors: { primary: '#3b82f6', secondary: '#e0f2fe', background: '#f0f9ff', text: '#0f172a' },
      fonts: { heading: 'Inter', body: 'Inter' },
    },
  },
  {
    name: 'anime',
    isGlobal: true,
    config: {
      colors: { primary: '#f472b6', secondary: '#fce7f3', background: '#fff1f2', text: '#1e1b4b' },
      fonts: { heading: 'Inter', body: 'Inter' },
    },
  },
  {
    name: 'gaming',
    isGlobal: true,
    config: {
      colors: { primary: '#4ade80', secondary: '#14532d', background: '#052e16', text: '#f0fdf4' },
      fonts: { heading: 'Inter', body: 'Inter' },
    },
  },
  {
    name: 'space',
    isGlobal: true,
    config: {
      colors: { primary: '#a78bfa', secondary: '#3b0764', background: '#0f0a1e', text: '#f5f3ff' },
      fonts: { heading: 'Inter', body: 'Inter' },
    },
  },
  {
    name: 'retro',
    isGlobal: true,
    config: {
      colors: { primary: '#fbbf24', secondary: '#78350f', background: '#1c1007', text: '#fffbeb' },
      fonts: { heading: 'Inter', body: 'Inter' },
    },
  },
];

async function seed() {
  console.log('Starting seed process...');

  console.log('Seeding global themes...');
  const existingGlobalThemes = await db.select().from(themes).where(eq(themes.isGlobal, true));
  const existingNames = new Set(existingGlobalThemes.map((t) => t.name));
  const themesToInsert = globalThemes.filter((t) => !existingNames.has(t.name));

  if (themesToInsert.length > 0) {
    await db.insert(themes).values(themesToInsert);
  }

  const allThemes = await db.select().from(themes).where(eq(themes.isGlobal, true));
  const themeMap = new Map(allThemes.map((t) => [t.name, t.id]));
  console.log(`Themes loaded: ${allThemes.length}`);

  console.log('Seeding creator user...');
  const creatorEmail = 'atharvdange.dev@gmail.com';
  const clerkId = process.env.CLERK_DEMO_USER_ID || 'user_demo123456789';

  let [creator] = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);

  if (creator) {
    await db
      .update(users)
      .set({
        plan: 'pro',
        roles: ['creator', 'respondent'],
      })
      .where(eq(users.id, creator.id));
    console.log(`Existing creator synchronized by clerkId: ${creator.id}`);
  } else {
    let [creatorByEmail] = await db
      .select()
      .from(users)
      .where(eq(users.email, creatorEmail))
      .limit(1);

    if (creatorByEmail) {
      [creator] = await db
        .update(users)
        .set({
          clerkId,
          plan: 'pro',
          roles: ['creator', 'respondent'],
        })
        .where(eq(users.id, creatorByEmail.id))
        .returning();
      console.log(`Creator synchronized by email: ${creator!.id}`);
    } else {
      [creator] = await db
        .insert(users)
        .values({
          clerkId,
          email: creatorEmail,
          name: 'Demo Creator',
          roles: ['creator', 'respondent'],
          plan: 'pro',
        })
        .returning();
      console.log(`New creator created: ${creator!.id}`);
    }
  }

  const formsToSeed = [
    {
      title: 'Tech w/ StarForm',
      slug: 'tech-survey',
      themeName: 'startup',
      description: 'A survey to collect developer tool preferences and industry trends.',
      fields: [
        {
          id: '8e8dfdf1-ea21-4fa3-9b97-8c3df5b4e701',
          type: 'shortText',
          label: 'What is your name?',
          required: true,
          config: {},
          order: 0,
        },
        {
          id: '8e8dfdf1-ea21-4fa3-9b97-8c3df5b4e702',
          type: 'number',
          label: 'Years of experience in programming',
          required: true,
          config: { min: 0, max: 50 },
          order: 1,
        },
        {
          id: '8e8dfdf1-ea21-4fa3-9b97-8c3df5b4e703',
          type: 'singleSelect',
          label: 'Favorite frontend framework',
          required: true,
          config: { options: ['React', 'Vue', 'Svelte', 'Angular', 'Next.js'] },
          order: 2,
        },
        {
          id: '8e8dfdf1-ea21-4fa3-9b97-8c3df5b4e704',
          type: 'multiSelect',
          label: 'Databases you use daily',
          required: false,
          config: { options: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'SQLite'] },
          order: 3,
        },
        {
          id: '8e8dfdf1-ea21-4fa3-9b97-8c3df5b4e705',
          type: 'dropdown',
          label: 'Primary AI assistant',
          required: true,
          config: { options: ['Cursor', 'Copilot', 'Gemini', 'ChatGPT', 'Claude'] },
          order: 4,
        },
        {
          id: '8e8dfdf1-ea21-4fa3-9b97-8c3df5b4e706',
          type: 'longText',
          label: 'Any additional feedback about modern toolchains?',
          required: false,
          config: {},
          order: 5,
        },
      ],
      submissions: [
        {
          name: 'Alice Smith',
          exp: 4,
          framework: 'React',
          dbs: ['PostgreSQL', 'Redis'],
          ai: 'Cursor',
          feedback: 'Cursor has changed how I code.',
        },
        {
          name: 'Bob Jones',
          exp: 8,
          framework: 'Next.js',
          dbs: ['PostgreSQL', 'SQLite'],
          ai: 'Claude',
          feedback: 'Next.js 16 with Turbopack is incredibly fast!',
        },
        {
          name: 'Charlie Brown',
          exp: 2,
          framework: 'Vue',
          dbs: ['MongoDB'],
          ai: 'Copilot',
          feedback: '',
        },
        {
          name: 'Diana Prince',
          exp: 12,
          framework: 'Svelte',
          dbs: ['SQLite', 'Redis'],
          ai: 'Gemini',
          feedback: 'Svelte is beautiful.',
        },
        {
          name: 'Evan Wright',
          exp: 1,
          framework: 'React',
          dbs: ['MySQL'],
          ai: 'ChatGPT',
          feedback: 'Just getting started with coding.',
        },
        {
          name: 'Fiona Gallagher',
          exp: 6,
          framework: 'React',
          dbs: ['PostgreSQL', 'MongoDB', 'Redis'],
          ai: 'Cursor',
          feedback: 'Monorepos are hard but turbo makes it easier.',
        },
        {
          name: 'George Costanza',
          exp: 3,
          framework: 'Angular',
          dbs: ['MySQL'],
          ai: 'ChatGPT',
          feedback: "It's not a lie if you believe it.",
        },
        {
          name: 'Hannah Abbott',
          exp: 5,
          framework: 'Svelte',
          dbs: ['PostgreSQL'],
          ai: 'Claude',
          feedback: '',
        },
        {
          name: 'Ian Malcolm',
          exp: 15,
          framework: 'Next.js',
          dbs: ['PostgreSQL', 'MongoDB', 'SQLite', 'Redis'],
          ai: 'Cursor',
          feedback: 'Life finds a way.',
        },
        {
          name: 'Julia Roberts',
          exp: 7,
          framework: 'React',
          dbs: ['PostgreSQL'],
          ai: 'Claude',
          feedback: 'Email confirmation copy was sent.',
        },
        {
          name: 'Kevin Bacon',
          exp: 9,
          framework: 'Vue',
          dbs: ['MySQL', 'SQLite'],
          ai: 'Copilot',
          feedback: '',
        },
        {
          name: 'Laura Croft',
          exp: 10,
          framework: 'Next.js',
          dbs: ['PostgreSQL', 'Redis'],
          ai: 'Cursor',
          feedback: 'StarForm is super polished.',
        },
      ],
    },
    {
      title: 'Anime Watch Party',
      slug: 'anime-party',
      themeName: 'anime',
      description: 'RSVP and pick which anime show we should screen this week.',
      fields: [
        {
          id: 'cb902f5a-c21e-450f-9087-9bcbf5b4c701',
          type: 'shortText',
          label: 'Your name/alias',
          required: true,
          config: {},
          order: 0,
        },
        {
          id: 'cb902f5a-c21e-450f-9087-9bcbf5b4c702',
          type: 'singleSelect',
          label: 'Will you attend?',
          required: true,
          config: { options: ['Yes', 'No', 'Maybe'] },
          order: 1,
        },
        {
          id: 'cb902f5a-c21e-450f-9087-9bcbf5b4c703',
          type: 'singleSelect',
          label: 'Which anime should we watch?',
          required: true,
          config: {
            options: ['Demon Slayer', 'Jujutsu Kaisen', 'Frieren', 'Chainsaw Man', 'One Piece'],
          },
          order: 2,
        },
        {
          id: 'cb902f5a-c21e-450f-9087-9bcbf5b4c704',
          type: 'multiSelect',
          label: 'Snacks you can bring',
          required: false,
          config: { options: ['Chips', 'Soda', 'Pizza', 'Popcorn', 'Pocky', 'Ramune'] },
          order: 3,
        },
        {
          id: 'cb902f5a-c21e-450f-9087-9bcbf5b4c705',
          type: 'rating',
          label: 'How excited are you for the seasonal line-up?',
          required: true,
          config: { max: 5 },
          order: 4,
        },
      ],
      submissions: [
        { alias: 'Goku', rsvp: 'Yes', show: 'One Piece', snacks: ['Pizza', 'Soda'], rating: 5 },
        { alias: 'Deku', rsvp: 'Yes', show: 'Frieren', snacks: ['Pocky'], rating: 5 },
        {
          alias: 'Naruto',
          rsvp: 'Yes',
          show: 'Jujutsu Kaisen',
          snacks: ['Ramune', 'Pizza'],
          rating: 4,
        },
        {
          alias: 'Luffy',
          rsvp: 'Yes',
          show: 'One Piece',
          snacks: ['Pizza', 'Chips', 'Popcorn'],
          rating: 5,
        },
        { alias: 'Zoro', rsvp: 'Maybe', show: 'Jujutsu Kaisen', snacks: [], rating: 3 },
        { alias: 'Nami', rsvp: 'Yes', show: 'Frieren', snacks: ['Soda'], rating: 4 },
        { alias: 'Sanji', rsvp: 'Yes', show: 'Chainsaw Man', snacks: ['Pizza'], rating: 5 },
        { alias: 'Chopper', rsvp: 'Yes', show: 'Frieren', snacks: ['Pocky', 'Ramune'], rating: 5 },
        { alias: 'Robin', rsvp: 'Yes', show: 'Frieren', snacks: ['Soda'], rating: 4 },
        { alias: 'Saitama', rsvp: 'No', show: 'Demon Slayer', snacks: [], rating: 1 },
      ],
    },
    {
      title: 'Game Night RSVP',
      slug: 'game-night',
      themeName: 'gaming',
      description: 'RSVP for the weekly local co-op and multiplayer game night.',
      fields: [
        {
          id: 'ea002cba-fa3b-4682-8bc2-2acdf5b4d701',
          type: 'shortText',
          label: 'Gamertag',
          required: true,
          config: {},
          order: 0,
        },
        {
          id: 'ea002cba-fa3b-4682-8bc2-2acdf5b4d702',
          type: 'singleSelect',
          label: 'Platform of choice',
          required: true,
          config: { options: ['PC', 'PS5', 'Xbox Series X', 'Nintendo Switch'] },
          order: 1,
        },
        {
          id: 'ea002cba-fa3b-4682-8bc2-2acdf5b4d703',
          type: 'dropdown',
          label: 'What should we play first?',
          required: true,
          config: {
            options: ['Super Smash Bros', 'Mario Kart', 'Overwatch', 'Valorant', 'Lethal Company'],
          },
          order: 2,
        },
        {
          id: 'ea002cba-fa3b-4682-8bc2-2acdf5b4d704',
          type: 'singleSelect',
          label: 'Food preference',
          required: true,
          config: { options: ['Burgers', 'Pizza', 'Tacos', 'Sushi', 'Vegan options'] },
          order: 3,
        },
        {
          id: 'ea002cba-fa3b-4682-8bc2-2acdf5b4d705',
          type: 'date',
          label: 'Preferred date for the event',
          required: true,
          config: {},
          order: 4,
        },
      ],
      submissions: [
        {
          tag: 'MasterChief',
          plat: 'Xbox Series X',
          game: 'Super Smash Bros',
          food: 'Burgers',
          date: '2026-06-05',
        },
        { tag: 'Kratos', plat: 'PS5', game: 'Lethal Company', food: 'Pizza', date: '2026-06-05' },
        {
          tag: 'Mario',
          plat: 'Nintendo Switch',
          game: 'Mario Kart',
          food: 'Pizza',
          date: '2026-06-06',
        },
        {
          tag: 'Link',
          plat: 'Nintendo Switch',
          game: 'Lethal Company',
          food: 'Sushi',
          date: '2026-06-05',
        },
        { tag: 'DoomSlayer', plat: 'PC', game: 'Valorant', food: 'Tacos', date: '2026-06-07' },
        {
          tag: 'Cortana',
          plat: 'PC',
          game: 'Lethal Company',
          food: 'Vegan options',
          date: '2026-06-05',
        },
        {
          tag: 'Geralt',
          plat: 'PC',
          game: 'Super Smash Bros',
          food: 'Burgers',
          date: '2026-06-06',
        },
        { tag: 'Cloud', plat: 'PS5', game: 'Mario Kart', food: 'Sushi', date: '2026-06-05' },
        { tag: 'Sephiroth', plat: 'PS5', game: 'Valorant', food: 'Burgers', date: '2026-06-05' },
        { tag: 'Steve', plat: 'PC', game: 'Lethal Company', food: 'Pizza', date: '2026-06-06' },
        {
          tag: 'Samus',
          plat: 'Nintendo Switch',
          game: 'Super Smash Bros',
          food: 'Sushi',
          date: '2026-06-05',
        },
        {
          tag: 'SolidSnake',
          plat: 'PS5',
          game: 'Lethal Company',
          food: 'Tacos',
          date: '2026-06-05',
        },
        { tag: 'LeonS', plat: 'PC', game: 'Overwatch', food: 'Burgers', date: '2026-06-07' },
        {
          tag: 'Chell',
          plat: 'PC',
          game: 'Lethal Company',
          food: 'Vegan options',
          date: '2026-06-05',
        },
        { tag: 'V', plat: 'PC', game: 'Valorant', food: 'Pizza', date: '2026-06-06' },
      ],
    },
  ];

  for (const formDef of formsToSeed) {
    console.log(`Seeding form: ${formDef.title}...`);

    const existingForms = await db.select().from(forms).where(eq(forms.slug, formDef.slug));
    for (const f of existingForms) {
      await db.delete(submissions).where(eq(submissions.formId, f.id));
      await db.delete(formVersions).where(eq(formVersions.formId, f.id));
      await db.delete(forms).where(eq(forms.id, f.id));
    }

    const themeId = themeMap.get(formDef.themeName) || null;

    const [insertedForm] = await db
      .insert(forms)
      .values({
        creatorId: creator.id,
        title: formDef.title,
        slug: formDef.slug,
        description: formDef.description,
        visibility: 'public',
        status: 'published',
        fields: formDef.fields,
        themeId,
        config: {
          thankYouMessage: 'Thank you for your response! Your answers have been recorded.',
        },
        publishedVersion: 1,
      })
      .returning();

    if (!insertedForm) {
      throw new Error(`Failed to insert form ${formDef.title}`);
    }

    const [insertedVersion] = await db
      .insert(formVersions)
      .values({
        formId: insertedForm.id,
        version: 1,
        fields: formDef.fields,
        config: insertedForm.config,
      })
      .returning();

    if (!insertedVersion) {
      throw new Error(`Failed to insert form version for ${formDef.title}`);
    }

    console.log(`Generating ${formDef.submissions.length} submissions for ${formDef.title}...`);

    const now = new Date();

    const submissionInserts = formDef.submissions.map((sub, idx) => {
      const dayOffset = Math.floor(idx / 2);
      const hourOffset = (idx * 3) % 24;
      const date = new Date(
        now.getTime() - dayOffset * 24 * 60 * 60 * 1000 - hourOffset * 60 * 60 * 1000,
      );

      let data: Record<string, unknown> = {};

      if (formDef.slug === 'tech-survey') {
        const s = sub as {
          name: string;
          exp: number;
          framework: string;
          dbs: string[];
          ai: string;
          feedback: string;
        };
        data = {
          '8e8dfdf1-ea21-4fa3-9b97-8c3df5b4e701': s.name,
          '8e8dfdf1-ea21-4fa3-9b97-8c3df5b4e702': s.exp,
          '8e8dfdf1-ea21-4fa3-9b97-8c3df5b4e703': s.framework,
          '8e8dfdf1-ea21-4fa3-9b97-8c3df5b4e704': s.dbs,
          '8e8dfdf1-ea21-4fa3-9b97-8c3df5b4e705': s.ai,
          '8e8dfdf1-ea21-4fa3-9b97-8c3df5b4e706': s.feedback,
        };
      } else if (formDef.slug === 'anime-party') {
        const s = sub as {
          alias: string;
          rsvp: string;
          show: string;
          snacks: string[];
          rating: number;
        };
        data = {
          'cb902f5a-c21e-450f-9087-9bcbf5b4c701': s.alias,
          'cb902f5a-c21e-450f-9087-9bcbf5b4c702': s.rsvp,
          'cb902f5a-c21e-450f-9087-9bcbf5b4c703': s.show,
          'cb902f5a-c21e-450f-9087-9bcbf5b4c704': s.snacks,
          'cb902f5a-c21e-450f-9087-9bcbf5b4c705': s.rating,
        };
      } else if (formDef.slug === 'game-night') {
        const s = sub as { tag: string; plat: string; game: string; food: string; date: string };
        data = {
          'ea002cba-fa3b-4682-8bc2-2acdf5b4d701': s.tag,
          'ea002cba-fa3b-4682-8bc2-2acdf5b4d702': s.plat,
          'ea002cba-fa3b-4682-8bc2-2acdf5b4d703': s.game,
          'ea002cba-fa3b-4682-8bc2-2acdf5b4d704': s.food,
          'ea002cba-fa3b-4682-8bc2-2acdf5b4d705': s.date,
        };
      }

      return {
        formId: insertedForm.id,
        formVersionId: insertedVersion.id,
        respondentHash: `seeded_respondent_${randomUUID().slice(0, 8)}`,
        data,
        metadata: { ip: '127.0.0.1', userAgent: 'Mozilla/5.0 (Seeded)' },
        createdAt: date,
      };
    });

    await db.insert(submissions).values(submissionInserts);
    console.log(`Form ${formDef.title} seeded successfully.`);
  }

  console.log('Database seeding completed successfully!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Error during database seed execution:', err);
  process.exit(1);
});
