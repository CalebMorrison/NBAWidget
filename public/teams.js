fetch('/api/teams')
  .then(res => res.json())
  .then(teams => {
    const list = document.getElementById('teamsList');
    list.innerHTML = '';
    teams.forEach(team => {
      const li = document.createElement('li');
      li.innerHTML = `<img src="${team.logo}" alt="${team.abbreviation}"/> ${team.name}`;
      list.appendChild(li);
    });
  })
  .catch(err => {
    document.getElementById('teamsList').innerText = 'Failed to load teams';
    console.error(err);
  });
