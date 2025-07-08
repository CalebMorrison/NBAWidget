const axios = require('axios');

export default async function handler(req, res) {
  const dateFrom = req.query.dateFrom;
  const dateTo = req.query.dateTo;

  try {
    const response = await axios.get(
      `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${dateFrom}-${dateTo}`
    );
    const games = response.data?.events || [];
    res.status(200).json(games);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch scoreboard' });
  }
}