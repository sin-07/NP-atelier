# ✿ Atelier NP - Premium Handmade Marketplace

A boutique handmade marketplace web application designed for artisan drops, bespoke crafts, jewelry, home decor, clean DIY beauty rituals, and interactive studio customization.

Built with **Next.js App Router**, **React 19**, **Tailwind CSS**, **Framer Motion**, and **Lucide Icons**.

---

## ✨ Features

- **🌸 Curated Boutique Catalog**: Filter by categories (Handmade Jewelry, DIY Home Decor, Beauty DIY Products, Cute Accessories).
- **🎨 Interactive Custom Craft Studio**: Customize materials, gemstones, scents, engraving text, and preview price dynamically.
- **🛍️ Cart & Checkout Flow**: Full drawer cart, coupon code validation (`ATELIER10`, `HANDMADE20`), address form, order summary, and toast notifications.
- **❤️ Wishlist**: Quick save favorites and manage your wishlist anytime.
- **🔍 Quick Search**: Global search overlay with keyboard shortcut (`⌘K` / `Ctrl+K`).
- **🏬 Sell Your Craft Modal**: Instant creator listing submission with price, category, and photo fields.
- **👩‍💼 Admin & Operations Console**: Manage product catalog, toggle availability, edit prices, view analytics and orders at `/admin`.
- **⚡ Responsive & Animated**: Powered by Framer Motion micro-interactions, glassmorphism UI, smooth scroll, and floating Back-to-Top.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## 📂 Project Structure

```
├── public/                 # Static assets & SVG icons
├── src/
│   ├── app/                # Next.js App Router (Home & /admin console)
│   ├── assets/             # Images & static media
│   ├── components/         # Reusable UI components & modals
│   ├── context/            # Marketplace state & localStorage context
│   ├── data/               # Product database & mock categories
│   ├── hooks/              # Custom React hooks (scroll reveal, etc.)
│   ├── utils/              # Helper functions & fallbacks
│   └── index.css           # Design tokens, keyframes & Tailwind utilities
├── tailwind.config.js      # Tailwind color palette & font definitions
└── package.json
```

---

## 📄 License
MIT © 2026 Atelier NP Handmade Marketplace
