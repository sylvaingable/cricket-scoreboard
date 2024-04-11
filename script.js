const gameDataKey = "gameData";
const teamInitialData = {
  name: "",
  turns: [],
};
const gameInitialData = {
  teams: { 1: teamInitialData, 2: teamInitialData },
  isGameStarted: false,
  isGameFinished: false,
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

function resetGameData() {
  gameData = getGameData();
  gameData.teams[1].turns = [];
  gameData.teams[2].turns = [];
  setGameData(gameData);
}

function startGame(firstTeamName, secondTeamName, includeBullsEye) {
  const data = getGameData();
  data.teams[1].name = firstTeamName;
  data.teams[2].name = secondTeamName;
  data.includeBullsEye = includeBullsEye;
  data.isGameStarted = true;
  data.isGameFinished = false;
  setGameData(data);
}

function addTurn(team, turn) {
  const data = getGameData();
  data.teams[team].turns.push(turn);
  setGameData(data);
}

function getNumberMark(team, number) {
  const gameData = getGameData();
  const hits = gameData.teams[team].turns.reduce(
    (acc, turn) => acc + turn[number],
    0
  );
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

function sumTeamTurns(team) {
  const gameData = getGameData();
  return gameData.teams[team].turns.reduce(
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

function getAvgHitsPerTurn(team) {
  const turnsSum = sumTeamTurns(team);
  const totalHits = Object.values(turnsSum).reduce((acc, value) => acc + value);
  return Number(totalHits / getGameData().teams[team].turns.length).toFixed(1);
}

function countEmptyTurns(team) {
  return getGameData().teams[team].turns.filter((turn) =>
    Object.values(turn).every((value) => value === 0)
  ).length;
}

function getTeamTotalPoints(team) {
  const turnsSum = sumTeamTurns(team);
  return Object.keys(turnsSum).reduce(
    (acc, key) => acc + (Math.max(turnsSum[key], 3) - 3) * key,
    0
  );
}

function hasWon({ team, includeBullsEye }) {
  const turnsSum = sumTeamTurns(team);
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
