# Booking Jharkhand — Premium Travel Marketplace

**Status:** Phase 1 (MVP) — Active Development  
**Version:** 1.1.0  
**Author:** Chiti Technologies  
**Repository:** `github.com/prabhakarmdes12-cmyk/booking-jharkhand`

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture](#2-architecture)
3. [Tech Stack](#3-tech-stack)
4. [Project Structure](#4-project-structure)
5. [Getting Started](#5-getting-started)
6. [Build & Deployment](#6-build--deployment)
7. [Features](#7-features)
8. [API Integration](#8-api-integration)
9. [SEO & Structured Data](#9-seo--structured-data)
10. [Internationalisation (i18n)](#10-internationalisation-i18n)
11. [Roadmap](#11-roadmap)

---

## 1. Overview

Booking Jharkhand is a digital tourism marketplace connecting travellers with verified hotels, cabs, restaurants, and curated travel packages across the 24 districts of Jharkhand. The platform is built as a **static frontend** served via Vite MPA, with dynamic data sourced from the **Chiti Console** operations backend.

### Vision

Become the official digital gateway for Jharkhand tourism — enabling travellers to discover, plan, and book while empowering 600+ local tourism businesses to grow.

### Key Differentiators

- **Verified vendors** — All properties go through an admin approval workflow with document verification
- **Bilingual interface** — Full English/Hindi support via runtime i18n engine
- **GEO-optimised** — 11 JSON-LD schemas for Google SGE, Perplexity, Bing Copilot
- **Chiti Console integration** — Unified operations backend for enquiries, vendors, listings, and analytics
- **AI trip planner** — Personalised itinerary generation for Jharkhand destinations

---

## 2. Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                         Browser (User)                                │
│                                                                      │
│   ┌────────────────────────────────────────────────────────────┐     │
│   │                Static Frontend (Vite MPA)                   │     │
│   │                                                             │     │
│   │  18 HTML Pages ← Tailwind CSS ← GSAP + Lenis               │     │
│   │         ↓                        ↑                          │     │
│   │   i18n.js (runtime)        seo.js (runtime)                 │     │
│   │         ↓                        ↑                          │     │
│   │   api.js ─────► Chiti Console API (REST)                    │     │
│   └────────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│                     Chiti Console (Backend)                           │
│                                                                      │
│  ┌──────────┐  ┌──────────┐  ┌─────────┐  ┌───────────┐            │
│  │ Vendors  │  │Enquiries │  │Listings │  │  Users    │            │
│  │ Module   │  │  Module  │  │ Module  │  │  Module   │            │
│  └──────────┘  └──────────┘  └─────────┘  └───────────┘            │
│  ┌──────────┐  ┌──────────┐  ┌─────────┐  ┌───────────┐            │
│  │Promotions│  │  Blog    │  │Analytics│  │ Support   │            │
│  │ Module   │  │  Module  │  │ Module  │  │ Tickets   │            │
│  └──────────┘  └──────────┘  └─────────┘  └───────────┘            │
│                                                                      │
│  Integrations: WhatsApp API · Email (SMTP) · Google OAuth           │
└──────────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Customer-facing pages** are static HTML served by Vite. No server-side rendering.
2. **Runtime JS** (`api.js`) fetches dynamic data from Chiti Console API on page load.
3. **Form submissions** (vendor registration, contact, booking enquiries) POST to Chiti Console API.
4. **Structured data** (`seo.js`) injects JSON-LD schemas at runtime based on current URL path.
5. **i18n** (`i18n.js`) swaps text content between English and Hindi without page reload.

---

## 3. Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Build Tool** | Vite 8 | MPA bundler, auto-discovers HTML entry points |
| **CSS** | Tailwind CSS 3 (CDN) | Utility-first styling with custom design tokens |
| **Animation** | GSAP 3 + Lenis | Page transitions, smooth scroll, scroll-triggered reveals |
| **Cursor** | Custom magnetic cursor | Interactive hover effects on CTAs and cards |
| **Icons** | Material Symbols | Consistent iconography across 18 pages |
| **Fonts** | Inter · Montserrat · Outfit · Cormorant Garamond | Typography system (display, headline, body, label) |
| **i18n** | Custom runtime (`i18n.js`) | English ↔ Hindi toggle, `[data-i18n]` attribute binding |
| **SEO** | Custom runtime (`seo.js`) | 11 inline JSON-LD schemas, per-page structured data |
| **API Layer** | Custom (`api.js`) | JWT auth, vendor CRUD, enquiry inbox, dashboard |
| **Chat** | Custom widget (`chat-widget.js`) | Floating WhatsApp FAB with greeting + question form |

---

## 4. Project Structure

```
booking-jharkhand/
├── demo/                          # Vite root (MPA source)
│   ├── public/                    # Static assets (copied as-is to dist)
│   │   ├── api.js                 # Chiti Console API service
│   │   ├── i18n.js                # Bilingual dictionary (EN/HI)
│   │   ├── seo.js                 # JSON-LD structured data injector
│   │   ├── chat-widget.js         # WhatsApp chat FAB widget
│   │   ├── robots.txt             # Crawl directives
│   │   └── sitemap.xml            # 14-URL sitemap with hreflang
│   ├── index.html                 # Home (hero video, search overlay)
│   ├── destinations.html          # 24-district destination guide
│   ├── hotels.html                # Hotel card listings
│   ├── cab-booking.html           # Cab booking form + fleet
│   ├── restaurants.html           # Restaurant directory
│   ├── packages.html              # Travel package cards
│   ├── netarhat.html              # Destination deep-dive
│   ├── hotel-netarhat.html        # Property detail page
│   ├── blog.html                  # Travel articles
│   ├── faq.html                   # FAQ with structured data
│   ├── about.html                 # About + team
│   ├── contact.html               # Contact form + details
│   ├── ai-planner.html            # AI trip planner interface
│   ├── vendor-onboarding.html     # Multi-step vendor registration
│   ├── admin.html                 # Operations dashboard
│   ├── hotel-dashboard.html       # Vendor portal (hotel)
│   ├── cab-dashboard.html         # Vendor portal (cab)
│   ├── restaurant-portal.html     # Vendor portal (restaurant)
│   ├── main.js                    # GSAP + Lenis + cursor init
│   ├── style.css                  # Global styles + fonts
│   ├── logo.png                   # Brand logo
│   ├── favicon.png                # Brand favicon
│   ├── hero3.mp4                  # Background video
│   └── *.jpg / *.jpeg             # Destination imagery
├── docs/
│   ├── PRD.md                     # Product Requirements Document
│   └── integration-plan.md        # Chiti Console screen specs + API
├── vite.config.js                 # Vite MPA configuration
├── package.json                   # Dependencies + scripts
├── .gitignore
└── README.md                      # This file
```

### Page Categorisation

| Category | Pages | Auth Required |
|---|---|---|
| **Customer-facing** | index, destinations, hotels, cab-booking, restaurants, packages, netarhat, hotel-netarhat, blog, faq, about, contact, ai-planner | No |
| **Vendor-facing** | vendor-onboarding, hotel-dashboard, cab-dashboard, restaurant-portal | Yes (vendor role) |
| **Admin** | admin | Yes (admin role) |

---

## 5. Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# → Opens Vite dev server at http://localhost:5173
# → All 18 pages auto-discovered as MPA entry points
```

### Build

```bash
npm run build
# → Outputs to dist/
# → Static HTML + bundled assets (JS, CSS, images, video)
```

### Preview Production Build

```bash
npx vite preview
# → Serves dist/ at http://localhost:4173
```

---

## 6. Build & Deployment

### Build Pipeline

```
Source (demo/)  ──►  Vite Build  ──►  dist/
├── HTML files          │                ├── *.html (processed)
├── public/             │                ├── *.js (copied as-is)
│   ├── api.js          │                ├── robots.txt
│   ├── i18n.js         │                └── sitemap.xml
│   ├── seo.js          │
│   └── chat-widget.js  │
├── main.js             │                ├── assets/index-*.js (bundled)
├── style.css           │                ├── assets/index-*.css
├── logo.png            │                └── assets/ (images, video)
└── hero3.mp4           │
```

**Key configuration** (`vite.config.js`):

```js
root: './demo',           // Source directory
appType: 'mpa',           // Multi-page application mode
build.outDir: '../dist',  // Output to project root
build.rollupOptions.input: auto-discovered from demo/*.html
```

**Public directory**: Files in `demo/public/` are copied verbatim to `dist/`. This is where non-bundled assets like `seo.js`, `i18n.js`, `api.js`, `robots.txt`, and `sitemap.xml` live.

### Deployment Targets

| Platform | Config | Notes |
|---|---|---|
| **Vercel** | Zero-config | Set root to `demo/`, output to `dist/` |
| **Netlify** | `publish: dist/` | Add redirect rule for SPA fallback |
| **Cloudflare Pages** | `build: npm run build` | Output dir: `dist/` |

---

## 7. Features

### 7.1 Brand & Navigation

- **Brand:** Booking Jharkhand (changed from "Discover Jharkhand")
- **Logo:** `logo.png` (h-12 mobile, h-14 desktop)
- **Nav:** Full-width with 20 px horizontal padding, no `max-w-7xl` constraint
- **Hero badge:** "🙏 जय जोहार"
- **Footer:** "Built with ❤️ by Chiti Technologies" linking to `chiti.tech/en`

### 7.2 Hero Section

- **Video background:** `hero3.mp4` (6.7 MB, MP4)
- **Overlay:** Dark gradient + "Plan Your Journey" search bar
- **Animation:** GSAP clip-path page transitions on route change

### 7.3 Vendor Onboarding

- Multi-step form with 3 steps (Basic Info → Address/Photos → Documents)
- i18n registration for all labels, placeholders, and validation
- Form submission via `API.vendors.register()` → Chiti Console
- File upload for property photos, GST certificate, and license documents
- Auto-generated success message: "Application received! Our team will review within 48 hours."

### 7.4 Chat Widget

- Floating action button (60 px, WhatsApp green) at bottom-right
- Popup with greeting message, name input, and question textarea
- Sends pre-formatted WhatsApp message: `Hi! I'm [Name]. [Question]`
- Unified phone number: `+91 9972934937`
- Present on all 14 customer-facing pages

### 7.5 AI Trip Planner (`ai-planner.html`)

- Form-based itinerary builder with destination, duration, budget, and interest inputs
- Generates personalised day-wise itinerary
- WhatsApp confirmation button to share the plan

---

## 8. API Integration

The `api.js` service (`demo/public/api.js`) provides a unified interface to the Chiti Console backend.

### Base URL

```
https://chiti-console.vercel.app/api
```

### Authentication

JWT-based. Token stored in `localStorage` under `bj_auth_token`.

```js
API.auth.login(email, password)       // → { token, user }
API.auth.register(userData)           // → user
API.auth.logout()                     // clears localStorage
API.auth.isAuthenticated()            // → boolean
```

### Modules

| Module | Key Methods | Description |
|---|---|---|
| `auth` | `login`, `register`, `logout` | Authentication |
| `vendors` | `list`, `getById`, `create`, `update`, `approve`, `reject`, `suspend`, `register` | Vendor management |
| `enquiries` | `list`, `getById`, `create`, `updateStatus`, `assign`, `addNote`, `sendMessage` | Enquiry inbox |
| `listings` | `list`, `getById`, `create`, `update`, `delete` | Content management |
| `users` | `list`, `getById`, `updateRole`, `updateStatus` | User administration |
| `blog` | `list`, `getById`, `create`, `update`, `delete` | Blog management |
| `promotions` | `list`, `getById`, `create`, `update` | Discount engine |
| `dashboard` | `stats`, `reports` | Analytics |
| `contact` | `submit` | Contact form |

### Error Handling

All methods return Promises. On API failure, methods fall back to built-in mock data for development/demo scenarios. Errors include `message` and `status` properties.

---

## 9. SEO & Structured Data

The `seo.js` module injects JSON-LD schemas at runtime for maximum search engine and AI discoverability.

### Schemas Injected

| Schema | Pages | Purpose |
|---|---|---|
| `Organization` + `TravelAgency` + `LocalBusiness` | All | Entity recognition, knowledge panel |
| `WebSite` with `SpeakableSpecification` | Home | Voice search, AI assistant pickup |
| `TouristDestination` + `Place` | Netarhat | GEO-specific entity |
| `Hotel` + `LodgingBusiness` | Hotel Netarhat | Property schema with `aggregateRating` |
| `FAQPage` | FAQ | SERP rich results |
| `Service` + `OfferCatalog` | Cab Booking | Service type schema |
| `BreadcrumbList` | All | Navigation breadcrumbs |
| `CollectionPage` + `ItemList` | Destinations, Hotels, Packages | Content catalog |
| `ContactPage` | Contact | Contact entity |
| `AboutPage` | About | About entity |
| `SearchAction` | All | Sitelinks search box |

### GEO Optimisation Features

- **GeoCoordinates** on Netarhat (23.4755, 84.2653) and Netarhat Forest Retreat
- **SameAs links:** Instagram, Facebook, X, LinkedIn, Wikipedia, Wikidata, WhatsApp, Jharkhand Tourism
- **SpeakableSpecification** on home (`.hero-title`, `h1`, `.page-heading`) and FAQ (`.faq-question`, `.faq-answer`)
- **hasOfferCatalog** with 4 service categories
- **makesOffer** with typed offers for each service
- **BookAction** interaction statistic
- **24-district areaServed** with `City` typed entries
- **Bilingual** `inLanguage: ['en', 'hi']`
- **Multiple ContactPoints** with `OpeningHoursSpecification`

### Technical SEO

- **Canonical URLs** on all pages
- **hreflang** alternate tags (en, hi, x-default)
- **robots.txt** blocking admin/dashboard pages
- **sitemap.xml** with 14 URLs, priorities, and changefreq
- **noindex** on admin, hotel-dashboard, cab-dashboard, restaurant-portal
- **Per-page meta descriptions** with unique keywords

---

## 10. Internationalisation (i18n)

The `i18n.js` runtime engine provides on-the-fly translation between English and Hindi without page reload.

### How It Works

1. A global dictionary object maps keys to `{ en: "...", hi: "..." }` strings
2. The `applyLang()` function walks all `[data-i18n]` elements and replaces their text content, placeholder, title, alt, or value
3. Language preference is persisted in `localStorage` under the `lang` key
4. A toggle button calls `toggleLang()` which flips the language and reapplies

### Usage

```html
<label class="..." data-i18n="business_name_label">Business Name *</label>
<input type="text" data-i18n-placeholder="business_name_placeholder" placeholder="e.g. The Orchid Forest Lodge">
```

### Supported Elements

- **Text content** (`data-i18n`) — innerText
- **Placeholder** (`data-i18n-placeholder`) — input placeholder
- **Title** (`data-i18n-title`) — element title
- **Alt** (`data-i18n-alt`) — image alt text
- **Value** (`data-i18n-value`) — button/input value

### Dictionary Size

~140 keys covering navigation, hero, forms, labels, buttons, errors, and footer text across all 18 pages.

---

## 11. Roadmap

### Phase 1 — Foundation (Current) ✓

- [x] 18-page static frontend with MPA architecture
- [x] Brand identity (logo, favicon, colour system, typography)
- [x] Bilingual English/Hindi interface
- [x] GSAP page transitions + Lenis smooth scroll
- [x] Magnetic cursor with interactive effects
- [x] SEO with 11 JSON-LD schemas + sitemap + robots.txt
- [x] Chiti Console API service layer (`api.js`)
- [x] Admin dashboard with live vendor and enquiry data
- [x] Vendor onboarding form with API submission
- [x] Unified WhatsApp chat widget
- [x] All dummy text replaced with real Jharkhand-specific content
- [x] Local image assets (temple photos, brand logo, favicon)
- [x] GitHub repository with full commit history

### Phase 2 — Chiti Console Integration (In Progress)

- [ ] Chiti Console project setup (Next.js + Tailwind + PostgreSQL)
- [ ] Database schema (vendors, listings, enquiries, users, promotions)
- [ ] Vendor management screens (list, detail, approve/reject)
- [ ] Enquiry inbox (list, detail, conversation thread)
- [ ] Listing manager (CRUD for hotels, cabs, restaurants, packages)
- [ ] Authentication & role-based access
- [ ] API endpoints for frontend integration

### Phase 3 — Growth

- [ ] Customer accounts (sign-up, login, my bookings)
- [ ] Vendor portal (limited access dashboard)
- [ ] Discount/promo engine
- [ ] WhatsApp/email notifications
- [ ] Analytics dashboard
- [ ] Blog manager
- [ ] Load testing & optimisation

---

## License

Proprietary — Chiti Technologies. All rights reserved.

---

*Document maintained by Chiti Technologies. Last updated: June 2026.*
