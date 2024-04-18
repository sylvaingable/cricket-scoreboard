const gameDataKey = "gameData";
const gameInitialData = {
  teams: { 1: "", 2: "" },
  turns: [],
  isGameStarted: false,
  startingTeam: null,
  includeBullsEye: false,
};
const emptyTurn = {
  20: 0,
  19: 0,
  18: 0,
  17: 0,
  16: 0,
  15: 0,
  25: 0,
};

function getGameData() {
  return JSON.parse(sessionStorage.getItem(gameDataKey));
}

function setGameData(data) {
  sessionStorage.setItem(gameDataKey, JSON.stringify(data));
}

function restartGame() {
  let gameData = getGameData();
  // Keep the teams and game config but reset the turns
  gameData.turns = [];
  setGameData(gameData);
}

function startGame(firstTeamName, secondTeamName, includeBullsEye) {
  const data = getGameData();
  data.teams[1] = firstTeamName;
  data.teams[2] = secondTeamName;
  data.includeBullsEye = includeBullsEye;
  data.isGameStarted = true;
  setGameData(data);
}

function setTurn(team, turn, turnIndex) {
  const data = getGameData();
  // Set the starting team on the first turn
  if (data.turns.length === 0 && data.startingTeam === null) {
    data.startingTeam = team;
  }
  if (turnIndex !== undefined) {
    data.turns[turnIndex] = turn;
  } else {
    data.turns.push(turn);
  }
  setGameData(data);
}

function getPlayedTurns(asOfTurnIndex = undefined) {
  // Return all the turns already played up to the given index. For example, with
  // asOfTurnIndex = 2, it return the first 2 turns (considering the third one hasn't
  // been played yet).
  const data = getGameData();
  if (asOfTurnIndex === undefined) {
    return data.turns;
  }
  return data.turns.slice(0, asOfTurnIndex);
}

function getTeamTurns(turns, team) {
  const startingTeam = getGameData().startingTeam;
  // Starting team turns are the even indexes, the other team turns are the odd indexes
  const filterPredicate =
    startingTeam === team
      ? (_, index) => index % 2 === 0
      : (_, index) => (index + 1) % 2 === 0;
  return turns.filter(filterPredicate);
}

function getNumberMark(teamTurns, number) {
  // Return a mark for a number according to cumulative hits for this number:
  //  - 0 hit: ""
  //  - 1 hit: "/"
  //  - 2 hits: "X"
  //  - 3 hits or more: "O"
  const hits = teamTurns.reduce((acc, turn) => acc + turn[number], 0);
  switch (hits) {
    case 0:
      return "";
    case 1:
      return "/";
    case 2:
      return "X";
    default:
      return "O";
  }
}

function sumTeamTurns(teamTurns) {
  // Sum all the turns of a team to get the total hits for each number
  return teamTurns.reduce(
    (acc, turn) => {
      Object.entries(turn).forEach(([key, value]) => {
        acc[key] = (acc[key] || 0) + value;
      });
      return acc;
    },
    {
      20: 0,
      19: 0,
      18: 0,
      17: 0,
      16: 0,
      15: 0,
      25: 0,
    }
  );
}

function getAvgHitsPerTurn(teamTurns) {
  const turnsSum = sumTeamTurns(teamTurns);
  const totalHits = Object.values(turnsSum).reduce((acc, value) => acc + value);
  return Number(totalHits / teamTurns.length).toFixed(1);
}

function countEmptyTurns(teamTurns) {
  return teamTurns.filter((turn) =>
    Object.values(turn).every((value) => value === 0)
  ).length;
}

function getTeamTotalPoints(teamTurns) {
  const turnsSum = sumTeamTurns(teamTurns);
  return Object.keys(turnsSum).reduce(
    (acc, key) => acc + (Math.max(turnsSum[key], 3) - 3) * key,
    0
  );
}

function hasWon({ teamTurns, includeBullsEye }) {
  const turnsSum = sumTeamTurns(teamTurns);
  let requiredSum = {
    20: 3,
    19: 3,
    18: 3,
    17: 3,
    16: 3,
    15: 3,
  };
  if (includeBullsEye) {
    requiredSum[25] = 3;
  }
  return Object.entries(requiredSum).every(
    ([key, value]) => turnsSum[key] >= value
  );
}

if (getGameData() === null) {
  setGameData(gameInitialData);
}
