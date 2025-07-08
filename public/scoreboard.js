const container = document.getElementById('scoreboard');
const dateInput = document.getElementById('selectedDate');

function formatPeriods(team) {
    if (!team.linescores) return 'No period scores';
    return team.linescores.map(p => p.displayValue).join('   ');
}

// Format Date object as YYYYMMDD string for ESPN API
function formatDateYYYYMMDD(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}${m}${d}`;
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
            const status = competition.status.type.description;
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
                `;

            container.appendChild(gameEl);
        });

    } catch (err) {
        container.innerHTML = '<p style="text-align:center; color:red;">Failed to load scores.</p>';
    }
}

// Initialize date input to today’s date
const today = new Date();
dateInput.value = today.toISOString().slice(0, 10);

// Load scores for initial date (today)
loadScores(formatDateYYYYMMDD(today));

// Button handlers for increment/decrement day
document.getElementById('prevDay').addEventListener('click', () => {
    const currentDate = new Date(dateInput.value);
    currentDate.setDate(currentDate.getDate() - 1);
    dateInput.value = currentDate.toISOString().slice(0, 10);
    loadScores(formatDateYYYYMMDD(currentDate));
});

document.getElementById('nextDay').addEventListener('click', () => {
    const currentDate = new Date(dateInput.value);
    currentDate.setDate(currentDate.getDate() + 1);
    dateInput.value = currentDate.toISOString().slice(0, 10);
    loadScores(formatDateYYYYMMDD(currentDate));
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
