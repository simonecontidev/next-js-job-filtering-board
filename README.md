# 🧩 Next.js Job Filtering Board

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![MUI](https://img.shields.io/badge/MUI-6.0-007FFF?logo=mui)](https://mui.com/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11.0-EF007B?logo=framer)](https://www.framer.com/motion/)
[![Deployed on Vercel](https://img.shields.io/badge/Live%20Demo-Vercel-black?logo=vercel)](https://next-job-board.vercel.app)

---

## 🌐 Live Demo & Preview

🎯 **Live:** [https://next-job-board.vercel.app](https://next-job-board.vercel.app)  
🖼️ **Preview:**

![Job Filtering Board Preview](public/preview.jpg)

---

A modern **interactive job board** built with **Next.js 15**, **TypeScript**, **MUI**, **Framer Motion**, and **local state persistence**.  
It demonstrates clean UI architecture, advanced filter management, and smooth motion design — perfect for showcasing React + UX skills.

> 🧑‍💻 Built by [Simone Conti](https://simoneconti.work) — front-end developer blending design and technology.

---

## ✨ Features

### 🎯 Filtering & State

- Multi-criteria job filtering: **role, level, contract, tags, search, featured/new**  
- Instant updates with derived options (auto-populate filter lists)  
- URL-synced filters → shareable links (`?role=frontend&remote=true`)  
- Persistent filters via `localStorage`  
- Quick **Reset** to defaults  

---

### 💾 Persistence & Sharing

- Filter state stored in both **URL** and **localStorage**  
- “Copy share link” → instantly share your current filter setup  

---

### 💖 Favorites & History

- Save interesting jobs locally (heart icon)  
- Persistent **favorites list** in `localStorage`  
- **Recent searches** dropdown (auto-saved last 5 URLs)  

---

### 🌗 Theming

- Full **dark/light theme toggle**  
- Accent color system (tropical aqua / neutral)  
- Syncs to OS color scheme (`prefers-color-scheme`)  

---

### 🪄 Animations & Motion Design

- **Framer Motion** staggered fade-in + slide-up transitions for job cards  
- **AnimatePresence** fade-out when filters change  
- Sticky header that **compacts smoothly** on scroll (animated padding + shadow)  
- Animated numeric counter for result count  

---

### 🌴 UX Details

- Friendly empty & error states  
  _“Nessun risultato — prova a rimuovere 1 filtro 🌴”_  
- Loading and retry feedback with exponential backoff  
- Accessible interactions (keyboard navigation, aria labels)  
- Responsive grid, optimized for both desktop and mobile  

---

## 🛠️ Tech Stack

| Layer | Tools |
|-------|-------|
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) |
| **Language** | TypeScript |
| **UI Library** | [Material UI (MUI)](https://mui.com/) |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) |
| **State Management** | React Hooks + Context |
| **Data** | Static JSON (`/data/data.json`) |
| **Styling** | MUI SX System + dark/light variables |
| **Persistence** | URL search params + localStorage |

---

## 🧠 Architecture

```bash
src/
├─ app/
│  ├─ layout.tsx            # Root layout with ThemeProvider
│  └─ page.tsx              # Main Job Filtering page
│
├─ components/
│  ├─ JobListing.tsx        # Single job card + favorite icon
│  └─ ThemeToggle.tsx       # Dark/Light toggle button
│
├─ hooks/
│  ├─ useUrlPersist.ts      # Sync filters with URL + storage
│  └─ useRetryFetch.ts      # Robust fetch with retry + cache
│
└─ state/
   ├─ useFilters.ts         # Global filter state hook
   ├─ useFavorites.ts       # Local favorites management
   └─ useRecentSearches.ts  # Recent query history
```
---

## Getting Started
# 1. Clone the repo
git clone https://github.com/simonecontidev/next-js-job-filtering-board.git
cd next-js-job-filtering-board

# 2. Install dependencies
npm install

# 3. Run the app
npm run dev

# 4. Open in browser
http://localhost:3000

---

## Design Philosophy

“A fast interface can still feel calm.”

	•	Focus: clarity, responsiveness, and discoverability
	•	Aesthetic: neutral palette with tropical accent
	•	Goal: empower quick exploration with zero friction
	•	Tone: clean, calm, professional
	•	Influence: Linear, Dribbble Job Boards, tropical minimalism

---

## License

MIT License — free to use, fork, and adapt for educational or portfolio purposes.

⸻

“Search less. Discover more. Stay in flow.” 🧩

