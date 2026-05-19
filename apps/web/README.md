# @starform/web

The Next.js 16 frontend for StarForm. Uses the App Router with a mix of server and client components.

## Stack

- Next.js 16 (App Router)
- Tailwind CSS v4 + shadcn/ui (radix-lyra)
- tRPC client (@starform/trpc)
- Clerk for authentication

## Pages

| Route | Type   | Description            |
| ----- | ------ | ---------------------- |
| `/`   | Server | Landing / health check |

## Development

```bash
pnpm --filter @starform/web dev
```

Opens at [http://localhost:3000](http://localhost:3000). Requires the API server running on port 8000.
