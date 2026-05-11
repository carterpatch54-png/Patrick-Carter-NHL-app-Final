let allPlayers = [];

async function loadPlayers() {
    const response = await fetch("/players");
    const players = await response.json();

    allPlayers = players;
    displayPlayers(players);
}

function displayPlayers(players) {
    const table = document.getElementById("playerTable");
    table.innerHTML = "";

    players.forEach(player => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${player.player}</td>
            <td>${player.season}</td>
            <td>${player.team}</td>
            <td>${player.position}</td>
            <td>${player.games_played}</td>
            <td>${player.goals}</td>
            <td>${player.assists}</td>
            <td>${player.points}</td>
            <td>${player.plus_minus}</td>
        `;

        table.appendChild(row);
    });
}

async function loadLeaders() {
    const stat = document.getElementById("statSelect").value;
    const response = await fetch(`/leaders/${stat}`);
    const leaders = await response.json();

    const leaderCards = document.getElementById("leaderCards");
    const leaderTitle = document.getElementById("leaderTitle");

    leaderCards.innerHTML = "";
    leaderTitle.textContent = "Top 5: " + stat.replace("_", " ").toUpperCase();

    leaders.forEach((player, index) => {
        let statValue = "";

        if (stat === "goals") statValue = player.goals;
        if (stat === "assists") statValue = player.assists;
        if (stat === "points") statValue = player.points;
        if (stat === "games") statValue = player.games_played;
        if (stat === "plus_minus") statValue = player.plus_minus;

        const card = document.createElement("div");
        card.className = "leader-card";

        card.innerHTML = `
            <h3>#${index + 1} ${player.player}</h3>
            <p>${player.team} | ${player.position}</p>
            <strong>${statValue}</strong>
        `;

        leaderCards.appendChild(card);
    });
}

async function addPlayer() {
    const newPlayer = {
        player: document.getElementById("newPlayer").value,
        season: document.getElementById("newSeason").value,
        team: document.getElementById("newTeam").value,
        position: document.getElementById("newPosition").value,
        games_played: Number(document.getElementById("newGP").value),
        goals: Number(document.getElementById("newGoals").value),
        assists: Number(document.getElementById("newAssists").value),
        points: Number(document.getElementById("newPoints").value),
        plus_minus: Number(document.getElementById("newPlusMinus").value)
    };

    await fetch("/players", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newPlayer)
    });

    document.getElementById("newPlayer").value = "";
    document.getElementById("newTeam").value = "";
    document.getElementById("newPosition").value = "";
    document.getElementById("newGP").value = "";
    document.getElementById("newGoals").value = "";
    document.getElementById("newAssists").value = "";
    document.getElementById("newPoints").value = "";
    document.getElementById("newPlusMinus").value = "";

    loadPlayers();
    loadLeaders();
}

document.getElementById("searchInput").addEventListener("input", function() {
    const search = this.value.toLowerCase();

    const filtered = allPlayers.filter(player =>
        player.player.toLowerCase().includes(search) ||
        player.team.toLowerCase().includes(search) ||
        player.position.toLowerCase().includes(search)
    );

    displayPlayers(filtered);
});

loadPlayers();
loadLeaders();