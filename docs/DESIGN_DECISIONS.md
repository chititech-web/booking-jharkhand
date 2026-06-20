# Design Decisions & Technical Journal — Booking Jharkhand

**Author:** Chiti Technologies  
**Last Updated:** June 2026  
**Status:** Living Document

---

## Table of Contents

1. [Architecture & Build](#1-architecture--build)
2. [Frontend Framework](#2-frontend-framework)
3. [Styling & Design System](#3-styling--design-system)
4. [Animations & Interaction](#4-animations--interaction)
5. [Internationalisation](#5-internationalisation)
6. [SEO & Structured Data](#6-seo--structured-data)
7. [API Layer & Backend Integration](#7-api-layer--backend-integration)
8. [Asset Management](#8-asset-management)
9. [Chat Widget](#9-chat-widget)
10. [Brand Identity](#10-brand-identity)
11. [Performance Considerations](#11-performance-considerations)
12. [Security Considerations](#12-security-considerations)
13. [Trade-offs & Regrets](#13-trade-offs--regrets)

---

## 1. Architecture & Build

### Decision: Static MPA over SPA (React/Next.js)

**Context:** The platform is an 18-page content-heavy site. It needs to be fast to develop, trivially deployable, and crawlable.

**Chosen approach:** Vite Multi-Page Application (MPA) mode.

**Rationale:**
- Vite MPA treats each `.html` file as a separate entry point, producing individual HTML files in `dist/`. This is inherently SEO-friendly — every page has its own URL, meta tags, and content without client-side hydration.
- No JavaScript framework overhead. Pages load instantly — HTML parses, CSS renders, then JS progressively enhances.
- Development velocity: editing an HTML file + saving = instant HMR. No routing config, no state management, no build-time SSR complexity.
- Migration path to a framework is straightforward: each page can be converted independently.

**Alternatives considered:**
- **Next.js SSR:** Overkill for a content site. Would require a Node.js server, build-time data fetching, and SSR configuration. The static approach achieves the same SEO result with zero server cost.
- **Single-page React app:** Poor SEO without prerendering. Would need `react-helmet` for meta tags, `react-router` for routing, and a prerendering service (or SSR) for crawlers. Adds complexity without proportional benefit.
- **Plain HTML + jQuery:** No build step, but no asset hashing, CSS bundling, or module system. Vite provides these without framework lock-in.

**Trade-off:** No shared component system. The same header/footer HTML is duplicated across 18 pages. Mitigated by using Vite's `transformIndexHtml` hook (future plan) to inject shared fragments, and by maintaining consistent copy-paste conventions.

### Decision: `public/` directory for runtime JS

**Context:** `seo.js`, `i18n.js`, and `api.js` are loaded as regular `<script>` tags (not ES modules). Vite needs to copy them to the build output without transformation.

**Resolution:** Placed in `demo/public/`. Vite copies `public/` contents verbatim to `dist/`. These files retain their original names (no content hash), which is intentional — they are referenced by static `<script src="/seo.js">` tags in every HTML file.

**Why not bundle them?**
- `seo.js` and `i18n.js` need to execute synchronously in the global scope before the page renders. Bundling would defer them.
- `api.js` is loaded via plain `<script>` to avoid Vite's module bundling warnings and to ensure it works as a global singleton.

---

## 2. Frontend Framework

### Decision: Zero framework, vanilla JS progressive enhancement

**Context:** The site must work without JavaScript (core content visible), then enhance with JS for interactivity.

**Implementation:**
- All content is server-rendered (static HTML). JS adds smooth scroll, page transitions, cursor effects, and dynamic data.
- `main.js` initialises Lenis (smooth scroll), GSAP (animations), and the magnetic cursor. It uses a `DOMContentLoaded` event.
- Page-specific interactivity (form validation, step navigation, FAQ accordions) is inlined in `<script>` tags per page.

**Rationale:**
- Content-first approach ensures search engines see all text, images, and links without executing JS.
- GSAP + Lenis provides production-grade smooth scroll with native scroll position preservation. Browser back/forward buttons work correctly.
- Magnetic cursor is a pure-CSS/JS enhancement. It degrades gracefully on touch devices (detected via `'ontouchstart' in window`).

### Decision: ES modules for main.js, plain scripts for helpers

**Context:** `main.js` uses `import` for GSAP and Lenis. `seo.js`, `i18n.js`, `api.js` use global scope.

**Rationale:**
- `main.js` benefits from tree-shaking and module resolution via Vite.
- The helper scripts cannot use `type="module"` because they manipulate DOM synchronously and must be available globally. `i18n.js` defines `toggleLang()` and `applyLang()`, which are called from inline `onclick` handlers in HTML.
- Vite correctly warns "can't be bundled without type='module'" but treats these as external scripts, copying them to the build output. This is expected and correct behaviour.

---

## 3. Styling & Design System

### Decision: Tailwind CSS v3 via CDN, no PostCSS config

**Context:** Tailwind CSS is used for utility-first styling. The design system is defined via `tailwind.config` in an inline `<script>` tag.

**Configuration:**
```js
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#012d1d',       // Deep forest green
        'primary-container': '#1b4332',
        'on-primary': '#ffffff',
        'primary-fixed': '#c1ecd4',
        'primary-fixed-dim': '#a5d0b9',
        secondary: '#6e5a4c',     // Warm earth
        tertiary: '#322400',      // Dark amber
        background: '#f8f9fa',
        surface: '#f8f9fa',
        outline: '#717973',
        // ... 40+ design tokens
      },
      fontFamily: {
        'display-lg': ['Montserrat'],
        'headline-xl': ['Montserrat'],
        'body-lg': ['Outfit'],
        'label-md': ['Inter'],
        'caption': ['Inter'],
      }
    }
  }
};
```

**Rationale for CDN over PostCSS:**
- Zero build configuration. No `tailwind.config.js`, no `postcss.config.js`, no `@tailwind` directives.
- Consistent with the "no framework" philosophy. Tailwind is a design tool, not a build dependency.
- The CDN version parses the config inline and generates styles dynamically. For a static site, this is fast enough (the stylesheet is cached after first load).

**Trade-off:** The CDN version generates styles at runtime rather than at build time. For production, a PostCSS build would produce a smaller CSS file. However, the difference is negligible for a site this size, and the reduced configuration complexity is worth it.

### Typography System

| Token | Font | Weight | Size | Usage |
|---|---|---|---|---|
| `display-lg` | Montserrat | 700 | 64px | Hero headings |
| `headline-xl` | Montserrat | 600 | 48px | Page titles |
| `headline-lg` | Montserrat | 600 | 32px | Section headings |
| `headline-sm` | Montserrat | 600 | 24px | Card headings |
| `body-lg` | Outfit | 400 | 18px | Body text |
| `body-md` | Outfit | 400 | 16px | Compact body |
| `label-md` | Inter | 600 | 14px | Labels, buttons, nav |
| `caption` | Inter | 500 | 12px | Metadata, timestamps |

A fifth font, **Cormorant Garamond** (serif), is loaded for `.font-serif-display` — used sparingly on hero sections and destination headers for a premium editorial feel.

### Colour System

The palette follows Material Design 3 colour roles but with custom Jharkhand-inspired values:

- **Primary (#012d1d):** Deep forest green — evokes Jharkhand's 29% forest cover
- **Secondary (#6e5a4c):** Warm earth tone — represents the Chotanagpur plateau
- **Tertiary (#322400):** Dark amber — references the state's mineral wealth
- **Surface (#f8f9fa):** Off-white with a warm tint — easier on the eyes than pure white
- **water-blue (#0077B6):** Accent for water-related content (waterfalls, lakes)

---

## 4. Animations & Interaction

### Decision: GSAP + Lenis over Framer Motion or CSS-only

**Context:** The site needs smooth, performant scroll-linked animations and page transitions.

**Why GSAP + Lenis:**
- **Lenis** provides smooth scrolling with native scroll position preservation. Unlike `scroll-behavior: smooth`, Lenis is JS-driven and can be integrated with GSAP ScrollTrigger for pinning, scrub, and progress-based animations.
- **GSAP ScrollTrigger** handles intersection-based animations (fade-in on scroll, parallax, clip-path reveals) with better performance than Intersection Observer-based libraries.
- Both libraries are framework-agnostic, lightweight (GSAP ~30 KB gzipped), and well-documented.

**Page transitions:**
- On internal navigation, a clip-path circle animation reveals the new page content.
- The hero section uses a GSAP timeline for staggered text reveals (word-by-word with `splitText` equivalent).

**Magnetic cursor:**
- A custom `div#magneticCursor` follows the mouse with a slight lag (GSAP quickSetter).
- On hover over `[data-cursor="magnetic"]` elements, the cursor scales and a magnetic pull effect draws it toward the element centre.
- Hidden on touch devices to avoid interfering with native touch behaviour.

**Trade-off:** GSAP is a paid library for some features (Club GreenSock). The free version covers ScrollTrigger, and the premium SplitText plugin was avoided. Word-by-word reveals use a manual `splitText` implementation.

---

## 5. Internationalisation

### Decision: Custom runtime i18n over i18next / react-intl

**Context:** The site is static HTML with no framework. We need a zero-dependency, runtime-only translation system.

**Implementation:**
- A global `DICTIONARY` object maps `{ 'key': { en: '...', hi: '...' } }`.
- `applyLang()` reads the current language from `localStorage.getItem('lang')`, then walks all `[data-i18n]` elements and replaces their content.
- Element targets: `data-i18n` (innerText), `data-i18n-placeholder`, `data-i18n-title`, `data-i18n-alt`, `data-i18n-value`.
- `toggleLang()` flips between 'en' and 'hi', persists to localStorage, and calls `applyLang()`.

**Why not a library?**
- i18next requires runtime initialisation and module loading. For a plain-JS site, this adds unnecessary overhead.
- The dictionary is ~140 keys. A library would parse this into its internal format, adding complexity for no gain.
- Custom implementation is ~80 lines of vanilla JS, easy to debug, and trivially extensible.

**Trade-off:** No pluralisation rules, date formatting, or interpolation out of the box. These can be added when needed. Hindi pluralisation is simpler than English (often no change), and date formats are handled via `toLocaleDateString('hi-IN')`.

### Hindi Encoding Fix

**Problem:** Vendor-onboarding page shown garbled Hindi text (`à¤¹à¤¿à¤¨à¥à¤¦à¥€`).

**Root cause:** The file was saved as UTF-8 with BOM, but the `<meta charset>` was read after the garbled content was already parsed, or the file was served without UTF-8 BOM.

**Fix:** Rewrote the file using .NET's `UTF8Encoding(false)` (no BOM) via PowerShell, ensuring all bytes are valid UTF-8. Also verified that all HTML files have `<meta charset="UTF-8">` within the first 1024 bytes.

---

## 6. SEO & Structured Data

### Decision: Runtime JSON-LD injection over static `<script>` tags

**Context:** Each page needs different schemas. Writing static JSON-LD in every HTML file would be repetitive and error-prone.

**Implementation:** `seo.js` determines the current page from `window.location.pathname`, then injects the appropriate JSON-LD `<script>` elements into `<head>`.

**Schemas by page:**

| Page | Schemas |
|---|---|
| **index** | Organization, TravelAgency, LocalBusiness, WebSite (SpeakableSpecification, SearchAction), BreadcrumbList |
| **netarhat** | Besides org + breadcrumb: TouristDestination, Place (GeoCoordinates, touristAttraction[4]), LocalBusiness |
| **hotel-netarhat** | Hotel, LodgingBusiness (aggregateRating, amenityFeature[4], GeoCoordinates) |
| **faq** | FAQPage (7 questions with answers, SpeakableSpecification) |
| **destinations** | CollectionPage, ItemList (5 top destinations) |
| **hotels/packages** | CollectionPage, ItemList |
| **cab-booking** | Service (OfferCatalog with 3 cab types) |
| **contact** | ContactPage |
| **about** | AboutPage |
| **vendor-onboarding** | WebPage (RegisterAction) |
| **admin/dashboards** | No index (noindex meta) |

**Why runtime injection over static?**
- Single source of truth for all schema logic
- Easy to add new schemas without touching 18 HTML files
- Can reference shared constants (BASE_URL, phone, sameAs links)
- Schema can be dynamic (e.g., page title pulled from meta tags)

**Trade-off:** The JSON-LD is not present in the initial HTML; it's injected after the script executes. For Google and most crawlers that execute JavaScript, this is fine. For crawlers that don't (some secondary search engines), the schemas won't be visible. The core page content (headings, text, images) is still static and crawlable.

### GEO Optimisation for AI Search Engines

Google's Search Generative Experience (SGE), Perplexity, and Bing Copilot rely heavily on structured data to surface entities in AI-generated answers. Our approach:

1. **Multi-typed entities** — Organization + TravelAgency + LocalBusiness gives Google three ways to recognise the entity
2. **GeoCoordinates** — Lat/lng on Netarhat and Netarhat Forest Retreat enables location-aware AI answers
3. **SameAs links** — 8 authoritative sources (Wikipedia, Wikidata, Instagram, etc.) signal entity authority
4. **SpeakableSpecification** — Marks content that voice assistants and AI can read aloud
5. **hasOfferCatalog** — Describes service categories for AI comparison queries ("compare hotel booking services in Jharkhand")
6. **BookAction interaction statistic** — Signals popularity and social proof to AI systems

---

## 7. API Layer & Backend Integration

### Decision: Client-side API service with mock fallback

**Context:** The Chiti Console backend is under development. The frontend needs to be ready to consume its API when available, but functional for demo purposes today.

**Implementation:**
- `api.js` defines a global `API` object with methods for each backend module (vendors, enquiries, listings, etc.).
- Each method first attempts a real `fetch()` to the Chiti Console API.
- On network failure (API not deployed), it falls back to built-in mock data — realistic sample records for vendors, enquiries, users, listings, and dashboard stats.
- JWT token management via `localStorage` with `setToken`/`getToken`/`clearAuth`.

**Mock data scope:**
- 6 vendors (mix of active, pending, suspended)
- 6 enquiries (mix of statuses, types, and priority levels with message threads)
- 5 users (admin, vendor, customer roles)
- 2 listings (hotel + cab)
- 3 promotions
- Full dashboard stats object

**Design pattern:**
```js
vendors: {
  list: function(params) {
    return apiGet('/vendors' + queryString)
      .catch(function() { return filterMock(MOCK.vendors, params); });
  }
}
```

This pattern ensures the frontend works identically whether hitting the real API or mock data. When the backend is deployed, the `.catch()` branch is never reached.

**Why not a service worker or proxy?**
- Service workers add complexity (registration, lifecycle, caching strategies) and are overkill for API mocking.
- A proxy would require a server component, defeating the static hosting model.
- The `.catch()` fallback pattern is transparent, debuggable, and requires zero configuration.

### Admin Dashboard Live Data

The admin dashboard (`admin.html`) loads data from the API on page load and refreshes every 30 seconds:

1. **KPI cards** — Total enquiries, pending approvals, active listings, monthly revenue
2. **Recent enquiries table** — Last 5 enquiries with customer name, phone, type, time, and colour-coded status badge
3. **Vendor approval queue** — Pending vendors with inline Approve/Reject buttons that call `API.vendors.approve()` / `API.vendors.reject()`

The refresh interval (30 s) is chosen to balance data freshness with API load. For a real deployment, this could be increased to 60 s or use WebSocket push.

---

## 8. Asset Management

### Decision: Local images over CDN/Unsplash for key assets

**Context:** Hero video, temple images, and brand assets need to load reliably without external dependencies.

**Assets stored locally:**

| File | Size | Purpose |
|---|---|---|
| `hero3.mp4` | 6.7 MB | Hero background video |
| `logo.png` | 394 KB | Brand logo (h-12 mobile, h-14 desktop) |
| `favicon.png` | 187 KB | Browser tab icon |
| `parasnath.jpeg` | 100 KB | Parasnath destination card |
| `baidyanath-temple.jpg` | 126 KB | Deoghar/Baidyanath card |
| `maa-chhinnamasta-temple.jpg` | 170 KB | Rajrappa card |

**Why local over CDN:**
- No external dependency risk. Images load even if Unsplash/CDN is down.
- Consistent loading experience. No flash-of-unstyled-content while CDN images load.
- Better control over file sizes and formats.
- No CDN costs or rate limits.

**Trade-off:** Larger Git repository size (~7.5 MB for assets). Mitigated by `.gitignore`-ing `dist/` and using Vite's content-hashed filenames in production for cache busting.

### Image Format Choices

- **JPEG** for photographs (temple images, destination shots) — better compression than PNG for photographic content.
- **PNG** for logo and favicon — transparency support needed for the logo overlay on dark backgrounds.
- **MP4 H.264** for hero video — widest browser support. WebM would be smaller but is not universally supported. The video is 6.7 MB, served with a dark gradient overlay to mask compression artefacts.

---

## 9. Chat Widget

### Decision: Unified custom widget over third-party solutions

**Context:** The site had 7 different WhatsApp FAB implementations across pages (different sizes, phone numbers, icons, and positioning). Third-party solutions (Tidio, Intercom, WhatsApp Business API) were considered but rejected.

**Why custom over third-party:**
- **Zero external dependencies** — No additional JS bundles, cookie banners, or privacy concerns.
- **Full design control** — Matches the brand design system exactly (colours, typography, animations).
- **Purpose-built** — The only requirement is collecting a name and question, then opening WhatsApp. A full chat SDK is overkill.
- **No monthly cost** — WhatsApp Business API or Tidio would add recurring expenses.

**Why not WhatsApp's official embed?**
- WhatsApp's click-to-chat button requires a Facebook business account setup and has limited customisation.
- The official widget doesn't support collecting a pre-message form.

**Design decisions:**
- **60 px diameter** — Large enough to be easily tappable on mobile, visually balanced with the content.
- **Green (#25D366)** — Instantly recognisable as WhatsApp, consistent with the brand's green palette.
- **Popup card approach** — Instead of directly opening WhatsApp on click (which feels abrupt), a popup with a greeting creates a warm, human interaction before redirecting.
- **Name is required, question is optional** — Reduces friction. Even a blank message with just the name is useful for the support team.
- **Ctrl+Enter to send** — Power user affordance for desktop users.

### Removal of Inconsistent Implementations

The following old implementations were removed:

| Page | Old Implementation | Issue |
|---|---|---|
| `index.html` | `.whatsapp-fab` with hardcoded `910000000000` | Wrong number, wrong size (56px) |
| `vendor-onboarding.html` | `.whatsapp-float` with `918009121003` | Wrong number, duplicated CSS |
| `packages.html` | Fixed FAB with inline SVG + `919999999999` | Wrong number, inconsistent styling |
| `blog.html` | Fixed FAB with `919999999999` | Same issues |
| `faq.html` | `<span>chat</span>` icon | Not a functional FAB, just an orphaned icon |
| `about.html` | Same pattern | Same |
| `ai-planner.html` | Same pattern | Same |

---

## 10. Brand Identity

### Decision: "Booking Jharkhand" over "Discover Jharkhand"

**Context:** The original site used "Discover Jharkhand". The user requested a rename to "Booking Jharkhand" to position the platform as a transactional marketplace rather than an informational portal.

**Changes made:**
- All 18 HTML files — title tags, headings, alt text, nav links
- `i18n.js` — all brand name entries in both English and Hindi
- Logo — replaced with `booking-jharkhand-logo.png` (since renamed to `logo.png`)
- Favicon — replaced with `booking-jharkhand-favicon.png` (since renamed to `favicon.png`)
- `docs/PRD.md` and `docs/integration-plan.md` — updated references

### Logo & Navigation Sizing

- **Logo:** `h-12` on mobile, `h-14` on desktop (20% larger than initial `h-10`/`h-12`)
- **Nav:** Changed from `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` to `w-full px-5` — full-width with 20 px padding
- **Nav link spacing:** `gap-7` → `gap-8`

The wider logo and full-width nav create a more modern, edge-to-edge feel that works well with the hero video background.

### Brand Colours

The primary green (#012d1d) was chosen to reflect Jharkhand's forest cover (one of the highest in India at 29%). The warm secondary (#6e5a4c) references the red soil of the Chotanagpur plateau. Together, they create a palette that feels rooted in the region.

---

## 11. Performance Considerations

### Video Loading

The hero video (`hero3.mp4`, 6.7 MB) is loaded as a `<video>` element with `autoplay`, `muted`, `loop`, and `playsinline`. It does not use `preload="none"` because the video is above the fold and should start playing immediately.

For slower connections, the video plays at reduced quality (H.264 compression at ~2 Mbps). A future optimisation could add a WebM variant for browsers that support it (smaller file size at same quality).

### Font Loading

Four Google Fonts families are loaded with `preconnect` hints and `display=swap`. The critical path fonts (Outfit for body, Inter for labels) are loaded first; Montserrat (headlines) and Cormorant Garamond (serif accent) load asynchronously.

### Lazy Loading

Below-the-fold images use `loading="lazy"`. Destination card images, hotel photos, and blog thumbnails are deferred until they enter the viewport.

---

## 12. Security Considerations

### Form Submissions

- Vendor registration form validates required fields client-side before submitting to the API.
- Contact form and booking enquiries similarly validate before POST.
- Server-side validation is expected on the Chiti Console API (not implemented in the static frontend).

### Authentication

- JWT tokens stored in `localStorage`. This is acceptable for a demo/MVP but should migrate to HTTP-only cookies for production to prevent XSS token theft.
- No sensitive data is stored in the frontend. User passwords are never sent to the client.
- Admin dashboard pages (`admin.html`, `*-dashboard.html`) have `noindex` meta tags and are not linked from public pages, but they are not password-protected at the static level. Authentication is enforced at the API layer.

### API Security

- API keys are not embedded in the frontend. Authentication is via JWT obtained through the login endpoint.
- The `api.js` module handles token refresh (future: automatic refresh on 401 responses).

---

## 13. Trade-offs & Regrets

### Would Do Differently

1. **Shared component system** — The duplicated header/footer across 18 HTML files is the single biggest maintenance burden. A future iteration should use Vite's `transformIndexHtml` or an SSI-like approach to inject shared fragments. For now, search-and-replace across files is the workflow.

2. **Tailwind CDN vs. PostCSS** — For production, a PostCSS build would reduce the CSS payload from ~250 KB (CDN) to ~15 KB (purged). The CDN was chosen for zero-config simplicity, but a production build should switch to `@tailwindcss/cli` or PostCSS.

3. **Module scripts for helpers** — `i18n.js` and `seo.js` use global scope. This works but pollutes the global namespace. A better approach would be ES modules with explicit exports, but this would conflict with inline `onclick` handlers in HTML.

4. **Image optimisation** — The hero video at 6.7 MB is large. A compressed WebM version would save ~40% bandwidth for supporting browsers. The logo PNG at 394 KB could be optimised (TinyPNG could reduce to ~80 KB with no visible quality loss).

### Known Issues

- **Dashboard authentication** is not enforced at the static file level. Admin page URLs are discoverable. Mitigation: `noindex` meta tags and API-level auth, but a production deployment should add HTTP basic auth or a reverse proxy gate.
- **No service worker** — The site has no offline support. A future phase could add a Workbox-based service worker for caching API responses and assets.
- **i18n dictionary size** is growing (~140 keys). Without a namespacing strategy, it could become unwieldy. Consider splitting by page or feature area if it exceeds 300 keys.

---

## Appendix: Tooling Decisions

| Tool | Version | Rationale |
|---|---|---|
| **Vite** | 8.x | Fastest MPA bundler. Native ES module support. |
| **Tailwind CSS** | 3.x | Utility-first. CDN mode avoids build config. |
| **GSAP** | 3.12 | Industry-standard animation. ScrollTrigger for scroll-linked effects. |
| **Lenis** | 1.x | Smooth scroll with GSAP integration. |
| **PowerShell** | 5.1 | Native Windows scripting for batch file operations. |
| **GitHub** | — | Hosting and collaboration. |
| **Node.js** | ≥ 18 | Required by Vite 8. |

---

*Every decision in this document was made with the principle: ship fast, iterate, avoid premature optimisation. As the platform grows, each of these decisions should be revisited with real usage data.*

*Maintained by Chiti Technologies. Contributions and corrections welcome.*
