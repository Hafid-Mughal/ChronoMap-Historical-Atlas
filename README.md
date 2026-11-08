# ChronoMap: Interactive Historical World Atlas

Explore world history and geopolitical borders from 3000 BCE to the present day on an interactive map.

## Features

- **Timeline scrubber:** move through history year by year and watch borders, rulers and empires change
- **Historical atlas:** empire and region borders, sub-regions and archaeological sites
- **Conflict zones:** active and historical conflicts shown on the map
- **Year snapshots:** a summary of the world in any chosen year
- **Physical Geography:** see what the world looks physically
- **Historical sites:** under the history of ancient ruins and archeological sites
- **Search:** find leaders, places and events

## Tech stack

React, TypeScript, Vite, Tailwind CSS, D3-geo, Express, and the Google Gemini API.

## Run locally

**Prerequisites:** [Node.js](https://nodejs.org/)

1. Install dependencies:
   ```
   npm install
   ```
2. Create a file named `.env.local` in the project folder (see `.env.example`) and add your Gemini API key:
   ```
   GEMINI_API_KEY="your-key-here"
   ```
3. Start the app:
   ```
   npm run dev
   ```
4. Open http://localhost:3000

## Deploy

The project includes a Netlify config (`netlify.toml`). Set `GEMINI_API_KEY` as an environment variable in your Netlify site settings. Never commit your key to the repository.
