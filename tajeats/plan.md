# TajEats Delivery Platform Plan

## Vision
Build a production-grade Lieferando/UberEats-style platform covering consumers, restaurants, riders, and admins with reliable ordering, payments, delivery tracking, and insights.

## Current Snapshot (from repo)
- Backend: Spring Boot 3.5, Postgres, JPA; entities for restaurants/dishes/orders/reviews/cart items; local image uploads; basic REST controllers; CORS/web config; properties for local Postgres.
- Frontend: React + TS + Vite + Tailwind + shadcn; contexts for data/cart/auth (mock); pages for listings, restaurant detail, cart/checkout/status, admin and restaurant dashboards; service layer for APIs; image upload UI.
- DevOps: start-all.bat for local; no env separation; no CI/CD; no observability; uploads stored locally.
- Gaps: auth/roles, payments, delivery/rider flows, notifications, real-time order status, analytics, test coverage, production infra, security hardening, performance, mobile/PWA polish.

## Target Architecture (high level)
- API: Spring Boot REST + WebSocket/SSE for live order status; JWT auth; role-based access (admin, restaurant, customer, rider);
- Data: Postgres primary; Redis for cache/session/rate limit; object storage (S3/MinIO/Azure Blob) for media; Flyway migrations.
- Integrations: Payment provider (Stripe/Adyen), email/SMS/push, mapping/geocoding (OSM/Google) for ETA and routing, webhook receiver for payment events.
- Frontend: React SPA/PWA with offline cart, responsive UI, guarded routes by role, optimistic updates, analytics events; potential mobile shell via Capacitor/React Native later.
- Observability: structured logs + tracing (OpenTelemetry), metrics (Micrometer/Prometheus), uptime/alerting.
- Delivery stack: order state machine, rider assignment, tracking via location pings (future), pricing/fees configuration.

## Phased Roadmap
### Phase 0 – Stabilize & Baseline (1-2 weeks)
- Make app run locally reliably: fix mvn run error, align ports, sample data seed, start scripts (docker-compose for Postgres/Redis/MinIO).
- Add Flyway and migrate existing schema; enforce env-specific configs (dev/stage/prod via profiles + .env).
- Harden controllers/services with validation, DTO mapping, error handling, pagination, sorting, filtering.
- Add basic tests (unit + slice + a few e2e via Playwright/Cypress) and lint/format hooks.

### Phase 1 – Core Product (2-3 weeks)
- AuthN/Z: email+password signup/login, JWT access/refresh, password reset, role model (admin/restaurant/customer/rider), route guards; hash passwords, add auth middleware, CSRF protections for cookies if used.
- Restaurant/menu mgmt: CRUD with status flags, schedule, categories/tags, search/sort; dish options/add-ons; availability windows.
- Cart/checkout: server-side cart persistence by session/user; fees/tax calculation; address capture with validation; delivery vs pickup mode.
- Orders: create order from cart, state machine (NEW → CONFIRMED → PREPARING → READY → PICKED_UP → DELIVERED/CANCELLED), timestamps, audit log; stock/availability checks.
- Payments: integrate Stripe test mode; intents creation, webhooks, refund/void path; store payment status on order.
- Media: move images to object storage; signed URLs; image resizing pipeline.
- Admin Portal: manage restaurants, users, orders, payouts flags.
- Restaurant Portal: manage menu, hours, incoming orders, mark ready, request rider.
- Customer App: improved landing, restaurant discovery, detail, cart, checkout, order status with live updates.

### Phase 2 – Delivery & Realtime (2-3 weeks)
- Live order updates via WebSocket/SSE; optimistic UI transitions.
- Rider domain: rider profile/onboarding, availability toggle, device token; assignment workflow (manual first, later auto); simple dispatch rules; rider actions (accept, pickup, deliver, cancel reason).
- Location & ETA: store coordinates on address; basic ETA computation using Google/OSM distance matrix; map rendering on order status page.
- Notifications: email + push + in-app toasts for key events (order confirmed, ready, picked up, delivered, payment failed).

### Phase 3 – Reliability, Scale, Growth (3-4 weeks)
- Observability: OpenTelemetry tracing, structured JSON logs, Prometheus metrics + Grafana dashboards; log correlation IDs; audit trails.
- Performance: caching for read-heavy endpoints (restaurants, menus), CDN for images, GZIP/Brotli, query tuning, pagination defaults, rate limits.
- Security: input validation, helmet/cors tightening, secret management (Vault/KeyVault/SSM), dependency scanning, SAST, DAST, content security policy, file type/size guards, abuse protections (rate limit, captcha for auth).
- Data/Analytics: events pipeline (frontend → backend) into ClickHouse/BigQuery/Redshift; core product metrics (conversion, AOV, retention), ops metrics (prep time, delivery time), restaurant scorecards.
- CI/CD: GitHub Actions with build/test/lint, Docker images, push to registry, deploy to staging/prod; infra as code (Terraform/Bicep) for DB, cache, storage, CDN, compute.
- Mobile/PWA: PWA installability, offline cart, push permissions, add-to-home-screen banners; later explore React Native wrapper.

