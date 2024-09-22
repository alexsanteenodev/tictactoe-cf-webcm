import { ComponentSettings, Manager } from "@managed-components/types";

const widgetHTML = (manager: Manager) => `
        <style>
      .container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: #f4f4f4;
        flex-direction: column;
      }
      .selector {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 20px;
      }
      .selector button {
        margin: 0 10px;
        padding: 10px 20px;
        font-size: 1.5rem;
        cursor: pointer;
      }
      .row {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .tic-tac-toe-container {
        display: none;
        flex-direction: column;
      }
      .tic-tac-toe-container button {
        padding: 10px 20px;
        font-size: 1.5rem;
        cursor: pointer;
        justify-content: center;
      }
      .tic-tac-toe {
        display: flex;
        flex-wrap: wrap;
        width: 300px;
        height: 300px;
        border: 5px solid #333;
      }
      .cell {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 98px;
        height: 98px;
        border: 1px solid #333;
        font-size: 2rem;
        cursor: pointer;
      }
      .cell:hover {
        background-color: #ddd;
      }
      .clear {
        margin-top: 20px;
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      .clear button {
        padding: 10px 20px;
        font-size: 1.5rem;
        cursor: pointer;
        margin-bottom: 10px;
      }
    </style>

    <div class="container">
      <div class="row">
        <h1>Tic Tac Toe</h1>
      </div>
      <div class="selector">
        <p>Select X or O</p>
        <div class="row">
          <button class="select-button">X</button>
          <button class="select-button">O</button>
        </div>
      </div>
      <div class="tic-tac-toe-container">
        <div class="clear">
          <button class="reset-button">Reset</button>
        </div>
        <div class="tic-tac-toe">
          <div class="cell"></div>
          <div class="cell"></div>
          <div class="cell"></div>
          <div class="cell"></div>
          <div class="cell"></div>
          <div class="cell"></div>
          <div class="cell"></div>
          <div class="cell"></div>
          <div class="cell"></div>
        </div>
      </div>

      <script>
        function initGame() {
          let currentPlayer = "X";
          let gameWon = false;
          let boardState = Array(9).fill("");

          selectPlayer((selectedPlayer) => {
            currentPlayer = selectedPlayer;
            showGameBoard();
            handleGameFlow(currentPlayer, boardState, gameWon);
          });
        }

        function selectPlayer(callback) {
          document.querySelectorAll(".select-button").forEach((button) => {
            button.addEventListener("click", () => {
              const selectedPlayer = button.textContent;
              callback(selectedPlayer);
            });
          });
        }

        function showGameBoard() {
          document.querySelector(".selector").style.display = "none";
          document.querySelector(".tic-tac-toe-container").style.display =
            "flex";
        }

        function handleGameFlow(currentPlayer, boardState, gameWon) {
          handleCellClicks(currentPlayer, boardState, gameWon);
          handleReset(boardState);
        }

        function handleCellClicks(currentPlayer, boardState, gameWon) {
          document.querySelectorAll(".cell").forEach((cell, index) => {
            cell.addEventListener("click", async () => {
              if (checkWin(boardState) || boardState[index] !== "") return;

              boardState = playerMove(cell, index, currentPlayer, boardState);
              if (checkWin(boardState)) return endGame(currentPlayer);
              if (isBoardFull(boardState)) return announceTie();

              const aiTurn = getOpponent(currentPlayer);

              const aiMove = await getAIMove(boardState, aiTurn);
              boardState = applyMove(aiMove, aiTurn, boardState);

              if (checkWin(boardState))
                return endGame(getOpponent(currentPlayer));
              if (isBoardFull(boardState)) return announceTie();
            });
          });
        }

        async function sendRequest(url, method, data) {
          const response = await manager.fetch(url, {
            method,
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          return response.json();
        }

        async function getAIMove(boardState, aiTurn) {
          const response = await sendRequest(
            "https://tik-tak-toe-agent.alexsanteeno.workers.dev",
            "POST",
            { boardState, aiTurn }
          );
          return response.move;
        }

        function applyMove(move, currentPlayer, boardState) {
          const updatedBoardState = [...boardState];
          updatedBoardState[move] = currentPlayer;
          const cell = document.querySelectorAll(".cell")[move];
          cell.textContent = currentPlayer;
          return updatedBoardState;
        }

        function playerMove(cell, index, currentPlayer, boardState) {
          const updatedBoardState = [...boardState];
          updatedBoardState[index] = currentPlayer;
          cell.textContent = currentPlayer;
          return updatedBoardState;
        }

        function checkWin(boardState) {
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
          return winningCombos.some((combo) => {
            const [a, b, c] = combo;
            return (
              boardState[a] &&
              boardState[a] === boardState[b] &&
              boardState[a] === boardState[c]
            );
          });
        }

        function isBoardFull(boardState) {
          return boardState.every((cell) => cell !== "");
        }

        function endGame(winner) {
          setTimeout(() => {
            alert('Player '+winner+' wins! Please reset the game.');
          }, 100);
        }

        function announceTie() {
          alert("It's a tie!");
        }

        function handleReset(boardState) {
          document
            .querySelector(".reset-button")
            .addEventListener("click", () => {
              resetBoard();
              boardState = Array(9).fill("");
            });
        }

        function resetBoard() {
          document.querySelectorAll(".cell").forEach((cell) => {
            cell.textContent = "";
          });
          document.querySelector(".selector").style.display = "flex";
          document.querySelector(".tic-tac-toe-container").style.display =
            "none";
        }

        function getOpponent(player) {
          return player === "X" ? "O" : "X";
        }

        initGame();
      </script>
    </div>
`;

export default async function (manager: Manager, _settings: ComponentSettings) {
  manager.addEventListener("pageview", (event) => {
    console.log("Hello server!");
    event.client.execute("console.log('Hello browser')");
  });

  manager.registerWidget(async () => {
    const widget = await manager.useCache("tictactoe", async () => {
      try {
        return widgetHTML(manager);
      } catch (error) {
        console.error("error fetching weather for widget:", error);
      }
    });
    return widget;
  });
}
