# Sprig — Food Delivery Order Management

A full-stack order management feature for a food delivery app built with Next.js 15 (App Router), Tailwind CSS, and TypeScript. Users can browse a menu, add items to a cart, place orders with delivery details, and track order status in real time via Server-Sent Events.

---

## Live Demo

> Hosted on Vercel: _[add your URL here after deployment]_

---

## Features

- **Menu Display** — Grid of food items organised by category with images, descriptions, tags, calories, and prices
- **Search** — Live filtering across item names, descriptions, and tags
- **Cart** — Slide-out drawer with quantity controls, subtotal, delivery fee, and tax calculation
- **Checkout** — Delivery details form with client-side validation (name, phone, address)
- **Order Placement** — POST to REST API with full server-side validation
- **Real-Time Order Tracking** — Status stepper powered by Server-Sent Events (SSE); status advances automatically: Received → Preparing → Out for Delivery → Delivered
- **TDD** — Vitest unit tests covering order store CRUD, status sequencing, and edge cases

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Fonts | Playfair Display (display), Inter (body) — Google Fonts via next/font |
| Data Storage | In-memory (Node.js global Map, survives hot reload) |
| Real-Time | Server-Sent Events (SSE) |
| Testing | Vitest + Testing Library |
| Deployment | Vercel |

---

## Project Structure

```
src/
  app/
    api/
      menu/route.ts               # GET  /api/menu
      orders/route.ts             # POST /api/orders
      orders/[id]/route.ts        # GET  /api/orders/:id  |  PATCH (advance status)
      orders/[id]/stream/route.ts # GET  /api/orders/:id/stream  (SSE)
    page.tsx                      # Menu + cart
    checkout/page.tsx             # Checkout form
    orders/[id]/page.tsx          # Order tracking
    layout.tsx                    # Root layout with CartProvider
  components/
    Header.tsx                    # Sticky nav with cart button
    MenuGrid.tsx                  # Search + category sections
    MenuCard.tsx                  # Individual item card
    CartDrawer.tsx                # Slide-out cart
    StatusStepper.tsx             # Vertical order status stepper
  context/
    CartContext.tsx                # Global cart state (React Context)
  lib/
    data.ts                       # Menu items + categories + helpers
    store.ts                      # In-memory order store (global Map)
    types.ts                      # Shared TypeScript types
  __tests__/
    setup.ts                      # Vitest + Testing Library setup
    orders.test.ts                # Order store unit tests
```

---

## API Reference

### `GET /api/menu`
Returns all menu categories and items.

**Response**
```json
{
  "categories": [...],
  "items": [...]
}
```

---

### `POST /api/orders`
Places a new order.

**Request body**
```json
{
  "items": { "b1": 2, "j1": 1 },
  "delivery": {
    "name": "Alex Green",
    "phone": "5551234567",
    "address": "21 Elm Street",
    "city": "Portland",
    "zip": "97201",
    "notes": "Leave at door"
  }
}
```

**Response `201`**
```json
{
  "order": {
    "id": "7842",
    "status": "received",
    "total": 38.16,
    ...
  }
}
```

**Response `422`** — validation failure
```json
{
  "errors": ["name is required", "phone must have at least 7 digits"]
}
```

---

### `GET /api/orders/:id`
Returns a single order by ID.

---

### `PATCH /api/orders/:id`
Manually advances the order status by one step. Useful for testing.

---

### `GET /api/orders/:id/stream`
Opens a Server-Sent Events stream. Emits the current status every 2 seconds until `delivered`.

**Event format**
```json
{ "status": "preparing", "updatedAt": 1717430000000 }
```

---

## Order Status Flow

```
received → preparing → out_for_delivery → delivered
  (0s)       (6s)           (16s)            (28s)
```

Status advances automatically via `setTimeout` on the server after order creation. The SSE stream on the tracking page picks up each change within 2 seconds.

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm

### Installation

```bash
git clone https://github.com/your-username/sprig.git
cd sprig
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:3000`

### Tests

```bash
npm run test
```

### Production Build

```bash
npm run build
npm start
```

---

## Design Decisions

**In-memory storage over a database**
The assessment permits in-memory storage. The data layer is abstracted behind a repository pattern (`src/lib/store.ts`) making it trivially swappable for Prisma + PostgreSQL in production without touching any API route logic.

