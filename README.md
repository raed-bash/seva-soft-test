This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

- Debounce:
I have added a debounce feature for each request, which will delay the request for 1 second if the user enters a new query, the previous request it will be cancel to avoid unimportant requests.
- Cashing Data:
All the data that the user will request will be cached in the application and will be displayed when the user request matches the data stored in the cache.
- User Interface:
The UI is designed to give the user best experiance, and will be simple and flexable
- Parameters:
I have stored all the queries in URL parameters so that the user can give the link to anyone and they will able to see all the data that the user has filtered by his filters.
