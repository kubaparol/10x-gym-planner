# 10x Gym Planner

A modern web application that helps users efficiently manage workout plans and track their training progress. The application's standout feature is the ability to convert workout plans from PDF format to an interactive format using artificial intelligence, making it easier to use plans during workouts and monitor progress.

## Project Description

10x Gym Planner solves the common problem of trainers providing workout plans in PDF format, which makes it difficult for clients (especially beginners) to effectively use these plans and track their progress. The application allows users to:

- Convert PDF workout plans to interactive format using AI
- Manually create and manage workout plans
- Track progress for each exercise (weights and repetitions)
- View training history and progress over time
- Access a mobile-friendly interface designed for gym use

## Tech Stack

### Frontend

- [Astro](https://astro.build/) v5.5.5 - Modern web framework for building fast, content-focused websites
- [React](https://react.dev/) v19.0.0 - UI library for building interactive components
- [TypeScript](https://www.typescriptlang.org/) v5 - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) v4.0.17 - Utility-first CSS framework
- [Shadcn/ui](https://ui.shadcn.com/) - Accessible React component library

### Backend

- [Supabase](https://supabase.com/) - Backend-as-a-Service solution providing:
  - PostgreSQL database
  - Authentication system
  - SDK for multiple languages

### AI

- [Openrouter.ai](https://openrouter.ai/) - Access to various AI models for PDF conversion

### Infrastructure

- [GitHub Actions](https://github.com/features/actions) - CI/CD pipelines
- [DigitalOcean](https://www.digitalocean.com/) - Hosting via Docker

### Testing

- **Unit & Integration Tests**

  - [Vitest](https://vitest.dev/) - Fast unit testing framework compatible with Jest
  - [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) - Testing React components
  - [Testing Library for Astro](https://testing-library.com/) - Testing Astro components
  - [MSW](https://mswjs.io/) - Mock Service Worker for API mocking

- **End-to-End Tests**

  - [Playwright](https://playwright.dev/) - Browser automation and E2E testing
  - Playwright Component Testing - Testing components in real browsers

- **Visual & Accessibility Testing**
  - [axe-core](https://github.com/dequelabs/axe-core) - Accessibility testing engine
  - [Percy](https://percy.io/) or [Chromatic](https://www.chromatic.com/) - Visual regression testing
  - [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) - Performance testing

## Getting Started Locally

### Prerequisites

- Node.js v22.14.0 (as specified in `.nvmrc`)
- npm (comes with Node.js)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/kubaparol/10x-gym-planner.git
cd 10x-gym-planner
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier

## Project Scope

### MVP Features

- User account system with profile management
- Manual workout plan creation
- PDF to interactive format conversion using AI
- Basic workout plan browsing (no filtering, sorting, or searching)
- Progress tracking for exercises
- Training history viewing
- Mobile-friendly UI optimized for gym use

### Out of Scope for MVP

- Import formats other than PDF
- Mobile applications (web-only initially)
- Social features
- Paid plans (all features free initially)
- Filtering, sorting, and searching workout plans
- Modifying plans after adding them to the system
- Exercise descriptions, photos, or instructional videos
- Automatic weight progression suggestions
- Export of training data

## Project Status

The project is currently in active development, focusing on implementing the MVP features. We are tracking success metrics including:

- User adoption (75% target for users adding plans weekly)
- PDF conversion success rate (75% target)
- User retention rates
- Average number of workouts per user weekly
- Average time spent in the application during workouts

## License

MIT
