# frontendengineerassesment

Frontend Engineer Assessment built by Milos Lekovic

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, install all the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Add .env.local file with content: NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Production url: https://frontendengineerassesment.vercel.app/

## Features

- Fetching external API https://api.oireachtas.ie/v1/legislation for retrieving bills
- Using Tailwind CSS for styling
- Using Material UI component library
- Using redux for state management (adding bills, managing favourites)
- Persisting state
- Listing bills in the table, marking bills as favourites
- Bill details dialog
- Responsive design
- Using Eslint and Prettier for code quality and consistency
- Using @heroicons/react for icons
- Pagination
- Filtering by type
