// VirtualBetDemo.jsx
// React demo of a sportsbook-style UI (practice only — no real money)
// Features: Premier League + La Liga with logos, live match simulation, odds, betslip, results, league tables, bet history

import React, { useState, useEffect } from 'react';

// Premier League teams with CDN logos
const premierLeagueTeams = [
  { name: "Arsenal", logo: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg" },
  { name: "Aston Villa", logo: "https://upload.wikimedia.org/wikipedia/en/9/9f/Aston_Villa_FC_crest_%282016%29.svg" },
  { name: "Bournemouth", logo: "https://upload.wikimedia.org/wikipedia/en/e/e5/AFC_Bournemouth_%282013%29.svg" },
  { name: "Brentford", logo: "https://upload.wikimedia.org/wikipedia/en/2/2a/Brentford_FC_crest.svg" },
  { name: "Brighton", logo: "https://upload.wikimedia.org/wikipedia/en/f/fd/Brighton_%26_Hove_Albion_logo.svg" },
  { name: "Chelsea", logo: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg" },
  { name: "Crystal Palace", logo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Crystal_Palace_FC_logo.svg" },
  { name: "Everton", logo: "https://upload.wikimedia.org/wikipedia/en/7/7c/Everton_FC_logo.svg" },
  { name: "Fulham", logo: "https://upload.wikimedia.org/wikipedia/en/3/3e/Fulham_FC_%28shield%29.svg" },
  { name: "Liverpool", logo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg" },
  { name: "Luton Town", logo: "https://upload.wikimedia.org/wikipedia/en/8/8b/Luton_Town_logo.svg" },
  { name: "Man City", logo: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg" },
  { name: "Man United", logo: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg" },
  { name: "Newcastle", logo: "https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg" },
  { name: "Nottingham Forest", logo: "https://upload.wikimedia.org/wikipedia/en/1/17/Nottingham_Forest_F.C._logo.svg" },
  { name: "Sheffield Utd", logo: "https://upload.wikimedia.org/wikipedia/en/9/9c/Sheffield_United_FC_logo.svg" },
  { name: "Tottenham", logo: "https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg" },
  { name: "West Ham", logo: "https://upload.wikimedia.org/wikipedia/en/c/c2/West_Ham_United_FC_logo.svg" },
  { name: "Wolves", logo: "https://upload.wikimedia.org/wikipedia/en/f/fc/Wolverhampton_Wanderers.svg" },
  { name: "Burnley", logo: "https://upload.wikimedia.org/wikipedia/en/6/62/Burnley_F.C._Logo.svg" },
];

// La Liga teams with CDN logos
const laLigaTeams = [
  { name: "Real Madrid", logo: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg" },
  { name: "Barcelona", logo: "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg" },
  { name: "Atletico Madrid", logo: "https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_Madrid_2017_logo.svg" },
  { name: "Sevilla", logo: "https://upload.wikimedia.org/wikipedia/en/3/3b/Sevilla_FC_logo.svg" },
  { name: "Valencia", logo: "https://upload.wikimedia.org/wikipedia/en/c/ce/Valenciacf.svg" },
  { name: "Villarreal", logo: "https://upload.wikimedia.org/wikipedia/en/7/70/Villarreal_CF_logo.svg" },
  { name: "Real Betis", logo: "https://upload.wikimedia.org/wikipedia/en/1/13/Real_betis_logo.svg" },
  { name: "Athletic Bilbao", logo: "https://upload.wikimedia.org/wikipedia/en/9/98/Club_Athletic_Bilbao_logo.svg" },
  { name: "Real Sociedad", logo: "https://upload.wikimedia.org/wikipedia/en/f/f1/Real_Sociedad_logo.svg" },
  { name: "Getafe", logo: "https://upload.wikimedia.org/wikipedia/en/5/56/Getafe_CF_logo.svg" },
  { name: "Osasuna", logo: "https://upload.wikimedia.org/wikipedia/en/4/4e/CA_Osasuna_logo.svg" },
  { name: "Rayo Vallecano", logo: "https://upload.wikimedia.org/wikipedia/en/1/12/Rayo_Vallecano_logo.svg" },
  { name: "Celta Vigo", logo: "https://upload.wikimedia.org/wikipedia/en/1/16/RC_Celta_de_Vigo_logo.svg" },
  { name: "Mallorca", logo: "https://upload.wikimedia.org/wikipedia/en/f/fd/Rcd_mallorca.svg" },
  { name: "Cadiz", logo: "https://upload.wikimedia.org/wikipedia/en/7/78/C%C3%A1diz_CF_logo.svg" },
  { name: "Granada", logo: "https://upload.wikimedia.org/wikipedia/en/c/cf/Granada_CF_logo.svg" },
  { name: "Alaves", logo: "https://upload.wikimedia.org/wikipedia/en/2/2e/Deportivo_Alav%C3%A9s_logo.svg" },
  { name: "Las Palmas", logo: "https://upload.wikimedia.org/wikipedia/en/0/0c/UD_Las_Palmas_logo.svg" },
  { name: "Girona", logo: "https://upload.wikimedia.org/wikipedia/en/5/56/Girona_FC_crest.svg" },
  { name: "Levante", logo: "https://upload.wikimedia.org/wikipedia/en/1/13/Levante_ud_logo.svg" },
];

const leagues = {
  "Premier League 🏴": premierLeagueTeams,
  "La Liga 🇪🇸": laLigaTeams,
};

function VirtualBetDemo() {
  const [league, setLeague] = useState("Premier League 🏴");
  const [fixtures, setFixtures] = useState([]);
  const [results, setResults] = useState([]);
  const [betslip, setBetslip] = useState([]);
  const [betHistory, setBetHistory] = useState([]);
  const [leagueTable, setLeagueTable] = useState({});

  // Initialize fixtures
  useEffect(() => {
    generateFixtures();
  }, [league]);

  function generateFixtures() {
    const teams = leagues[league];
    const games = [];
    for (let i = 0; i < teams.length; i += 2) {
      if (teams[i + 1]) {
        games.push({
          home: teams[i],
          away: teams[i + 1],
          score: [0, 0],
          status: "Live",
          odds: [
            (1 + Math.random() * 3).toFixed(2),
            (2 + Math.random() * 4).toFixed(2),
            (1 + Math.random() * 3).toFixed(2),
          ],
        });
      }
    }
    setFixtures(games);
  }

  // Simulate score updates
  useEffect(() => {
    const interval = setInterval(() => {
      setFixtures((prev) =>
        prev.map((g) => {
          if (g.status === "Live" && Math.random() < 0.3) {
            const h = g.score[0] + (Math.random() < 0.5 ? 1 : 0);
            const a = g.score[1] + (Math.random() < 0.5 ? 1 : 0);
            if (Math.random() < 0.1) g.status = "FT";
            if (g.status === "FT") finalizeResult(g);
            return { ...g, score: [h, a] };
          }
          return g;
        })
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  function finalizeResult(game) {
    setResults((r) => [...r, game]);
    // update bet history
    betslip.forEach((bet) => {
      if (
        (bet.pick === "Home" && game.score[0] > game.score[1]) ||
        (bet.pick === "Away" && game.score[1] > game.score[0]) ||
        (bet.pick === "Draw" && game.score[0] === game.score[1])
      ) {
        setBetHistory((bh) => [...bh, { ...bet, result: "Won" }]);
      } else {
        setBetHistory((bh) => [...bh, { ...bet, result: "Lost" }]);
      }
    });
    setBetslip([]);
  }

  function addToBetslip(game, pick, odd) {
    setBetslip([...betslip, { game, pick, odd }]);
  }

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <header className="bg-green-700 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Virtual Bet (Demo)</h1>
        <select
          value={league}
          onChange={(e) => setLeague(e.target.value)}
          className="text-black p-2 rounded"
        >
          {Object.keys(leagues).map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
      </header>

      <main className="grid grid-cols-4 gap-4 p-4">
        {/* Fixtures / Live */}
        <section className="col-span-3 bg-gray-900 p-4 rounded-lg shadow">
          <h2 className="text-green-400 text-lg font-bold mb-2">Live Matches</h2>
          {fixtures.map((g, i) => (
            <div
              key={i}
              className="flex justify-between items-center border-b border-gray-700 py-2"
            >
              <div className="flex items-center gap-2">
                <img src={g.home.logo} alt="" className="w-6 h-6" />
                <span>{g.home.name}</span>
              </div>
              <span className="text-yellow-400">
                {g.score[0]} - {g.score[1]}
              </span>
              <div className="flex items-center gap-2">
                <span>{g.away.name}</span>
                <img src={g.away.logo} alt="" className="w-6 h-6" />
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-green-700 px-2 py-1 rounded hover:bg-green-500"
                  onClick={() => addToBetslip(g, "Home", g.odds[0])}
                >
                  {g.odds[0]}
                </button>
                <button
                  className="bg-green-700 px-2 py-1 rounded hover:bg-green-500"
                  onClick={() => addToBetslip(g, "Draw", g.odds[1])}
                >
                  {g.odds[1]}
                </button>
                <button
                  className="bg-green-700 px-2 py-1 rounded hover:bg-green-500"
                  onClick={() => addToBetslip(g, "Away", g.odds[2])}
                >
                  {g.odds[2]}
                </button>
              </div>
              <span className="text-xs text-green-400 animate-pulse">
                {g.status === "Live" ? "● Live" : "FT"}
              </span>
            </div>
          ))}
        </section>

        {/* Betslip */}
        <aside className="bg-gray-900 p-4 rounded-lg shadow">
          <h2 className="text-green-400 font-bold mb-2">Betslip</h2>
          {betslip.map((b, i) => (
            <div key={i} className="border-b border-gray-700 py-1">
              <p>
                {b.game.home.name} vs {b.game.away.name}
              </p>
              <p className="text-sm">Pick: {b.pick} @ {b.odd}</p>
            </div>
          ))}
        </aside>
      </main>

      {/* Results */}
      <section className="p-4 bg-gray-800">
        <h2 className="text-green-400 font-bold mb-2">Results</h2>
        {results.map((r, i) => (
          <p key={i}>
            {r.home.name} {r.score[0]} - {r.score[1]} {r.away.name}
          </p>
        ))}
      </section>

      {/* Bet History */}
      <section className="p-4 bg-gray-900">
        <h2 className="text-green-400 font-bold mb-2">Bet History</h2>
        {betHistory.map((bh, i) => (
          <p key={i}>
            {bh.game.home.name} vs {bh.game.away.name} → {bh.pick} ({bh.result})
          </p>
        ))}
      </section>
    </div>
  );
}

export default VirtualBetDemo;

