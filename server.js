import express from 'express';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

// This server is for local development only.
// Vercel uses /api/scoreboard.js as a serverless function instead.
const app = express();
const PORT = 3000;

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API route
app.get('/api/teams', async (req, res) => {
  try {
    const response = await axios.get(
      'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams'
    );
    const teams = response.data?.sports?.[0]?.leagues?.[0]?.teams || [];
    res.json(teams.map(t => ({
      id: t.team.id,
      name: t.team.displayName,
      abbreviation: t.team.abbreviation,
      logo: t.team.logos?.[0]?.href || ''
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

app.get('/api/scoreboard', async (req, res) => {
  var dateFrom = req.query.dateFrom;
  var dateTo = req.query.dateTo;
  try {
      const response = await axios.get(
        `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${dateFrom}-${dateTo}`
      );
      const games = response.data?.events || [];
      res.json(games);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch scoreboard' });
    }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
