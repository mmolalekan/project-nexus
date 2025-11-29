# Qurbaan Frontend — Next.js

Qurbaan streamlines the journey from farm to fork, offering an innovative e-commerce platform where users can easily purchase high-quality beef shares. By cutting out unnecessary middlemen, it ensures fair and transparent pricing and provides convenient delivery options for all users' needs.

This is the frontend for **Qurbaan**, built with **Next.js (App Router)**.
Follow the guide below to run the project locally.

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/mmolalekan/project-nexus.git
```

### 2. Enter the frontend directory

```bash
cd project-nexus/frontend
```

### 3. Install dependencies

```bash
npm install
# npm install --legacy-peer-deps # if you encounter dependency issues
```

---

## Environment Variables

Create a file named **.env.local** in the `frontend` folder.

Paste the following:

```bash
# Backend API Base URLs
LOCALHOST=<backend-dev-url>
PRODUCTION=<backend-prod-url>
NEXT_PUBLIC_API_BASE_URL=$LOCALHOST # Switch to $PRODUCTION for production
```

---

## Run the Development Server

Start the server:

```bash
npm run dev
```

You should see:

```
> Local:   http://localhost:300x/
> Network: http://192.168.x.x:300x/
```

---

## View in Browser

Open:

```
http://localhost:3000 (or the port shown in terminal output)
```

---

## Scripts

```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run start   # Start production server
npm run lint    # Lint code
```
