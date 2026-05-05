# Verifi - Frontend Client

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer](https://img.shields.io/badge/Framer-black?style=for-the-badge&logo=framer&logoColor=blue)

The cinematic, dark-themed user interface for the Verifi AI fact-checking platform. Built for speed, deep interactions, and real-time data visualization.

---

## 🛠 Tech Stack

- **React 18** - Component-based UI rendering
- **Vite** - Next-generation, blazing fast frontend tooling
- **TypeScript** - Static typing for scalable development
- **Tailwind CSS** - Utility-first styling (configured with Dark/Light mode via `class` strategy)
- **Framer Motion** - Fluid page transitions and complex animations
- **Lucide React** - Clean and modern SVG iconography

---

## 🚀 Prerequisites & Setup

Ensure you have **Node.js (v18 or higher)** installed. 

1. **Clone the repository and navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```


## 📜 Available Scripts

In the project directory, you can run the following commands:

- `npm run dev`: Starts the Vite development server with Hot Module Replacement (HMR).
- `npm run build`: Compiles the TypeScript code and bundles the application for production into the `dist/` folder.
- `npm run lint`: Runs ESLint to find and fix problems in your code.
- `npm run preview`: Bootstraps a local static web server that serves the files from `dist/` to preview the production build.

---

## 🏗 Project Structure

The codebase is organized modularly to promote reusability and clean architecture:

```text
frontend/
├── public/                 # Static assets (favicon, images, etc.)
├── src/
│   ├── assets/             # Static images and SVGs
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/         # Reusable UI components
│   │   ├── ArchitectureSection.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx
│   │   ├── Navbar.tsx
│   │   ├── ResultsDashboard.tsx
│   │   └── index.ts
│   ├── context/            # Global state context providers
│   │   └── ThemeContext.tsx
│   ├── pages/              # Full page views
│   │   ├── DashboardPage.tsx
│   │   ├── HistoryPage.tsx
│   │   ├── HowItWorksPage.tsx
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── SavedEvidencePage.tsx
│   │   ├── SettingsPage.tsx
│   │   └── VerifyPage.tsx
│   ├── App.css             # Root component styles
│   ├── App.tsx             # Root component and React Router setup
│   ├── index.css           # Global CSS and Tailwind directives
│   └── main.tsx            # React DOM entry point
├── index.html              # Main HTML template
├── package.json
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