**Node.js global for the store**
Next.js dev server runs API routes in separate workers. A plain `Map` would be lost between the worker that writes the order and the worker that reads it. Attaching the Map to `global` ensures a single shared instance across all workers in development. In production on Vercel, stateless serverless functions would require a proper database — the abstraction layer makes this a one-file change.

**Server-Sent Events over WebSockets**
SSE is unidirectional (server → client), which is all order tracking requires. It works natively with the Next.js App Router streaming response model, requires no additional packages, and reconnects automatically on the client.

**React Context over a state library**
Cart state is simple, co-located, and does not need cross-cutting concerns like middleware or devtools. Context + `useReducer`-style callbacks keeps the bundle minimal and the data flow explicit.

**`React.use()` for dynamic params**
Next.js 15 changed `params` in client page components to a Promise. The tracking page uses `React.use(params)` to unwrap it synchronously within the render, which is the correct pattern for client components in the App Router.

---

## How AI Was Used

Claude (Anthropic) was used throughout the development process:

- **Architecture planning** — Breaking the requirements into phases (scaffold → API → real-time → UI → tests → deploy) and identifying design tradeoffs upfront
- **Code generation** — Generating complete, production-ready files for each layer with correct TypeScript types
- **Debugging** — Diagnosing the `params` Promise issue in Next.js 15, the cross-worker in-memory store problem, and the input focus loss from defining components inside render
- **Design translation** — Converting a working React prototype (with custom CSS) into a Tailwind-based Next.js component architecture while preserving the visual design system
- **Test writing** — Structuring Vitest unit tests to cover CRUD operations, status sequencing, and edge cases without requiring the Next.js runtime

---

## Known Limitations

- In-memory store resets on server restart — intended for demo purposes
- No authentication or user sessions
- No payment integration
- UI component tests (MenuCard, CartDrawer) are noted as a gap — API and store logic is fully tested

---

## Deployment

This app is designed for one-command deployment to Vercel.

```bash
npx vercel
```

Set no environment variables — the app runs entirely on in-memory state.

---

## License

MIT# Sprig — Food Delivery Order Management

A full-stack order management feature for a food delivery app built with Next.js 15 (App Router), Tailwind CSS, and TypeScript. Users can browse a menu, add items to a cart, place orders with delivery details, and track order status in real time via Server-Sent Events.

---

## Live Demo

> Hosted on Vercel: _[add your URL here after deployment]_

---

## Features

- **Menu Display** — Grid of food items organised by category with images, descriptions, tags, calories, and prices
- **Search** — Live filtering across item names, descriptions, and tags
- **Cart** — Slide-out drawer with quantity controls, subtotal, delivery fee, and tax calculation
- **Checkout** — Delivery details form with client-side validation (name, phone, address)
- **Order Placement** — POST to REST API with full server-side validation
- **Real-Time Order Tracking** — Status stepper powered by Server-Sent Events (SSE); status advances automatically: Received → Preparing → Out for Delivery → Delivered
- **TDD** — Vitest unit tests covering order store CRUD, status sequencing, and edge cases

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Fonts | Playfair Display (display), Inter (body) — Google Fonts via next/font |
| Data Storage | In-memory (Node.js global Map, survives hot reload) |
| Real-Time | Server-Sent Events (SSE) |
| Testing | Vitest + Testing Library |
| Deployment | Vercel |

---

## Project Structure

```
src/
  app/
    api/
      menu/route.ts               # GET  /api/menu
      orders/route.ts             # POST /api/orders
      orders/[id]/route.ts        # GET  /api/orders/:id  |  PATCH (advance status)
      orders/[id]/stream/route.ts # GET  /api/orders/:id/stream  (SSE)
    page.tsx                      # Menu + cart
    checkout/page.tsx             # Checkout form
    orders/[id]/page.tsx          # Order tracking
    layout.tsx                    # Root layout with CartProvider
  components/
    Header.tsx                    # Sticky nav with cart button
    MenuGrid.tsx                  # Search + category sections
    MenuCard.tsx                  # Individual item card
    CartDrawer.tsx                # Slide-out cart
    StatusStepper.tsx             # Vertical order status stepper
  context/
    CartContext.tsx                # Global cart state (React Context)
  lib/
    data.ts                       # Menu items + categories + helpers
    store.ts                      # In-memory order store (global Map)
    types.ts                      # Shared TypeScript types
  __tests__/
    setup.ts                      # Vitest + Testing Library setup
    orders.test.ts                # Order store unit tests
```

