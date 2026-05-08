# CONTEXT.md — BD Passport Photo Converter

> Hand this file to Claude Code at the start of every session.
> It contains the full project spec, architecture, and decisions made during planning.

---

## 1. Project Overview

A **serverless, client-side-only** web application for Bangladeshi users to convert any photo into a government-standard passport-size image. No image ever leaves the user's device — all processing happens in the browser.

**Target users:** Bangladeshi citizens applying for passports, visas, NID, or any government form that requires a standard photo.

**Core promise:**
- Free, forever
- No sign-up required
- No image uploaded to any server
- Works offline after first load (PWA optional)
- Fully localized in Bangla with an English toggle

---

## 2. Tech Stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | **Next.js 14** (App Router) | Static export (`output: 'export'`) |
| Language | **TypeScript** | Strict mode enabled |
| Styling | **Tailwind CSS v3** + **shadcn/ui** | Custom BD green theme |
| State | **Zustand** | Single global store |
| i18n | **next-intl** | Locales: `bn` (default), `en` |
| Cropping UI | **react-image-crop** | Free-aspect + locked ratio mode |
| Compression | **browser-image-compression** | Client-side only |
| Image processing | **HTML Canvas API** | Native browser, no lib needed |
| Deployment | **Vercel** | Free tier, static CDN |
| Icons | **Lucide React** | Consistent icon set |
| Fonts | **Hind Siliguri** (Bangla) + **Inter** (Latin) | via `next/font/google` |

---

## 3. System Architecture

```
User Browser
     │
     ▼ HTTPS
┌─────────────────────────────────────────────┐
│          Vercel Edge CDN (Static)           │
│  ┌──────────────────────────────────────┐   │
│  │       Next.js 14 — App Router        │   │
│  │  (next export → pure static output)  │   │
│  │                                      │   │
│  │  Pages: /  /faq  /about              │   │
│  │  Components: See Section 6           │   │
│  │  i18n: next-intl (bn / en)           │   │
│  │  State: Zustand store                │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
     │
     ▼ All image work runs inside the browser
┌─────────────────────────────────────────────┐
│       Client-Side Processing Pipeline       │
│                                             │
│  Upload → Crop → Resize → Process → Download│
│  (File API) (Canvas) (Canvas) (Blob URL)    │
│                                             │
│  ✗ No server  ✗ No DB  ✗ No storage         │
└─────────────────────────────────────────────┘
```

**Key architectural decision:** `output: 'export'` in `next.config.ts`. The entire app compiles to static HTML/CSS/JS. Vercel serves it from the CDN edge — zero serverless functions, zero cold starts.

---

## 4. BD Passport Photo Specification

These are the official Government of Bangladesh standards:

