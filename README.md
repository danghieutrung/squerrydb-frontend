# SquerryDB Frontend

SquerryDB charts the IMDb rating of every episode of a TV series, so you can spot the peaks, the slumps and the season that lost the plot.

<img width="959" height="413" alt="image" src="https://github.com/user-attachments/assets/696ffd86-d04a-4980-93ba-88d99c5e54ad" />


This repo is the Next.js frontend. It talks to the [SquerryDB backend](https://github.com/danghieutrung/squerrydb-backend), a FastAPI + Strawberry GraphQL API over PostgreSQL.

## Features

- **Search** any TV series by name, with live suggestions as you type
- **Episode chart**: every episode as a dot, coloured by season, with a trend line per season
- **Season toggles** to hide or focus individual seasons; click a dot to open the episode on IMDb
- **Highlights**: highest and lowest rated episode, best season, and a season-by-season table
- **Colour-coded ratings** from deep green (9+) down to black (1.5 and below)

## Tech stack

- [Next.js](https://nextjs.org/) 15 (Pages Router), React 19, TypeScript
- [Apollo Client](https://www.apollographql.com/docs/react/) for GraphQL
- [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) primitives
- [Recharts](https://recharts.org/) for the episode chart, [Lucide](https://lucide.dev/) icons

## Getting started

Requires Node.js 18.18 or later and Yarn.

```bash
yarn install
yarn dev
```

Then open http://localhost:3000.

### Backend URL

By default the app uses the production API at
`https://squerrydb-backend-production.up.railway.app/graphql`.
To use another backend, such as one running locally, create `.env.local`:

```bash
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:8000/graphql
```

Next.js inlines this value at build time, so restart `yarn dev` (or rebuild) after changing it.

## Scripts

| Command      | What it does                        |
| ------------ | ----------------------------------- |
| `yarn dev`   | Start the dev server with Turbopack |
| `yarn build` | Create a production build           |
| `yarn start` | Serve the production build          |
| `yarn lint`  | Run ESLint                          |

## Project structure

```
src/
├── pages/          Routes: home, /search, /chart/[tconst], 404
├── components/     Layout, NavBar, SearchBox, SquerryChart, …
│   └── ui/         shadcn/ui primitives
└── lib/            Apollo client, formatting, season stats, links
```

## Deployment

Deployed on [Railway](https://railway.com/) alongside the backend and PostgreSQL database. Railway builds with `yarn build` and serves with `yarn start`, and redeploys on every push to `main`.

## Data

Data comes from the [IMDb Non-Commercial Datasets](https://developer.imdb.com/non-commercial-datasets/). SquerryDB is not affiliated with IMDb.

## Contact

contact.hieudang@gmail.com
