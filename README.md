# 🇧🇩 Passport Image Editor

A **free, serverless, client-side-only** web application for Bangladeshi users to convert any photo into a government-standard passport or visa photo — and clean up handwritten signatures for online forms. No image ever leaves the user's device.

**Live at →** _your Vercel URL here_

---

## Features

### Passport Photo
- Drag & drop or click-to-upload (JPG, PNG, WEBP)
- Auto centre-crop to the correct aspect ratio
- Manual crop adjustment with aspect-locked handles
- Rotate image 90° left / right
- Output presets: BD Standard (35×45 mm, 300 DPI), US Passport, EU/Schengen, India Visa, UK Passport
- Quality slider (40–100 %), format selector (JPEG / PNG / WEBP), background colour picker
- Live file-size estimate with over-limit warning

### Signature Converter
- Upload a photo of your handwritten signature
- Free-form crop to isolate the signature area
- Rotate image before processing
- Ink threshold slider — separates dark ink from background automatically
- Smart paper-edge detection: ignores notebook bindings, dark tables, and coloured covers
- Letterboxes cleaned signature into standard BD dimensions (300×80 px, others available)
- Download as JPEG or PNG

### General
- **Fully Bangla UI** (default) with English toggle
- Animated intro splash screen (shown once per session)
- Bangladesh flag SVG favicon
- Responsive — designed for 375 px mobile first
- FAQ, About, and Contact pages
- Zero server calls — all processing runs in the browser via the Canvas API

---

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router, `output: 'export'`) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| State | Zustand |
| i18n | Native Next.js `[lang]` routing + JSON dictionaries |
| Cropping UI | react-image-crop v11 |
| Icons | Lucide React |
| Fonts | Inter + Hind Siliguri (via `next/font/google`) |
| Deployment | Vercel (static CDN, no serverless functions) |

---

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app redirects to `/bn/` (Bangla) by default.

```bash
# Production build (outputs to /out)
npm run build

# Type-check only
npx tsc --noEmit
```

---

## Project Structure

```
bd-passport-photo/
├── app/
│   ├── [lang]/
│   │   ├── layout.tsx          # Locale layout — fonts, splash screen
│   │   ├── page.tsx            # Main converter page
│   │   ├── dictionaries.ts     # getDictionary, hasLocale, Locale types
│   │   ├── faq/page.tsx
│   │   ├── about/page.tsx
│   │   └── contact/page.tsx
│   ├── globals.css             # Tailwind @theme, custom keyframes
│   ├── icon.svg                # Bangladesh flag favicon (auto-linked by Next.js)
│   └── layout.tsx              # Root layout
│
├── components/
│   ├── layout/                 # Header (mobile menu), Footer, LanguageSwitcher
│   ├── upload/                 # UploadZone (drag-and-drop, hero section)
│   ├── editor/                 # ImageCropper, SettingsPanel, PreviewCard
│   ├── download/               # DownloadSection
│   ├── signature/              # SignatureConverter, SignatureCropper, SignatureSettings, SignaturePreview
│   ├── faq/                    # FaqAccordion (animated accordion)
│   ├── ConverterTabs.tsx       # Photo / Signature tab switcher
│   ├── PhotoConverter.tsx      # Photo flow orchestrator
│   ├── RotateBar.tsx           # Shared 90° rotation controls
│   ├── SplashScreen.tsx        # Animated intro (shown once per session)
│   └── ErrorBoundary.tsx
│
├── lib/
│   ├── imageProcessor.ts       # Passport photo Canvas pipeline
│   ├── signatureProcessor.ts   # Signature binarisation + paper-edge detection
│   ├── rotateImage.ts          # 90° / 180° canvas rotation
│   ├── presets.ts              # Photo size presets
│   ├── signaturePresets.ts     # Signature size presets
│   └── utils.ts                # cn(), formatBytes()
│
├── store/
│   ├── usePhotoStore.ts        # Zustand store — photo pipeline state
│   └── useSignatureStore.ts    # Zustand store — signature pipeline state
│
└── messages/
    ├── bn.json                 # Bangla translations (default locale)
    └── en.json                 # English translations
```

---

## How It Works

### Passport Photo Pipeline
1. `FileReader` converts the uploaded file to a data URL stored in Zustand
2. `react-image-crop` shows the image with an aspect-locked crop handle
3. On "Process & Preview", the `imageProcessor` draws the crop region from the source image onto an off-screen canvas at the preset's pixel dimensions, fills the background, and exports as JPEG/PNG/WEBP
4. The result data URL is stored in Zustand; the download button creates a temporary `<a>` element

### Signature Pipeline
1. Upload → rotate → free-form crop (all stored in Zustand as a `PercentCrop`)
2. The `signatureProcessor` draws only the selected crop region to a work canvas, binarises with a luminance threshold, then runs a **paper-edge detection** pass: it scans inward from each edge looking for the column/row where the dark density drops below 40 % (the paper boundary). The ink bounding box is then computed only within the paper region — excluding notebook bindings, dark tables, and photo borders regardless of their width
3. The cleaned bounding box is letterboxed into the preset dimensions (e.g. 300×80 px) on a white canvas

### Privacy
No image data is ever sent over the network. The only network requests this app makes are loading the static HTML/CSS/JS bundle and Google Fonts.

---

## Deployment

The app is configured for Vercel static hosting (`output: 'export'`):

```bash
# Deploy via Vercel CLI
npx vercel --prod
```

Or connect the GitHub repository in the [Vercel dashboard](https://vercel.com/new) — zero configuration needed.

---

## Contributing

Pull requests are welcome. For major changes please open an issue first.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push and open a PR

---

## Author

**Ahsanul Haque**
LinkedIn → [linkedin.com/in/ahsan-sium](https://www.linkedin.com/in/ahsan-sium/)

---

## License

MIT — free to use, modify, and distribute.
