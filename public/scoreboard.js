const container = document.getElementById('scoreboard');
const dateInput = document.getElementById('selectedDate');

function formatPeriods(team) {
    if (!team.linescores) return 'No period scores';
    return team.linescores.map(p => p.displayValue).join('   ');
}

async function loadScores(dateStr) {
    container.innerHTML = '<p style="text-align:center;">Loading...</p>';

    try {
        const res = await fetch(`/api/scoreboard?dateFrom=${dateStr}&dateTo=${dateStr}`);
        const games = await res.json();

        if (games.length === 0) {
            container.innerHTML = '<p style="text-align:center; color:#777;">No games found for selected date.</p>';
            return;
        }

        container.innerHTML = ''; // clear container

        games.forEach(game => {
            const competition = game.competitions[0];
            const home = competition.competitors.find(t => t.homeAway === 'home');
            const away = competition.competitors.find(t => t.homeAway === 'away');
            const location = competition.neutralSite ? 'vs.' : '@';
            const title = `${home.team.name} ${location} ${away.team.name}`;

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

                <a href="#" class="boxscore-link" data-game-id="${competition.id}">Boxscore</a>
                `;

            container.appendChild(gameEl);
            const boxscoreLink = gameEl.querySelector('.boxscore-link');
            boxscoreLink.addEventListener('click', (e) => {
                e.preventDefault();
                const gameId = e.target.getAttribute('data-game-id');
                window.parent.postMessage({ type: 'loadBoxscore', gameId }, '*');
            });
        });

    } catch (err) {
        container.innerHTML = '<p style="text-align:center; color:red;">Failed to load scores.</p>';
    }
}

// Initialize date input to today’s date
const today = moment('2025-06-22');
dateInput.value = today.format('YYYY-MM-DD');

loadScores(today.format('YYYYMMDD'));

// Button handlers for increment/decrement day
document.getElementById('prevDay').addEventListener('click', () => {
    const currentDate = moment(dateInput.value);
    currentDate.subtract(1, 'day');
    dateInput.value = currentDate.format('YYYY-MM-DD');
    const formatted = dateInput.value.replace(/-/g, '');
    loadScores(formatted);
});

document.getElementById('nextDay').addEventListener('click', () => {
    const currentDate = moment(dateInput.value);
    currentDate.add(1, 'day');
    dateInput.value = currentDate.format('YYYY-MM-DD');
    const formatted = dateInput.value.replace(/-/g, '');
    loadScores(formatted);
});

// Load button to reload for selected date manually
document.getElementById('loadScores').addEventListener('click', () => {
    const selected = dateInput.value;
    if (!selected) {
        alert('Please select a date.');
        return;
    }
    const formatted = selected.replace(/-/g, '');
    loadScores(formatted);
});
