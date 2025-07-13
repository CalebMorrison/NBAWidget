export default async function handler(req, res) {
    console.log('Request query:', req.query);
    const { gameId } = req.query;

    if (!gameId) {
        return res.status(400).json({ error: 'Missing gameId' });
    }

    try {
        const url = `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event=${gameId}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Fetch failed with status ${response.status}`);
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (err) {
        console.error('API fetch error:', err.message);
        res.status(500).json({ error: 'Failed to fetch game' });
    }
}