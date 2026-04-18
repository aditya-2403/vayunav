# VayuNav | Indian Aeronautical Charts Dashboard ✈️

VayuNav is a state-of-the-art aeronautical charts dashboard designed for pilots, dispatchers, and aviation enthusiasts. It provides an immersive, high-tech interface for accessing real-time ICAO-standard charts (ADC, SID, STAR, and Approach procedures) directly from the Airports Authority of India (AAI) eAIP.

![VayuNav Social Preview](https://github.com/aditya-2403/vayunav/raw/main/frontend/public/og-image.png)

## 🌐 Features

- **Automated eAIP Scraping**: Utilizes Puppeteer to navigate and extract PDF links from complex, legacy eAIP frameset structures.
- **Intelligent Category Mapping**: Automatically groups charts into standard aviation categories (GROUND, SIDs, STARs, APPROACHES).
- **Firebase Caching**: Implements a Firestore caching layer to ensure high performance and avoid redundant scraping or IP rate-limiting.
- **Inline Datalink Viewer**: Side-by-side console view allowing for seamless PDF viewing via a custom backend proxy that bypasses `X-Frame-Options`.
- **Modern Dark-Neon UI**: A premium, glassmorphism-based interface built with Mantine UI, featuring smooth Framer Motion animations and live UTC telemetry.
- **Mobile Optimized**: Fully responsive layout with a dedicated mobile "Open Console" workflow.

## 🛠️ Tech Stack

### Backend
- **Node.js & Express**: Core API server.
- **Puppeteer**: Headless browser automation for data extraction.
- **Firebase Admin**: NoSQL data persistence and caching.
- **Nodemon**: For high-velocity local development.

### Frontend
- **React.js (Vite)**: Modern, high-performance UI framework.
- **Mantine UI**: Comprehensive component library for a polished look.
- **Framer Motion**: Production-ready animations.
- **Tabler Icons**: Consistent, high-quality iconography.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- A Google Firebase Project (Firestore enabled)

### Installation

1. **Clone the Repo**
   ```bash
   git clone https://github.com/aditya-2403/vayunav.git
   cd vayunav
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create a .env file based on .env.example with your Firebase credentials
   node server.js
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   # Create a .env file based on .env.example
   npm run dev
   ```

## 📁 Project Structure

```text
VayuNav/
├── backend/
│   ├── data/      (Static airport registries)
│   ├── routes/    (Scraper and Proxy endpoints)
│   ├── services/  (Puppeteer and Firebase logic)
│   └── utils/     (Data parsing and categorizers)
└── frontend/
    ├── public/    (Asset hosting and SEO assets)
    └── src/
        ├── components/ (Modular UI layout logic)
        ├── hooks/      (Async data fetchers)
        └── services/   (Centralized API client)
```

## ⚠️ Disclaimer

Aeronautical charts and data displayed in VayuNav are organically sourced from the **Airports Authority of India (AAI)**. This application is an independent interface and is **not** an official AAI service. Always verify critical flight information with official sources during flight planning.

---
Developed by **VayuNav Team** | Built for the future of Indian Aviation.
