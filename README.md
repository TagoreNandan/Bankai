# my-app

This project was created with [Better Fullstack](https://github.com/Marve10s/Better-Fullstack), a modern TypeScript stack that combines React, Vite SPA, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **React + Vite** - Client-routed React SPA powered by Vite
- **React Native** - Build mobile apps using React
- **Expo** - Tools for React Native development
- **TailwindCSS** - CSS framework
- **Turborepo** - Optimized monorepo build system

## Getting Started

First, install the dependencies:

```bash
bun install
```

Then, run the development server:

```bash
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to see the web application.
Use the Expo Go app to run the mobile application.

## Project Structure

```
my-app/
├── apps/
│   ├── web/         # Frontend application (React + Vite SPA)
│   ├── native/      # Mobile application (React Native, Expo)
```

## Available Scripts

- `bun run dev`: Start all applications in development mode
- `bun run build`: Build all applications
- `bun run dev:web`: Start only the web application
- `bun run check-types`: Check TypeScript types across all apps
- `bun run dev:native`: Start the React Native/Expo development server