## Workstreams & Key Tasks
- Backend
  - Add Flyway; normalize entities (enums for status, monetary values as integer cents); DTO validation (Bean Validation); error model; global exception handler.
  - Auth: Spring Security + JWT, refresh tokens, role guards; password reset tokens; email sending; rate limits.
  - Payments: Stripe integration, webhook controller, signature verification, payment intents on checkout.
  - Orders: state machine service, idempotency keys, order history, item options/add-ons, taxes/fees config.
  - Delivery: rider model, assignment service, status transitions, location updates (simplified), ETA service.
  - Media: switch to S3/MinIO storage adapter; thumbnailing; signed URL exposure.
  - Integrations: email/SMS provider abstraction; geo service abstraction.
  - Testing: unit + slice (controller/service/repo), contract tests for APIs, wiremock for webhooks, testcontainers for DB.

- Frontend
  - State: replace mock auth with real session tokens; refresh handling; protected routes by role.
  - UI: flows for signup/login/reset, restaurant/owner dashboards, admin controls, rider app (MVP), order tracking with live timeline and map; improved cart/checkout with address + payment widget; toasts for errors.
  - Data fetching: react-query or SWR for caching; optimistic updates; skeleton/loading states; error boundaries.
  - PWA: service worker for offline shell, prefetch menus, background sync for carts; push notifications integration.
  - Testing: component tests (Vitest/RTL), e2e (Playwright/Cypress) covering happy paths and payments.

- DevOps/Infra
  - docker-compose: Postgres, Redis, MinIO, mailhog, stripe-mock; backend/frontend services; seed data.
  - CI: lint + tests + build artifacts; security scans (Snyk/Dependabot); container build; push to registry.
  - CD: staging deploy (e.g., Fly.io/Render/K8s/VM); prod later; blue/green or rolling; DB migrations on deploy.
  - Observability: set up OTel collector, Prometheus/Grafana, Loki/ELK; alerts for error rate, latency, payment failure, order stuck in state.

- Data & Analytics
  - Define events (page views, add-to-cart, checkout start, payment success/fail, order state changes, rider actions).
  - Pipeline: frontend → backend ingestion → queue (Kafka/Redpanda) → warehouse; dashboards for product/ops.
  - Experiments: feature flags and A/B testing framework.

- Security & Compliance
  - Secrets management, TLS everywhere, OWASP ASVS checklist, dependency updates, backup/restore runbooks, access controls for admin tools, audit logging.

## Open Decisions
- Cloud target (AWS/Azure/GCP) and compute model (K8s vs containers on ECS/App Service/Fly.io).
- Payment provider choice (Stripe default) and supported methods (cards, Apple/Google Pay, Klarna/Sofort for EU).
- Mapping provider (Google Maps vs OSM + Mapbox/MapTiler) and cost limits.
- Notification channels (email-only vs SMS vs push) for MVP.
- Rider tracking sophistication (manual status vs GPS streaming).

## Metrics to Track Early
- Conversion funnel: visit → view restaurant → add to cart → checkout → pay success.
- Ops: time to confirm, prep time, delivery time, cancellation rate.
- Reliability: error rate, p95 latency, websocket disconnects, payment webhook failures.
- Growth: retention (week N), AOV, repeat rate, restaurant activation, rider availability.

## Initial 2-Week Action Plan (suggested)
1) Fix local build/run: investigate mvn run failure, add docker-compose (Postgres/Redis/MinIO), align ports, seed data script.
2) Add Flyway; lock schema; introduce enums for order status; add validation + error handler.
3) Implement JWT auth (login/signup/refresh) and wire frontend AuthContext + protected routes.
4) Implement cart persistence + checkout endpoint creating orders; client consumes it; add order state machine.
5) Integrate Stripe test mode: payment intent creation + webhook; frontend payment widget stub (Stripe Elements).
6) Introduce WebSocket/SSE for order status; show live updates on OrderStatus page.
7) Add basic CI (GitHub Actions): lint/test/build for UI/BE.

## Definition of Done for “MVP Clone”
- User can sign up/login, browse restaurants/menus, add to cart, checkout with real payment (test mode), see live order tracking, receive notifications; admins/restaurants manage menus/orders; riders can accept and complete deliveries; system observable and deployable to staging.
