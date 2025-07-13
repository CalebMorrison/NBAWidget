document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get("gameId");

    const detailsContainer = document.getElementById("game-details");

    if (!gameId) {
        detailsContainer.textContent = "No game ID provided.";
        return;
    }

    try {
        const res = await fetch(`/api/game?gameId=${gameId}`);
        const game = await res.json();
        const teams = game.boxscore.teams;
        const homeTeam = teams.find(t => t.homeAway === 'home');
        const awayTeam = teams.find(t => t.homeAway === 'away');

        const boxscore = game.boxscore.players;
        const homeBoxscore = boxscore.find(t => t.team.displayName === homeTeam.team.displayName);
        const awayBoxscore = boxscore.find(t => t.team.displayName === awayTeam.team.displayName);

        const competitors = game.header.competitions[0].competitors;
        const gameInfoHome = competitors.find(t => t.homeAway === 'home');
        const gameInfoAway = competitors.find(t => t.homeAway === 'away');

        const homeStats = homeBoxscore.statistics[0];
        const awayStats = awayBoxscore.statistics[0];

        const headers = homeStats.labels;

        const renderTeamTable = (teamName, stats) => {
            if (!stats || !stats.athletes || stats.athletes.length === 0) {
                return `<div class="boxscore-card"><p>No stats available.</p></div>`;
            }

            const headerRow = `<tr>${['Player', ...headers].map(h => `<th>${h}</th>`).join('')}</tr>`;

            const rows = stats.athletes.map(player => {
                if(player.didNotPlay === false) {
                    const statCells = player.stats.map(stat => `<td>${stat}</td>`).join('');
                    return `<tr><td>${player.athlete.displayName}</td>${statCells}</tr>`;
                }
            }).join('');

            const totalRow = `
                <tr class="team-totals">
                    <td><strong>Team Totals</strong></td>
                    ${stats.totals.map(stat => `<td><strong>${stat}</strong></td>`).join('')}
                </tr>
            `;

            return `
                <div class="boxscore-card">
                    <table class="boxscore-table">
                        <thead>
                            <tr class="team-name-row">
                                <th colspan="${headers.length + 1}" class="team-header">${teamName}</th>
                            </tr>
                            ${headerRow}
                        </thead>
                        <tbody>
                            ${rows}
                            ${totalRow}
                        </tbody>
                    </table>
                </div>
            `;
        };

        detailsContainer.innerHTML = `
            <div class="boxscore-row">
                ${renderTeamTable(homeBoxscore.team.displayName, homeStats)}
                ${renderTeamTable(awayBoxscore.team.displayName, awayStats)}
            </div>
            `;
    } catch (err) {
        detailsContainer.textContent = "Failed to load game data.";
        console.error(err);
    }
});
