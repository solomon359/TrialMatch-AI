# TrialMatch AI

TrialMatch AI is a clinical trial matching dashboard built with Next.js, React, and TypeScript. It is designed as a prescreening support tool for helping clinical teams review patients, monitor matching activity, and identify missing data that may affect trial eligibility workflows.

## Overview

The application provides a modern enterprise-style dashboard for clinical trial operations. It surfaces key operational metrics such as total patients, active trials, pending reviews, and matches created today. It also highlights recent matches and missing data tasks so teams can quickly follow up on records that need attention.

> **Clinical Decision Support Disclaimer**  
> TrialMatch AI is a prescreening support tool. It does not make eligibility determinations. All matches require independent clinical review.

## Features

- Dashboard with high-level trial matching metrics
- Recent matches table with patient, trial NCT ID, score, status, and date
- Missing data task list with priority indicators
- Clinical decision support disclaimer banner
- Clean, responsive UI built with Next.js App Router and TypeScript

## Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- ESLint

## Project Structure

- `src/app` — application routes and layouts
- `src/components` — reusable UI and layout components
- `src/lib` — API helpers, data utilities, and shared types
- `public` — static assets

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
```

### Start the production server

```bash
npm start
```

### Lint the project

```bash
npm run lint
```

## Usage

After starting the app, the dashboard shows:

- summary statistics for patients, trials, reviews, and daily matches
- a recent matches table for reviewing trial-patient alignment
- missing data tasks that may need follow-up before final review

## Notes

- The repository is set up as a Next.js application using the App Router.
- The interface uses a shared sidebar and top bar layout.
- If this project is connected to mock or live data sources, document the expected environment variables in a future update.

## Contributing

1. Create a branch for your change.
2. Make your updates.
3. Run `npm run lint` and `npm run build` before opening a pull request.
4. Submit a PR with a clear description of the change.

## License

Add a license file if you intend to distribute or open source this project more broadly.