| Property | Value |
|---|---|
| **Dimensions** | 35 mm × 45 mm |
| **Resolution** | 300 DPI |
| **Pixel size (300 DPI)** | **413 × 531 pixels** |
| **Background** | Plain white (#FFFFFF) |
| **Face coverage** | 70–80% of frame height |
| **Format (digital)** | JPEG |
| **Max file size (online forms)** | 100 KB |
| **Color mode** | Full color (sRGB) |

**Additional rules displayed to users:**
- Recent photo (within 6 months)
- Eyes open, looking directly at camera
- No sunglasses, no tinted lenses
- No head covering (except religious)
- Neutral expression, mouth closed
- No heavy shadows on face or background

**Other supported presets (secondary):**

| Preset | Size (mm) | Pixels @ 300dpi |
|---|---|---|
| BD Standard | 35 × 45 | 413 × 531 |
| US Visa / Passport | 51 × 51 | 600 × 600 |
| EU / Schengen | 35 × 45 | 413 × 531 |
| India Visa | 51 × 51 | 600 × 600 |
| UK Passport | 35 × 45 | 413 × 531 |

---

## 5. Features

### Must Have (MVP)
- [ ] Drag & drop + click-to-upload image input
- [ ] Auto center-crop to 35:45 aspect ratio
- [ ] Resize to 413×531 px at 300 DPI equivalent
- [ ] White background fill (for transparent PNGs)
- [ ] Quality slider (40%–100%, default 90%)
- [ ] JPEG download (default)
- [ ] Bangla UI (default locale)
- [ ] English UI toggle
- [ ] BD spec info panel
- [ ] Mobile responsive layout

### Should Have (v1.1)
- [ ] PNG and WEBP format output options
- [ ] Manual crop adjustment (react-image-crop UI)
- [ ] Background color picker (white, light gray, light blue)
- [ ] Print layout: 4-up or 6-up grid on A4 (canvas-rendered PDF via `jspdf`)
- [ ] Multiple size presets (US, EU, India, UK)
- [ ] File size estimator shown live as quality changes

### Nice to Have (v2)
- [ ] Face detection hint (via `face-api.js` or `@tensorflow-models/blazeface`) to auto-position crop
- [ ] PWA support (offline after first visit)
- [ ] Dark mode
- [ ] Share button (Web Share API)
- [ ] Analytics (privacy-respecting, e.g. Plausible)

---

## 6. Folder Structure

```
bd-passport-photo/
├── public/
│   ├── favicon.ico
│   ├── og-image.png              # Open Graph image
│   └── icons/                   # PWA icons (optional)
│
├── messages/
│   ├── bn.json                   # Bangla translations (default)
│   └── en.json                   # English translations
│
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx        # Root layout with fonts + i18n provider
│   │   │   ├── page.tsx          # Main converter page
│   │   │   ├── faq/
│   │   │   │   └── page.tsx
│   │   │   └── about/
│   │   │       └── page.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                   # shadcn/ui generated components
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── LanguageSwitcher.tsx
│   │   ├── upload/
│   │   │   └── UploadZone.tsx
│   │   ├── editor/
│   │   │   ├── ImageCropper.tsx
│   │   │   ├── SettingsPanel.tsx
│   │   │   └── PreviewCard.tsx
│   │   └── download/
│   │       └── DownloadSection.tsx
│   │
│   ├── lib/
│   │   ├── imageProcessor.ts     # Core Canvas API processing logic
│   │   ├── presets.ts            # Photo size presets (BD, US, EU, etc.)
│   │   └── utils.ts              # formatBytes, cn(), etc.
│   │
│   ├── store/
│   │   └── usePhotoStore.ts      # Zustand global store
│   │
│   ├── i18n.ts                   # next-intl config
│   └── middleware.ts             # next-intl locale routing
│
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── components.json               # shadcn/ui config
└── CONTEXT.md                    # ← this file
```

---

## 7. Zustand Store Shape

```typescript
// src/store/usePhotoStore.ts

interface PhotoState {
  // Upload
  originalFile: File | null
  originalDataUrl: string | null

  // Crop (react-image-crop PercentCrop)
  crop: PercentCrop | null
  completedCrop: PixelCrop | null

  // Settings
  preset: PhotoPreset          // default: BD_STANDARD
  outputFormat: 'jpeg' | 'png' | 'webp'  // default: 'jpeg'
  quality: number              // 0.4–1.0, default: 0.90
  bgColor: string              // default: '#FFFFFF'

  // Output
  processedDataUrl: string | null
  estimatedFileSize: number | null  // bytes

  // Actions
  setFile: (file: File) => void
  setCrop: (crop: PercentCrop) => void
  setCompletedCrop: (crop: PixelCrop) => void
  setPreset: (preset: PhotoPreset) => void
  setFormat: (format: OutputFormat) => void
  setQuality: (q: number) => void
  setBgColor: (color: string) => void
  processImage: () => Promise<void>
  reset: () => void
}
```

---

## 8. Photo Presets

```typescript
// src/lib/presets.ts

export interface PhotoPreset {
  id: string
  labelKey: string        // i18n key
  widthMm: number
  heightMm: number
  widthPx: number         // at 300 DPI
  heightPx: number
  dpi: number
  maxFileSizeKb: number
}

export const PRESETS: PhotoPreset[] = [
  {
    id: 'bd_standard',
    labelKey: 'presets.bd_standard',
    widthMm: 35, heightMm: 45,
    widthPx: 413, heightPx: 531,
    dpi: 300,
    maxFileSizeKb: 100,
  },
  {
    id: 'us_passport',
    labelKey: 'presets.us_passport',
    widthMm: 51, heightMm: 51,
    widthPx: 600, heightPx: 600,
    dpi: 300,
    maxFileSizeKb: 240,
  },
  // ... etc
]

export const DEFAULT_PRESET = PRESETS[0]  // bd_standard
```

---

## 9. Core Image Processing Logic

```typescript
// src/lib/imageProcessor.ts
// All processing happens client-side via Canvas API — no server calls.

export async function processPassportPhoto(
  sourceDataUrl: string,
  completedCrop: PixelCrop | null,   // null = auto center-crop
  preset: PhotoPreset,
  quality: number,
  bgColor: string,
  format: 'jpeg' | 'png' | 'webp'
): Promise<{ dataUrl: string; sizeBytes: number }> {

  // 1. Load source image into HTMLImageElement
  // 2. Create off-screen canvas at preset.widthPx × preset.heightPx
  // 3. Fill canvas with bgColor (important for transparent PNGs)
  // 4. If completedCrop is null: compute center-crop
  //    - srcRatio = img.width / img.height
  //    - dstRatio = preset.widthPx / preset.heightPx
  //    - Crop sides if srcRatio > dstRatio, crop top/bottom otherwise
  // 5. ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outW, outH)
  // 6. canvas.toDataURL(`image/${format}`, quality)
  // 7. Estimate file size from base64 length: bytes ≈ base64.length * 0.75

  // Returns { dataUrl, sizeBytes }
}
```

**Important:** Use `OffscreenCanvas` where available for performance. Fall back to a regular `<canvas>` element for Safari compatibility.

---

## 10. i18n Keys

### `messages/bn.json` (Bangla — default)

### `messages/en.json` (English)

---

## 11. Theme / Design Tokens

```typescript
// tailwind.config.ts — extend with BD brand colors
colors: {
  brand: {
    green: {
      DEFAULT: '#006A4E',  // Bangladesh flag green
      light:   '#e6f4f0',
      mid:     '#00855f',
      dark:    '#004d39',
    },
    red: '#F42A41',        // Bangladesh flag red (accent only)
  }
}

// Default font stacks
fontFamily: {
  sans:   ['Inter', 'system-ui', 'sans-serif'],
  bangla: ['Hind Siliguri', 'Nirmala UI', 'Vrinda', 'system-ui'],
}
```

**UI rules:**
- Primary action color: `brand.green` (`#006A4E`)
- Destructive / warning: standard red
- All cards: white background, `border border-gray-200 rounded-xl`
- No heavy drop shadows — use `shadow-sm` at most
- Bangla text always uses `font-bangla` class
- Smooth transitions on interactive elements: `transition-all duration-200`

---

## 12. `next.config.ts`

```typescript
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n.ts')

const nextConfig: NextConfig = {
  output: 'export',           // Static export — no server
  trailingSlash: true,
  images: {
    unoptimized: true,        // Required for static export
  },
}

export default withNextIntl(nextConfig)
```

---

## 13. Middleware & i18n Config

```typescript
// src/middleware.ts
import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['bn', 'en'],
  defaultLocale: 'bn',
})

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
}
```

```typescript
// src/i18n.ts
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`../messages/${locale}.json`)).default,
}))
```

---

## 14. SEO & Metadata

- Title template: `{page} | পাসপোর্ট ছবি` (Bangla) / `{page} | BD Passport Photo` (English)
- Open Graph image: 1200×630 px, stored in `/public/og-image.png`
- Canonical URL: `https://bdpassportphoto.com` (placeholder)
- `robots.txt`: Allow all
- `sitemap.xml`: Auto-generated via `next-sitemap`
- Structured data: `WebApplication` schema for the tool page

---

## 15. Key Constraints & Decisions

| Decision | Rationale |
|---|---|
| Static export (no SSR) | Zero server cost, works on Vercel free tier forever |
| No image upload to server | Privacy — users are sensitive about ID photos |
| Canvas API over Sharp/Jimp | Sharp is Node-only; Canvas runs natively in browser |
| Bangla as default locale | Primary audience is Bangladeshi; feels native |
| Zustand over Redux/Context | Minimal boilerplate, works perfectly with static export |
| react-image-crop | Lightweight, no canvas dependency, good mobile UX |
| browser-image-compression | Handles JPEG quality + WEBP output in-browser |
| shadcn/ui over MUI/Chakra | Tailwind-native, no runtime, easy to customize to brand |

---

## 16. Claude Code Instructions

When building this project, follow these rules:

1. **Always use TypeScript** — no `any` types, use proper interfaces.
2. **i18n everything** — never hardcode user-facing strings; always use `useTranslations()`.
3. **No server-side image logic** — all processing must be in `src/lib/imageProcessor.ts` using Canvas API, callable from client components only.
4. **Mark client components explicitly** — any component using `useState`, `useEffect`, drag events, or Canvas must have `'use client'` at the top.
5. **Zustand store is the single source of truth** — don't duplicate state in component `useState` for anything related to the image or settings.
6. **Mobile-first CSS** — use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`), design for 375px width first.
7. **Accessibility** — all interactive elements need proper `aria-label` attributes; image previews need `alt` text.
8. **Error boundaries** — wrap the main converter in an `<ErrorBoundary>` to catch Canvas failures gracefully.
9. **Test the full pipeline** — after building `imageProcessor.ts`, verify output for: JPEG, PNG with transparency, WEBP, and very large source images (>8 MP).
10. **Keep bundle lean** — run `next build` and check bundle size; `browser-image-compression` and `react-image-crop` are the only heavy deps allowed.

---

*Last updated: Planning phase — architecture finalized, ready for implementation.*