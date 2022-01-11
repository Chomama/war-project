import "./App.css";
import React, { useEffect } from "react";
import Card from "./components/Card";
import ScoreBoard from "./components/ScoreBoard"

const CARDS = ['D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D13', 'D14',
'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12', 'C13', 'C14',
'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10', 'H11', 'H12', 'H13', 'H14',
'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'S11', 'S12', 'S13', 'S14'];

const gameStates = { notStarted: "notStarted", inProgress: "inProgress", done: "done" }; 

function App() {
  const [gameValues, setGameValues] = React.useState({
      gameState : gameStates.notStarted,
      playerOneDeck : [],
      playerTwoDeck : [],
      playerOnePlayedCard : null,
      playerTwoPlayedCard : null,
      roundWinner : null,
      roundStatus: null,
      intervalId : null,
      playerOneWins: null,
      playerTwoWins: null
  }
  )

  async function getWins(playerId1, playerId2) {
      console.log(`/getWins?playerId1=${playerId1}&playerId2=${playerId2}`);
      fetch(`/getWins?playerId1=${playerId1}&playerId2=${playerId2}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      }
      }).then(response => response.json())
      .then(json => {
        var player1Wins = json[0].WINS;
        var player2Wins = json[1].WINS;
        console.log("GOT HERE" + json.WINS);
        var newValues = {...gameValues};
        newValues.playerOneWins = player1Wins;
        newValues.playerTwoWins = player2Wins;
        setGameValues(newValues);
      });
  }

  async function updateWins(playerId) {
    console.log("UPDATE WINS BEING CALLED");
    fetch(`/updateWins?playerId=${playerId}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    }
    });    
  }

  function startGame() {
    var shuffledDeck = CARDS.sort(() => Math.random() - 0.5);
    console.log("THE SHUFFLED DECK: " + shuffledDeck);
    var newValues = {...gameValues};
    if (gameValues.gameState !== gameStates.inProgress) {
      newValues.gameState = gameStates.inProgress;
    }
    newValues.playerOneDeck = shuffledDeck.slice(0, 26);
    newValues.playerTwoDeck = shuffledDeck.slice(26);
    console.log("P1 DECK: " + newValues.playerOneDeck + " LENGTH " + newValues.playerOneDeck.length);
    console.log("P2 DECK: " + newValues.playerTwoDeck + " LENGTH " + newValues.playerTwoDeck.length);

    setGameValues(newValues);
  }

  useEffect(() => {
    getWins("playerOne", "playerTwo");

    if (gameValues.gameState === gameStates.inProgress) {
      let letIntervalID = setInterval(() => {
        simulateGame()
      }, 200);
      setGameValues({...gameValues, intervalId : letIntervalID}); 
    } else {
      clearInterval(gameValues.intervalID);
      console.log("CLEAR INTERVAL!");
    }
  }, [gameValues.gameState]);


  function simulateGame() {
    console.log("SIMULATING GAME.  GAME STATUS IS : " + gameValues.gameState);
    if(gameValues.gameState === gameStates.inProgress) {
        playRound();
    }
  }

  function playRound() {
      console.log("ROUND IN PROGRESS.");
      var p1DeckCopy = gameValues.playerOneDeck;
      var p2DeckCopy = gameValues.playerTwoDeck;

      console.log("PLAYER 1 DECK: " + p1DeckCopy + " LENGTH: " + p1DeckCopy.length);
      console.log("PLAYER 2 DECK: " + p2DeckCopy + " LENGTH: " + p2DeckCopy.length);

      var cardsWon = [];
      var roundWinner;
      var roundStatus;
      var gameState = gameStates.inProgress;

      var playerOneCard = p1DeckCopy.shift();
      var playerTwoCard = p2DeckCopy.shift();
      console.log("PLAYER ONE CARD: " + playerOneCard);
      console.log("PLAYER TWO CARD: " + playerTwoCard);

      cardsWon.push(playerOneCard, playerTwoCard);

      var playerOneCardVal = parseInt(playerOneCard.replace ( /[^\d.]/g, '' ));
      var playerTwoCardVal = parseInt(playerTwoCard.replace ( /[^\d.]/g, '' ));
      console.log("PLAYER ONE CARD VAL: " + playerOneCardVal);
      console.log("PLAYER TWO CARD VAL: " + playerTwoCardVal);

      //war
      if(playerOneCardVal === playerTwoCardVal) {
        console.log("WAR");
        var inWar = true;
        while(inWar) {
          if(p1DeckCopy.length < 2) {
            inWar = false;
            roundWinner = "playerOne";
            roundStatus = 'Player one is out of cards.  Player two wins!'
            gameState = gameStates.done;
            updateWins("playerTwo");
          } else if(p2DeckCopy.length < 2) {
            inWar = false;
            roundWinner = "playerTwo";
            roundStatus = 'Player two is out of cards.  Player one wins!'
            gameState = gameStates.done;
            updateWins("playerOne");
          } else {
            var playerOneWarCard = p1DeckCopy.shift();
            var playerTwoWarCard = p2DeckCopy.shift();
            console.log("IN WAR PLAYER ONE DRAWS: " + playerOneWarCard);
            console.log("IN WAR PLAYER TWO DRAWS: " + playerTwoWarCard);
            var playerOneWarCardVal = parseInt(playerOneWarCard.replace ( /[^\d.]/g, '' ));
            var playerTwoWarCardVal = parseInt(playerTwoWarCard.replace ( /[^\d.]/g, '' ));
            cardsWon.push(playerOneWarCard, playerTwoWarCard);
            var playerOneFaceDownCard = p1DeckCopy.shift();
            var playerTwoFaceDownCard = p2DeckCopy.shift();
            cardsWon.push(playerOneFaceDownCard, playerTwoFaceDownCard);
            if(playerOneWarCardVal > playerTwoWarCardVal) {
              console.log("PLAYER ONE WON WAR WITH CARD: " + playerOneWarCard);
              roundWinner = "playerOne";
              p1DeckCopy.push(...cardsWon);
              inWar = false;
              roundStatus = "War was declared.  Player 1 won the war and received " + cardsWon.length + "cards.";
            } else if(playerTwoWarCardVal > playerOneWarCardVal) {
                console.log("PLAYER TWO WON WAR WITH CARD: " + playerTwoWarCardVal);
                roundWinner = "playerTwo";
                p2DeckCopy.push(...cardsWon);
                inWar = false;
                roundStatus = "War was declared.  Player 2 won the war and received " + cardsWon.length + "cards";
            }
          }
        }
      } else {
        if(playerOneCardVal > playerTwoCardVal) {
          console.log("PLAYER ONE WON WITH CARD: " + playerOneCard);
          roundWinner = "playerOne";
          p1DeckCopy.push(...cardsWon);
          roundStatus = "Player One won " + cardsWon.length + " cards";
        } else {
          console.log("PLAYER TWO WON WITH CARD: " + playerTwoCard);
          roundWinner = "playerTwo";
          p2DeckCopy.push(...cardsWon);
          roundStatus = "Player Two won " + cardsWon.length + " cards";
        }
      }  
    
      if(p1DeckCopy.length === 0) {
        roundStatus = "Player one has no cards left. PLAYER TWO HAS WON!"
        gameState = gameStates.done;
        updateWins("playerTwo");
      } else if(p2DeckCopy.length === 0) {
        roundStatus = "Player two has no cards left. PLAYER ONE HAS WON!"
        gameState = gameStates.done;
        updateWins("playerOne")
      }
      console.log("END OF ROUND_____________________");
      console.log("ROUND WINNER: " + roundWinner);
      console.log("P1 has " + p1DeckCopy.length + " cards left.");
      console.log("P2 has " + p2DeckCopy.length + " cards left.");
      console.log("ROUND STATUS: " +roundStatus);
      
      var newValues = {...gameValues};

      newValues.playerOneDeck = p1DeckCopy;
      newValues.playerTwoDeck = p2DeckCopy;
      newValues.roundWinner = roundWinner;
      newValues.roundStatus = roundStatus;
      newValues.playerOnePlayedCard = playerOneCard;
      newValues.playerTwoPlayedCard = playerTwoCard;
      newValues.gameState = gameState;

      setGameValues(newValues);
  }

  return (
    <div className="main">
      <div className="header">
        <h1> WAR</h1>
        <button id="startButton" onClick={startGame} style={gameValues.gameState !== gameStates.inProgress ? {} : {display: 'none'}}> START </button>
        <ScoreBoard playerOneWins={gameValues.playerOneWins} playerTwoWins={gameValues.playerTwoWins}/>
      </div>
      <div className="gameBoard">
          <div className = "playerOne">
              <Card player="Player One" cardCount={gameValues.playerOneDeck.length} cardValue={gameValues.playerOnePlayedCard}/>
          </div>
          <div className = "statusSection"> 
            <p> { gameValues.roundStatus }</p>
          </div> 
          <div className = "playerTwo">
              <Card player="Player Two" cardCount={gameValues.playerTwoDeck.length} cardValue={gameValues.playerTwoPlayedCard}/>
          </div>
      </div>
    </div>
  );
}

export default App;
