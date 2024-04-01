# google-search

This repository is an experimental project for understanding web scraping better.
The project is a simple web app that allows users to input a search query and search through Google. The app is built with Next.js, TypeScript, PostgreSQL, Tailwind CSS and RabbitMQ.

The project is split into 2 sub-repositories, one for backend and one for frontend.

## Backend

The backend is built with Next.js and written in TypeScript. It uses PostgreSQL as its database and RabbitMQ as its message queue.

To run the backend locally:

1. Install dependencies: `npm install`
2. Create a PostgreSQL database: `createdb google-search-backend`
3. Run the development server: `npm run dev`

The backend will be available at `http://localhost:8000`.

## Frontend

The frontend is built with Next.js and written in TypeScript. It uses Tailwind CSS for styling.

To run the frontend locally:

1. Install dependencies: `npm install`
2. Run the development server: `npm run dev`

The frontend will be available at `http://localhost:3000`.

You can deploy the frontend by visiting the Vercel deployment at https://search.vongphachan.com.
