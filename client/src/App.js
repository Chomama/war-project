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

  //calls api to get players lifetime wins
  async function getWins(playerId1, playerId2) {
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
        var newValues = {...gameValues};
        newValues.playerOneWins = player1Wins;
        newValues.playerTwoWins = player2Wins;
        setGameValues(newValues);
      });
  }

  //calls api to update players wins
  async function updateWins(playerId) {
    fetch(`/updateWins?playerId=${playerId}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    }
    });    
  }

  //initializes initial game values
  function startGame() {
    var shuffledDeck = CARDS.sort(() => Math.random() - 0.5);
    var newValues = {...gameValues};
    if (gameValues.gameState !== gameStates.inProgress) {
      newValues.gameState = gameStates.inProgress;
    }
    newValues.playerOneDeck = shuffledDeck.slice(0, 26);
    newValues.playerTwoDeck = shuffledDeck.slice(26);
    setGameValues(newValues);
  }

  useEffect(() => {
    //populates scoreboard
    getWins("playerOne", "playerTwo");

    //if game is in progress, call playRound on timer every second to simulate players playing
    if (gameValues.gameState === gameStates.inProgress) {
      let letIntervalID = setInterval(() => {
        playRound()
      }, 1000);
      setGameValues({...gameValues, intervalId : letIntervalID}); 
    } else {
      clearInterval(gameValues.intervalID);
    }
  }, [gameValues.gameState]);

  
  function playRound() {
      var p1DeckCopy = gameValues.playerOneDeck;
      var p2DeckCopy = gameValues.playerTwoDeck;
      var cardsWon = [];
      var roundWinner;
      var roundStatus;
      var gameState = gameStates.inProgress;

      //gets cards from players decks
      var playerOneCard = p1DeckCopy.shift();
      var playerTwoCard = p2DeckCopy.shift();

      cardsWon.push(playerOneCard, playerTwoCard);

      var playerOneCardVal = parseInt(playerOneCard.replace ( /[^\d.]/g, '' ));
      var playerTwoCardVal = parseInt(playerTwoCard.replace ( /[^\d.]/g, '' ));

      //war
      if(playerOneCardVal === playerTwoCardVal) {
        var inWar = true;
        //continues in case of ties during war 
        while(inWar) {
          //player loses if not enough cards to have war
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
            //plays out standard war round
            var playerOneWarCard = p1DeckCopy.shift();
            var playerTwoWarCard = p2DeckCopy.shift();
            var playerOneWarCardVal = parseInt(playerOneWarCard.replace ( /[^\d.]/g, '' ));
            var playerTwoWarCardVal = parseInt(playerTwoWarCard.replace ( /[^\d.]/g, '' ));
            cardsWon.push(playerOneWarCard, playerTwoWarCard);
            var playerOneFaceDownCard = p1DeckCopy.shift();
            var playerTwoFaceDownCard = p2DeckCopy.shift();
            cardsWon.push(playerOneFaceDownCard, playerTwoFaceDownCard);
            if(playerOneWarCardVal > playerTwoWarCardVal) {
              roundWinner = "playerOne";
              p1DeckCopy.push(...cardsWon);
              inWar = false;
              roundStatus = "War was declared.  Player 1 won the war and received " + cardsWon.length + "cards.";
            } else if(playerTwoWarCardVal > playerOneWarCardVal) {
                roundWinner = "playerTwo";
                p2DeckCopy.push(...cardsWon);
                inWar = false;
                roundStatus = "War was declared.  Player 2 won the war and received " + cardsWon.length + "cards";
            }
          }
        }
      } else {
        //standard non-war scenario
        if(playerOneCardVal > playerTwoCardVal) {
          roundWinner = "playerOne";
          p1DeckCopy.push(...cardsWon);
          roundStatus = "Player One won " + cardsWon.length + " cards";
        } else {
          roundWinner = "playerTwo";
          p2DeckCopy.push(...cardsWon);
          roundStatus = "Player Two won " + cardsWon.length + " cards";
        }
      }  
    
      //win conditions
      if(p1DeckCopy.length === 0) {
        roundStatus = "Player one has no cards left. PLAYER TWO HAS WON!"
        gameState = gameStates.done;
        updateWins("playerTwo");
      } else if(p2DeckCopy.length === 0) {
        roundStatus = "Player two has no cards left. PLAYER ONE HAS WON!"
        gameState = gameStates.done;
        updateWins("playerOne")
      }
      
      //update all the state values
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