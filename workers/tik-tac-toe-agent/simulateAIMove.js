export async function simulateAIMove(boardState, turn) {
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const availableMoves = boardState
    .map((val, idx) => (val === "" ? idx : null))
    .filter((idx) => idx !== null);

  let nextMove =
    availableMoves[Math.floor(Math.random() * availableMoves.length)];

  console.log({ availableMoves, boardState });

  winningCombos.forEach((combo) => {
    const [a, b, c] = combo;
    if (
      boardState[a] === turn &&
      boardState[b] === turn &&
      boardState[c] === ""
    ) {
      nextMove = c;
    }
    if (
      boardState[a] === turn &&
      boardState[c] === turn &&
      boardState[b] === ""
    ) {
      nextMove = b;
    }
    if (
      boardState[b] === turn &&
      boardState[c] === turn &&
      boardState[a] === ""
    ) {
      nextMove = a;
    }
  });

  resolve(nextMove);
}
