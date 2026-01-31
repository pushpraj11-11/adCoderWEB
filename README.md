# AdCoderWEB Premium Commerce

A production-ready, premium e-commerce experience built with **React + TypeScript**, **Node.js + Express**, **PostgreSQL + Prisma**, and **Tailwind CSS**. The project includes a customer storefront, authentication, checkout, wishlist, order tracking, and a full admin dashboard.

## Folder Structure

```
.
├── client/                 # React + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── layout/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── types/
│   ├── index.html
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # Node + Express API
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── controllers/
│   │   ├── lib/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── validators/
│   ├── uploads/
│   └── package.json
├── .env.example
└── package.json
```

## Setup

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment

Copy `.env.example` to `.env` and update values.

```bash
cp .env.example .env
cp client/.env.example client/.env
```

### 3) Set up database

Create a PostgreSQL database and update `DATABASE_URL` in `.env`, then run:

```bash
cd server
npx prisma migrate dev --name init
npx prisma generate
npm run seed
```

### 4) Run the project

From the root:

```bash
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:4000

## Default Seed Accounts

- **Admin**: admin@adcoderweb.com / `password123`
- **Customer**: customer@adcoderweb.com / `password123`

## Stripe Placeholder

Stripe is integration-ready in the checkout UI. Add your keys to `.env`:

```
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

## Production Deployment (Next Improvements)

- Add Redis for session/refresh token storage and rate-limit backing store.
- Add full Stripe payment flow with webhooks.
- Add image storage via S3 or Cloudinary.
- Add server-side pagination caches (e.g., Redis) and CDN for assets.
- Add end-to-end tests (Playwright) and CI pipelines.
