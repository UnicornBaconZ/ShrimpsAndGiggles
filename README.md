# 🦐 Shrimps & Giggles

A small full-stack shop that sells **live Neocaridina shrimp** as aquarium pets. **Next.js** frontend, **NestJS** backend, **SQLite** via **TypeORM**, styled with **Tailwind** in a warm, organic look. Built following clean architecture and clean code principles.

```
Shrimps and Giggles/
├── backend/    NestJS API — clean architecture (domain / application / infrastructure / presentation)
└── frontend/   Next.js 14 App Router — Home, About, Store + cart & checkout
```

## What it does

Three pages: a **Home** landing page, an **About** story/care page, and a **Store** that pulls the catalog of shrimp varieties from the API. You can browse the colony, add shrimp to a cart (priced per shrimp), and check out — which POSTs a real order that is persisted into SQLite. Prices and order totals are always computed on the server from the source of truth, never trusted from the client. Placing an order also **decrements stock inside a database transaction**, so the same shrimp can never be sold twice.

All varieties are *Neocaridina davidi* colour strains (Red Cherry, Bloody Mary, Blue Dream, Green Jade, and so on), each with a colour group and a beginner/intermediate care level. Product images are colour-coded placeholders from placehold.co — swap the `imageUrl` values in the seeder for your own tank photos before going live.

## Architecture (backend)

Dependencies point inward, toward the domain:

- **domain/** — Pure business entities (`Product`, `Order`, `OrderItem`) and repository *ports* (interfaces). No framework code.
- **application/** — Use cases (`ListProducts`, `GetProduct`, `CreateOrder`, `GetOrder`), DTOs, and the `UnitOfWork` port that lets a use case run atomically. Orchestrates domain rules.
- **infrastructure/** — TypeORM/SQLite persistence: ORM entities, repository implementations, mappers, DB config, seeder, and the `TypeOrmUnitOfWork` (transaction boundary).
- **presentation/** — Thin HTTP controllers that translate requests into use-case calls.

The `AppModule` is the composition root — the one place that binds abstract ports (`PRODUCT_REPOSITORY`, `ORDER_REPOSITORY`, `UNIT_OF_WORK`) to their concrete TypeORM implementations. Swapping SQLite for Postgres means changing only the infrastructure layer.

## Prerequisites

Node.js 20+ and npm.

## Running it

Open two terminals.

### 1. Backend (port 3001)

```bash
cd backend
npm install
cp .env.example .env          # optional; sensible defaults exist
npm run seed                  # creates shrimp-shop.sqlite and adds 6 shrimp
npm run start:dev
```

API is served under `http://localhost:3001/api`.

| Method | Route               | Purpose                                    |
| ------ | ------------------- | ------------------------------------------ |
| GET    | `/api/products`     | List all shrimp                            |
| GET    | `/api/products/:id` | Get one shrimp                             |
| POST   | `/api/orders`       | Place an order (persisted to SQLite)       |
| GET    | `/api/orders/:id`   | Fetch a placed order by id                 |

### 2. Frontend (port 3000)

```bash
cd frontend
npm install
cp .env.local.example .env.local   # points at http://localhost:3001/api
npm run dev
```

Open `http://localhost:3000`.

## Notes

- **Money** is stored in integer cents everywhere to avoid floating-point errors.
- **Stock** is decremented as shrimp are sold; the stock check, decrement, and order insert all run inside a single transaction (`UnitOfWork`), so two simultaneous checkouts can't oversell the last shrimp.
- **Cart** state lives in React context and is mirrored to `localStorage`, so the basket survives a refresh; the order is only persisted when you check out.
- `synchronize: true` is enabled for convenience in this demo — a production app would use TypeORM migrations instead.
- Product images are hosted on Unsplash (allow-listed in `next.config.mjs`).

## Verified

Both apps type-check and build cleanly. The API was smoke-tested end-to-end: seeding, listing products, placing an order (total computed server-side, stock decremented transactionally, and line items written to SQLite), fetching an order back by id, and input validation rejecting bad payloads with HTTP 400.