---

## API Reference

### `GET /api/menu`
Returns all menu categories and items.

**Response**
```json
{
  "categories": [...],
  "items": [...]
}
```

---

### `POST /api/orders`
Places a new order.

**Request body**
```json
{
  "items": { "b1": 2, "j1": 1 },
  "delivery": {
    "name": "Alex Green",
    "phone": "5551234567",
    "address": "21 Elm Street",
    "city": "Portland",
    "zip": "97201",
    "notes": "Leave at door"
  }
}
```

**Response `201`**
```json
{
  "order": {
    "id": "7842",
    "status": "received",
    "total": 38.16,
    ...
  }
}
```

**Response `422`** — validation failure
```json
{
  "errors": ["name is required", "phone must have at least 7 digits"]
}
```

---

### `GET /api/orders/:id`
Returns a single order by ID.

---

### `PATCH /api/orders/:id`
Manually advances the order status by one step. Useful for testing.

---

### `GET /api/orders/:id/stream`
Opens a Server-Sent Events stream. Emits the current status every 2 seconds until `delivered`.

**Event format**
```json
{ "status": "preparing", "updatedAt": 1717430000000 }
```

---

## Order Status Flow

```
received → preparing → out_for_delivery → delivered
  (0s)       (6s)           (16s)            (28s)
```

Status advances automatically via `setTimeout` on the server after order creation. The SSE stream on the tracking page picks up each change within 2 seconds.

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm

### Installation

```bash
git clone https://github.com/your-username/sprig.git
cd sprig
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:3000`

### Tests

```bash
npm run test
```

### Production Build

```bash
npm run build
npm start
```

---

## Design Decisions

**In-memory storage over a database**
The assessment permits in-memory storage. The data layer is abstracted behind a repository pattern (`src/lib/store.ts`) making it trivially swappable for Prisma + PostgreSQL in production without touching any API route logic.

**Node.js global for the store**
Next.js dev server runs API routes in separate workers. A plain `Map` would be lost between the worker that writes the order and the worker that reads it. Attaching the Map to `global` ensures a single shared instance across all workers in development. In production on Vercel, stateless serverless functions would require a proper database — the abstraction layer makes this a one-file change.

**Server-Sent Events over WebSockets**
SSE is unidirectional (server → client), which is all order tracking requires. It works natively with the Next.js App Router streaming response model, requires no additional packages, and reconnects automatically on the client.

**React Context over a state library**
Cart state is simple, co-located, and does not need cross-cutting concerns like middleware or devtools. Context + `useReducer`-style callbacks keeps the bundle minimal and the data flow explicit.

**`React.use()` for dynamic params**
Next.js 15 changed `params` in client page components to a Promise. The tracking page uses `React.use(params)` to unwrap it synchronously within the render, which is the correct pattern for client components in the App Router.

---

## How AI Was Used

Claude (Anthropic) was used throughout the development process:

- **Architecture planning** — Breaking the requirements into phases (scaffold → API → real-time → UI → tests → deploy) and identifying design tradeoffs upfront
- **Code generation** — Generating complete, production-ready files for each layer with correct TypeScript types
- **Debugging** — Diagnosing the `params` Promise issue in Next.js 15, the cross-worker in-memory store problem, and the input focus loss from defining components inside render
- **Design translation** — Converting a working React prototype (with custom CSS) into a Tailwind-based Next.js component architecture while preserving the visual design system
- **Test writing** — Structuring Vitest unit tests to cover CRUD operations, status sequencing, and edge cases without requiring the Next.js runtime

---

## Known Limitations

- In-memory store resets on server restart — intended for demo purposes
- No authentication or user sessions
- No payment integration
- UI component tests (MenuCard, CartDrawer) are noted as a gap — API and store logic is fully tested

---

## Deployment

This app is designed for one-command deployment to Vercel.

```bash
npx vercel
```

Set no environment variables — the app runs entirely on in-memory state.

---

## License

MIT
