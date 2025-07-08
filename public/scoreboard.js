dateFrom = 20250303;
dateTo = 20250304;

async function fetchScoreboard() {
    try {
        const response = await fetch(`/api/scoreboard?dateFrom=${dateFrom}&dateTo=${dateTo}`);
        const games = await response.json();

        const container = document.getElementById('scoreboard');
        container.innerHTML = '';

        if (games.length === 0) {
            container.textContent = 'No games found.';
            return;
        }

        games.forEach(game => {
            const competition = game.competitions[0];
            const status = competition.status.type.description;
            const home = competition.competitors.find(t => t.homeAway === 'home');
            const away = competition.competitors.find(t => t.homeAway === 'away');
            const location = competition.neutralSite ? 'vs.' : '@';
            const title = `${home.team.name} ${location} ${away.team.name}`;

            // Function to format period scores as "Q1: 25, Q2: 30, ..."
            function formatPeriods(team) {
                if (!team.linescores) return 'No period scores available';
                return team.linescores
                    .map((period) => `${period.displayValue} `)
                    .join('');
            }

            const gameEl = document.createElement('div');
            gameEl.className = 'game';
            gameEl.innerHTML = `
                <div><strong>${title}</strong></div>
                
                <div class="team ${home.winner ? 'winner' : ''}">
                    <img src="${home.team.logo}" alt="${home.team.displayName} logo" class="team-logo" />
                    <span class="team-name">${home.team.abbreviation}</span>
                    <span class="period-scores">${formatPeriods(home)}</span>
                    <span class="total-score">${home.score}</span>
                </div>

                <div class="team ${away.winner ? 'winner' : ''}">
                    <img src="${away.team.logo}" alt="${away.team.displayName} logo" class="team-logo" />
                    <span class="team-name">${away.team.abbreviation}</span>
                    <span class="period-scores">${formatPeriods(away)}</span>
                    <span class="total-score">${away.score}</span>
                </div>
                `;

            container.appendChild(gameEl);
        });

    } catch (err) {
        document.getElementById('scoreboard').textContent = 'Failed to load scoreboard.';
        console.error(err);
    }
}

fetchScoreboard();