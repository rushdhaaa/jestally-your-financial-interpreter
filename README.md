<div align="center">

<img src="https://img.shields.io/badge/Jestally-Financial%20Intelligence-E8192C?style=for-the-badge&logoColor=white" alt="Jestally" />

# JESTALLY — India's Accessible Financial News Agent

### *Real-time Indian financial news with Indian Sign Language (ISL) accessibility, AI-powered insights, and deep persona personalisation*

<br/>

[![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite_5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS_3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

<br/>

> **Jestally bridges the gap between complex Indian financial news and every Indian — including the 63 million deaf and hard-of-hearing citizens who have been systematically excluded from financial literacy.**

<br/>

[Live Demo](#) · [Report Bug](https://github.com/rushdhaaa/jestally-your-financial-interpreter/issues) · [Request Feature](https://github.com/rushdhaaa/jestally-your-financial-interpreter/issues)

</div>

---

## Table of Contents

- [The Mission](#-the-mission)
- [What Makes Jestally Different](#-what-makes-jestally-different)
- [Indian Sign Language Engine — Deep Dive](#-indian-sign-language-engine--deep-dive)
- [Architecture](#-architecture)
- [Feature Breakdown](#-feature-breakdown)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Persona System](#-persona-system)
- [Internationalisation](#-internationalisation)
- [AI & Intelligence Layer](#-ai--intelligence-layer)
- [Contributing](#-contributing)
- [Roadmap](#-roadmap)

---

## 🎯 The Mission

India has **63 million deaf and hard-of-hearing citizens**. Financial news — which directly affects their savings, loans, investments, and livelihoods — is produced almost exclusively in formats that are inaccessible to them: dense text, audio broadcasts, video without sign language.

**Jestally is built to fix that.**

At the same time, even hearing users face a different accessibility problem: financial news is jargon-heavy, opaque, and written for analysts — not for the student wondering if their education loan EMI will change, the homemaker tracking grocery prices, or the retiree watching FD rates.

Jestally solves both problems simultaneously:

1. **Indian Sign Language (ISL) playback** for every news article — making financial news deaf-accessible for the first time at scale
2. **Plain-language ELI5 summaries** — so every Indian, regardless of financial literacy, understands what the news means
3. **Deep persona personalisation** — so the same RBI rate news is explained differently to an investor, a homemaker with a home loan, and a student

---

## ✨ What Makes Jestally Different

| Feature | Traditional News Apps | Jestally |
|---|---|---|
| ISL Accessibility | ❌ None | ✅ Full ISL video playback per article |
| Plain language summaries | ❌ Raw wire copy | ✅ ELI5 per headline |
| Personalisation | ❌ Generic | ✅ 6 personas × financial holdings profile |
| Language support | ❌ English only | ✅ English, Hindi, Tamil, Telugu, Bengali |
| AI chat | ❌ None | ✅ Persona-aware financial advisor chat |
| Market data | ✅ Basic ticker | ✅ Live heatmap + trending sidebar |
| Story depth | ❌ Headline only | ✅ Story Arc: timeline, players, predictions |

---

## 🤟 Indian Sign Language Engine — Deep Dive

> This is the heart of Jestally. Everything else makes news readable. ISL makes it accessible.

### What is ISL?

Indian Sign Language is the primary language of India's deaf community — distinct from ASL, BSL, or any other sign language. It has its own grammar, syntax, and vocabulary. It is **not** a transliteration of Hindi or English.

### The ISL Pipeline

```
User clicks "Play ISL Sign" on a news card
              │
              ▼
┌─────────────────────────────────────────────┐
│          ISL Grammar Normalisation           │
│                                             │
│  Raw text → applyISLGrammar()               │
│  "Will the RBI cut interest rates?"         │
│  ↓ Drop articles, modals, prepositions      │
│  ↓ Reorder: TIME → TOPIC → NEG → WH        │
│  "RBI interest rates cut?"                  │
└─────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│            ISL Alias Resolution              │
│                                             │
│  normalizeForISL()                          │
│  Maps English words → ISL vocabulary        │
│  "yes" → "good", "sorry" → "sad"           │
│  Domain-specific: "rupee", "market", etc.   │
└─────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│         AWS Lambda Resolver API              │
│                                             │
│  POST /prod/resolve                         │
│  { text: "RBI interest rates cut",          │
│    language: "ISL" }                        │
│                                             │
│  Returns: { gifs: [{ word, url }] }         │
│  Each word → S3 .mp4 sign video URL         │
└─────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│         Word-by-Word Fallback                │
│                                             │
│  If full phrase not found:                  │
│  resolveWordByWord() tries each word alone  │
│  Gracefully skips unknown signs             │
│  (No letter-by-letter fallback —            │
│   letters were never in the ISL bucket)     │
└─────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│       Dual-Buffer Video Playback             │
│                                             │
│  ISLPlayer: Two <video> elements            │
│  While video A plays → video B preloads     │
│  Zero-flicker transitions between signs     │
│  Progress indicator: "Sign 3 of 7"          │
└─────────────────────────────────────────────┘
```

### Two ISL Surfaces

Jestally provides ISL through two distinct components, sharing the same engine:

#### 1. ISLPlayer — Floating Card Player
- Triggered by "Play ISL Sign" button on each news card
- Fixed bottom-right overlay
- Dual-buffer `<video>` swap for zero-flicker playback
- Minimise/maximise controls
- Auto-skips on network error — never crashes

#### 2. JestallyPanel — Full ISL Panel
- Full right-side panel (360px)
- Supports free text input AND microphone speech recognition
- Multi-language mic: en-IN, hi-IN, ta-IN, te-IN, bn-IN
- Translates non-English input to English before ISL resolution
- GIF + MP4 support with timer-based advance
- Progress dots for multi-sign sequences

### ISL Grammar Rules

ISL has fundamentally different grammar from English or Hindi. The engine implements:

```
English: "Will the RBI cut interest rates tomorrow?"
ISL:     "Tomorrow RBI interest rates cut?"

Rule 1: TIME markers → front of sentence
Rule 2: WH-questions → end of sentence  
Rule 3: Drop: a, an, the, is, are, was, will, would, of, in...
Rule 4: NEG words (not, never, no) → cluster before WH
Rule 5: Deduplicate adjacent identical signs
```

### ISL Vocabulary Curation

The `ISL_VOCABULARY` constant in `src/types/news.ts` has been carefully curated to contain **only whole-word signs** that exist in the S3 bucket. Key decisions:

- ❌ **Removed**: All single letters (A–Z) and digits (0–9) — these were never in the S3 bucket and caused noise
- ✅ **Retained**: Financial domain words: Gold, Market, Bank, Rate, Stock, Trade, Profit, Loan, Tax, Growth, Fall, Rise, Rupee, Dollar, Forex, Inflation, Nifty, Sensex, RBI, etc.
- ✅ **Added**: Common phrases: Thank You, Hello, Help, Good, Bad

### Sign Language Caching

```typescript
const gifCache = new Map<string, ISLGif[]>();
// LRU-style: evicts oldest when > 100 entries
// Key: normalized lowercase text
// Value: array of { word, url } resolved from API
```

Repeated ISL requests for the same concept never hit the network.

---

## 🏗️ Architecture

### System Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                        JESTALLY FRONTEND                           │
│                    React 18 + TypeScript + Vite                    │
│                                                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────────┐    │
│  │  Header  │  │Industry  │  │  News    │  │ Market         │    │
│  │  + Ticker│  │ Sidebar  │  │  Feed    │  │ Sidebar        │    │
│  └──────────┘  └──────────┘  └──────────┘  └────────────────┘    │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                    NewsCard (per article)                     │ │
│  │  Headline → ELI5 Summary → Persona Impact → ISL Button       │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌─────────────┐   ┌─────────────────┐   ┌──────────────────┐    │
│  │  ISLPlayer  │   │  JestallyPanel  │   │     ChatBot      │    │
│  │  (floating) │   │  (full panel)   │   │  (AI advisor)    │    │
│  └─────────────┘   └─────────────────┘   └──────────────────┘    │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                    State & Context                          │   │
│  │  UserContext (persona + financial profile)                  │   │
│  │  React Query (news fetching infrastructure)                 │   │
│  │  i18next (5 language translations)                          │   │
│  └────────────────────────────────────────────────────────────┘   │
└───────────────────────────┬────────────────────────────────────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
┌─────────────────┐  ┌────────────┐  ┌──────────────────┐
│  AWS Lambda     │  │  MyMemory  │  │   Groq API       │
│  ISL Resolver   │  │Translation │  │ (Story Arc AI)   │
│  /prod/resolve  │  │    API     │  │ llama-3.3-70b    │
└────────┬────────┘  └────────────┘  └──────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│   AWS S3: jestally-isl-gifs-    │
│   prod.s3.ap-south-1.amazonaws  │
│   .com                          │
│                                 │
│   /Gold.mp4                     │
│   /Market.mp4                   │
│   /RBI.mp4                      │
│   /Interest.mp4                 │
│   /Rate.mp4  ...                │
└─────────────────────────────────┘
```

### Component Tree

```
App.tsx
└── UserProvider (UserContext)
    └── QueryClientProvider
        └── TooltipProvider
            ├── OnboardingModal (portal, fires on first visit)
            ├── ProfileModal (portal, fires on profile edit)
            └── BrowserRouter
                └── Index.tsx (/)
                    ├── Header
                    │   ├── Logo + Tagline
                    │   ├── Language Selector (en/hi/ta/te/bn)
                    │   └── Market Ticker (animated)
                    ├── BulletinStories (story bubbles row)
                    ├── IndustrySidebar (left, lg+)
                    │   └── Industry filter tabs
                    ├── News Feed (2/3 width)
                    │   ├── Hero NewsCard (first High priority)
                    │   └── NewsCard[] (remaining)
                    │       ├── Priority badge + Category + Timestamp
                    │       ├── Headline (font-headline)
                    │       ├── ELI5 Summary (plain language)
                    │       ├── PersonaImpact block (animated)
                    │       └── ISL Button → ISLPlayer
                    ├── MarketSidebar (1/3 width, lg+)
                    │   ├── Market Heatmap grid
                    │   └── Trending Now list
                    ├── JestallyPanel (right slide-in)
                    │   ├── ISL Video Stage
                    │   ├── Transcript display
                    │   ├── Progress dots
                    │   ├── Mic input (Web Speech API)
                    │   └── Text input
                    ├── ChatBot (fixed FAB + panel)
                    │   ├── Persona badge + risk display
                    │   ├── Message thread
                    │   ├── Quick prompt chips
                    │   └── Input + Send
                    └── NewsDetailPanel (on article click)
                        └── StoryArcTracker (Groq AI)
```

### Data Flow

```
1. App loads
   └── UserProvider reads localStorage("jestally_user_profile")
       ├── Found → hydrate UserProfile, skip onboarding
       └── Not found → show OnboardingModal (6-step flow)

2. News generation (newsEngine.ts)
   └── generateNewsItem(lang) called 12x on mount
       ├── Picks random headline from HEADLINES[]
       ├── Selects language variant (en/hi/ta/te/bn)
       ├── Builds ELI5 summary from SUMMARIES[category][lang]
       ├── Sets impactSummaries from IMPACT_TEMPLATES
       └── Derives ISL concepts from ISL_VOCABULARY match
   └── setInterval: adds 1 new item every 15s (max 25)
   └── Re-runs on i18n language change

3. User clicks news card
   └── setActiveNews(item) → ChatBot context updates
   └── NewsDetailPanel opens with StoryArcTracker

4. User clicks "Play ISL Sign"
   └── item.concepts[] → ISLPlayer
       └── resolveAndPlay()
           └── for each concept: POST /prod/resolve
               └── Returns S3 .mp4 URL
           └── setQueue(urls) → dual-buffer video playback

5. ChatBot interaction
   └── User types question
   └── generateChatResponse(input, activeNews, userProfile, lang)
       └── Analyses intent: explain / invest / predict / advise
       └── Returns persona-aware, risk-calibrated response
       └── Typing indicator (600ms) for natural feel
```

---

## 🧩 Feature Breakdown

### 🗞️ News Feed
- **15-second auto-refresh** — new article prepended silently
- **Hero card** — first High-priority article gets full-width treatment
- **Industry filter** — 17 sectors: Auto, Banking, Energy, Tech, Healthcare, etc.
- **Priority system** — High (red border), Medium (amber), Low (grey)
- **LIVE badge** — animated pulse for High-priority articles
- **Bulletin Stories** — horizontal scrollable story bubbles (ET-style)

### 🧠 ELI5 Summaries
Every headline gets a plain-language explanation generated from `getELI5Summary()` in `personaLogic.ts`. Examples:

| Headline | ELI5 Summary |
|---|---|
| "RBI Holds Repo Rate Steady at 6.5%" | "The RBI decided to keep borrowing costs the same. Your EMIs won't change for now." |
| "Gold Prices Hit Record High" | "If you own gold jewellery or sovereign gold bonds, they're worth more today." |
| "Rupee Weakens Against Dollar" | "Imports get costlier — think fuel, electronics — but good for IT exporters." |

### 👤 Persona Impact System
Each user profile produces a one-sentence personalised impact statement per article. The system considers:
- Persona type (6 types)
- Financial holdings (home loan, stocks, mutual funds, FDs, gold, business)
- Risk appetite (conservative / moderate / aggressive)
- Primary goal (wealth / save / protect / learn)
- Age range and income bracket

### 🤖 AI Chat Assistant
The ChatBot understands four intent types:

| Intent | Trigger words | Response style |
|---|---|---|
| **Explain** | "what", "explain", "mean", "simple" | ELI5 + category context |
| **Invest** | "invest", "buy", "sell", "should I" | Risk-profile-calibrated advice |
| **Predict** | "predict", "outlook", "will", "next" | Forward-looking analysis |
| **Advise** | "what should I do", "action", "steps" | Personalised action plan |

### 📖 Story Arc Tracker
Powered by Groq's `llama-3.3-70b-versatile` model, each article generates:
- **5-point interactive timeline** with sentiment indicators
- **Key players** with pro/against/neutral stances
- **Sentiment shift bars** (scored 0–100 across 4 phases)
- **Contrarian perspectives** — the bear case
- **What to watch next** — 3 predictions with probability ratings

### 🌍 Language System
Full translations across all 5 supported languages — not just labels but full UI strings, news headlines, summaries, and impact messages. Language preference persists to `localStorage`.

### 🔗 Social Sharing
Each article has a social drawer with direct search links to YouTube, X/Twitter, Instagram, Facebook, and a clipboard copy — opening in new tabs without affiliation.

---

## 🛠️ Tech Stack

### Frontend Core

| Technology | Version | Purpose |
|---|---|---|
| React | 18.3.1 | UI framework — all functional components with hooks |
| TypeScript | 5.8.3 | Strict typing throughout |
| Vite | 5.4.19 | Build tool + dev server (port 8080) |
| TailwindCSS | 3.4.17 | Utility-first styling with custom design tokens |
| Framer Motion | 11.x | Animations: card mount, panel slide-in, ISL transitions |

### UI & Design

| Technology | Version | Purpose |
|---|---|---|
| shadcn/ui | latest | Component primitives (Dialog, Sheet, Tooltip, etc.) |
| Radix UI | various | Accessible headless components under shadcn |
| Lucide React | 0.462.0 | Icon system |
| Phosphor Icons | (planned) | Bolder financial-feel icons |
| Playfair Display | Google Fonts | Headline font (ET-inspired serif) |
| Source Sans 3 | Google Fonts | Body font |

### State & Data

| Technology | Version | Purpose |
|---|---|---|
| React Query | 5.83.0 | Server state infrastructure (wired, not yet live) |
| React Router | 6.30.1 | Client-side routing (/ and 404) |
| Context API | React 18 | UserProfile global state |
| localStorage | Web API | Profile persistence across sessions |

### Internationalisation

| Technology | Version | Purpose |
|---|---|---|
| i18next | 26.x | i18n core |
| react-i18next | 17.x | React bindings |
| MyMemory API | - | Runtime translation for ISL text input |

### AI & External APIs

| Service | Purpose | Endpoint |
|---|---|---|
| AWS Lambda (custom) | ISL sign resolution | `POST /prod/resolve` |
| AWS S3 | ISL sign video storage (`.mp4`) | `jestally-isl-gifs-prod.s3.ap-south-1.amazonaws.com` |
| Groq API | Story Arc AI (llama-3.3-70b) | `api.groq.com/openai/v1/chat/completions` |
| MyMemory | Text translation | `api.mymemory.translated.net` |
| Web Speech API | Mic input for ISL panel | Browser native |

### Dev & Build

| Tool | Purpose |
|---|---|
| Bun | Package manager (also works with npm) |
| ESLint 9 | Linting with TypeScript + React Hooks rules |
| Vitest | Unit test runner |
| Playwright | E2E test infrastructure |
| PostCSS + Autoprefixer | CSS processing |

---

## 📁 Project Structure

```
jestally-your-financial-interpreter/
│
├── public/                        # Static assets
│   ├── favicon.ico
│   └── placeholder.svg
│
├── src/
│   ├── components/                # UI components
│   │   ├── BulletinStories.tsx    # Horizontal story bubbles (ET-style)
│   │   ├── ChatBot.tsx            # AI chat FAB + panel
│   │   ├── Header.tsx             # Nav + language selector + ticker
│   │   ├── IndustrySidebar.tsx    # Left sector filter sidebar
│   │   ├── ISLPlayer.tsx          # Floating ISL video player ⭐
│   │   ├── JestallyPanel.tsx      # Full ISL panel with mic ⭐
│   │   ├── MarketSidebar.tsx      # Right: heatmap + trending
│   │   ├── NavLink.tsx            # Router-aware nav link
│   │   ├── NewsCard.tsx           # News article card
│   │   ├── NewsDetailPanel.tsx    # Full article detail view
│   │   ├── OnboardingModal.tsx    # 6-step profile setup
│   │   ├── ProfileModal.tsx       # Profile edit modal
│   │   ├── RegionalSummaries.tsx  # Multi-language impact summaries
│   │   ├── SocialDrawer.tsx       # Social share bottom drawer
│   │   ├── StoryArcTracker.tsx    # AI narrative builder (Groq)
│   │   └── ui/                    # shadcn/ui primitives (do not edit)
│   │
│   ├── context/
│   │   └── UserContext.tsx        # Global user profile state ⭐
│   │
│   ├── hooks/
│   │   ├── use-mobile.tsx         # Responsive breakpoint hook
│   │   └── use-toast.ts           # Toast notification hook
│   │
│   ├── i18n.ts                    # i18next config + all translations
│   │
│   ├── lib/
│   │   ├── islEngine.ts           # ISL grammar + API + cache ⭐⭐
│   │   ├── newsEngine.ts          # News generation + multilingual data
│   │   └── utils.ts               # cn() class merger
│   │
│   ├── pages/
│   │   ├── Index.tsx              # Main page layout
│   │   └── NotFound.tsx           # 404
│   │
│   ├── test/
│   │   ├── example.test.ts        # Vitest example
│   │   └── setup.ts               # Test environment setup
│   │
│   ├── types/
│   │   └── news.ts                # NewsItem type + ISL_VOCABULARY ⭐
│   │
│   ├── utils/
│   │   └── personaLogic.ts        # ELI5 + persona impact + chat AI ⭐⭐
│   │
│   ├── App.tsx                    # Root with providers
│   ├── App.css                    # Global overrides
│   ├── index.css                  # Tailwind base + CSS variables
│   ├── main.tsx                   # ReactDOM entry point
│   └── vite-env.d.ts              # Vite type declarations
│
├── .env                           # Local secrets (never committed)
├── env.example                    # Template for .env
├── .gitignore
├── components.json                # shadcn/ui config
├── eslint.config.js
├── index.html                     # Vite HTML template
├── package.json
├── playwright.config.ts
├── postcss.config.js
├── tailwind.config.ts             # Design tokens + custom colours
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── vitest.config.ts
```

⭐ = Key files to understand first  
⭐⭐ = Core engine files

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun 1.0+
- A modern browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone https://github.com/rushdhaaa/jestally-your-financial-interpreter.git
cd jestally-your-financial-interpreter

# Install dependencies
npm install
# or with Bun:
bun install
```

### Development

```bash
npm run dev
# App starts at http://localhost:8080
```

### Build

```bash
npm run build
npm run preview  # Preview production build locally
```

### Testing

```bash
npm run test          # Vitest unit tests
npm run test:watch    # Watch mode
```

---

## 🔐 Environment Variables

Copy `env.example` to `.env` and fill in your values:

```bash
cp env.example .env
```

| Variable | Required | Description |
|---|---|---|
| `VITE_RESOLVER_API` | ✅ | AWS Lambda ISL resolver endpoint |
| `VITE_API_KEY` | ✅ | API key for the ISL resolver |
| `VITE_GROQ_API_KEY` | ⚡ Optional | Groq API key for Story Arc AI feature |

> **Never commit your `.env` file.** It is gitignored by default. The `.env` file contains real API keys — rotate them immediately if accidentally exposed.

### Getting API Keys

- **Groq API** (for Story Arc): [console.groq.com](https://console.groq.com) — free tier available
- **ISL Resolver**: This is a custom AWS Lambda. Contact the project maintainers for access.

---

## 👤 Persona System

### User Profile Schema

```typescript
interface UserProfile {
  persona: "Student" | "Investor" | "Business" | "Homemaker" | "Retiree" | "Commoner";
  name: string;

  // Financial holdings
  hasHomeLoan: boolean;
  homeLoanAmountLakhs: number;
  investsInStocks: boolean;
  hasMutualFunds: boolean;
  hasBusiness: boolean;
  hasFixedDeposits: boolean;
  hasInsurance: boolean;

  // Demographics
  annualIncome: string;  // Income bracket
}
```

### Persona × Impact Matrix

| News Category | Investor | Homemaker | Retiree | Student | Business |
|---|---|---|---|---|---|
| RBI Rate | Portfolio rebalancing | EMI change alert | FD rate watch | Education loan cost | Working capital cost |
| Gold | Portfolio hedge signal | Jewellery value | Savings-in-gold | — | — |
| Inflation | Real returns check | Grocery budget | Purchasing power | Daily living costs | Input cost margins |
| Markets | Equity holdings | — | Retirement corpus | Learning signal | Valuation impact |
| Tax / Budget | Capital gains watch | — | Senior provisions | Section 80E check | Compliance review |

### Onboarding Flow

The 6-step onboarding modal collects:

```
Step 1 → Persona selection (6 types with descriptions)
Step 2 → Name
Step 3 → Financial holdings (home loan amount, business)
Step 4 → Investments (stocks, mutual funds, FDs, insurance)
Step 5 → Annual income bracket
Step 6 → Review summary → "Start Reading"
```

Profile is saved to `localStorage("jestally_user_profile")` and hydrated on every load via lazy initialiser — never `null` on first render.

---

## 🌐 Internationalisation

All UI strings, news headlines, summaries, and impact messages are available in:

| Language | Code | Coverage |
|---|---|---|
| English | `en` | 100% — primary |
| Hindi | `hi` | 100% — full translation |
| Tamil | `ta` | 100% — full translation |
| Telugu | `te` | 100% — full translation |
| Bengali | `bn` | 100% — full translation |

Language preference persists to `localStorage("i18nextLng")` and is restored on reload.

```typescript
// Language switching
i18n.changeLanguage("hi");  // All UI + news updates instantly
// newsEngine re-runs with new lang → headlines in Hindi
// ISL panel mic switches to hi-IN
// Dates/times format to locale
```

---

## 🧠 AI & Intelligence Layer

### ELI5 Engine (`personaLogic.ts → getELI5Summary`)

Rules-based plain language generator. Matches headline patterns to pre-written explanations:

```
"RBI Holds Repo Rate Steady" → rate + hold pattern
→ "The RBI decided to keep borrowing costs the same.
   Your EMIs won't change for now, and savings rates stay put."

"Gold Prices Hit Record High" → gold + high pattern
→ "Gold prices hit a record. If you own jewellery, coins,
   or sovereign gold bonds, they're worth more today."
```

### Persona Impact Engine (`personaLogic.ts → getPersonalImpact`)

Keyword × persona matrix producing one-line personalised insights. Returns `null` if no meaningful match — never shows generic filler text.

### Chat Response Engine (`personaLogic.ts → generateChatResponse`)

Intent classification → profile-aware response generation:

```
Input: "Should I invest now?"
Profile: Investor, aggressive, investsInStocks: true
Active article: SENSEX Crosses 80,000

Response: "📊 Market call for your profile: Given this High 
priority Markets news and your aggressive risk appetite — 
short-term volatility is an opportunity. Consider adding to 
quality large-cap positions on dips..."
```

### Story Arc AI (Groq + llama-3.3-70b)

Structured JSON prompt → narrative analysis:

```json
{
  "storyTitle": "RBI Holds Ground Amid Global Storm",
  "timeline": [/* 5 dated events with sentiment */],
  "keyPlayers": [/* 3 players with pro/against/neutral */],
  "sentimentShifts": [/* 4 phases scored 0-100 */],
  "contrarianViews": [/* 2 bear case perspectives */],
  "watchNext": [/* 3 predictions with probability + timeframe */]
}
```

---

## 🗺️ Roadmap

### Near Term
- [ ] Live news API integration (replace mock engine with NewsAPI / Polygon.io)
- [ ] Move all secrets to `.env` — ISL API key currently in `islEngine.ts`
- [ ] Phosphor Icons replacing all emoji in UI
- [ ] Playfair Display + Source Sans 3 font upgrade (ET-inspired)
- [ ] Vitest coverage for `getPersonalImpact()` and `getELI5Summary()`

### Medium Term
- [ ] Real LLM chat (Anthropic / OpenAI) replacing rule-based responses
- [ ] Shared ISL resolution cache between ISLPlayer and JestallyPanel
- [ ] Persona switcher in Header (no need to clear localStorage)
- [ ] Floating ISLPlayer on page load for top article
- [ ] Error boundary wrapping ISL components

### Long Term
- [ ] Expand ISL vocabulary — IPO, FII, DII, SEBI, SIP, NPS, Mutual Fund
- [ ] ISL for full article text (not just concepts)
- [ ] Video-based ISL with human interpreter (premium tier)
- [ ] Mobile app (React Native)
- [ ] Push notifications for High-priority news

---

## 🤝 Contributing

Contributions are welcome, especially in these areas:

1. **ISL vocabulary expansion** — adding more financial terms to `ISL_VOCABULARY` and the S3 bucket
2. **Translations** — improving existing translations or adding new languages
3. **Persona coverage** — adding more keyword patterns in `personaLogic.ts`
4. **Tests** — Vitest unit tests for the pure functions

```bash
# Fork → clone → branch
git checkout -b feature/your-feature

# Make changes, then
git commit -m "feat: describe your change"
git push origin feature/your-feature
# Open a Pull Request
```

---

## ♿ Accessibility Statement

Jestally is built with accessibility as a first-class feature, not an afterthought:

- **ISL support** for India's 63 million deaf and hard-of-hearing citizens
- **Plain language summaries** for users with lower financial literacy
- **5-language support** for India's linguistic diversity
- **Keyboard navigable** UI components via Radix UI primitives
- **ARIA labels** on interactive elements
- **Colour contrast** — all text meets WCAG AA standards
- **Motion respects** `prefers-reduced-motion` via Framer Motion

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 👩‍💻 Built With

Built with ❤️ for every Indian — especially those who've been left out of the financial conversation for too long.

> *"Financial literacy is not a privilege. It is a right."*

---

<div align="center">

**Star ⭐ this repo if Jestally helped you understand your finances better.**

[github.com/rushdhaaa/jestally-your-financial-interpreter](https://github.com/rushdhaaa/jestally-your-financial-interpreter)

</div>
