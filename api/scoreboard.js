const axios = require('axios');

export default async function handler(req, res) {
    console.log('Request query:', req.query);
    const { dateFrom, dateTo } = req.query;

    if (!dateFrom || !dateTo) {
        return res.status(400).json({ error: 'Missing dateFrom or dateTo' });
    }

    try {
        const response = await axios.get(
            `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${dateFrom}-${dateTo}`
        );

        const games = response.data?.events || [];
        res.status(200).json(games);
    } catch (err) {
        console.error('API fetch error:', err.message);
        res.status(500).json({ error: 'Failed to fetch scoreboard' });
    }
}