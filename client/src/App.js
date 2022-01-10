import "./App.css";
import React, { useEffect } from "react";
import Card from "./components/Card";


const CARDS = ['D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D13', 'D14',
'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12', 'C13', 'C14',
'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10', 'H11', 'H12', 'H13', 'H14',
'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'S11', 'S12', 'S13', 'S14'];

var gameStates = {notStarted: 0, inProgress: 0, done: 0}; 

const numRegex = /\d+/g;

function App() {
  const [gameState, setGameState] = React.useState(gameState.notStarted);
  const[playerOneDeck, setPlayerOneDeck] = React.useState([]);
  const[playerTwoDeck, setPlayerTwoDeck] = React.useState([]);
  const[playerOnePlayedCard, setPlayerOnePlayedCard] = React.useState(null);
  const[playerTwoPlayedCard, setPlayerTwoPlayedCard] = React.useState(null);
  const[roundWinner, setRoundWinner] = React.useState(null);
  const[roundStatus, setRoundStatus] = React.useState(null);


  function startGame() {
    if (this.gameRunning == false) {
      setGameState(gameState.inProgress);
    }
    var shuffledDeck = CARDS.sort(() => Math.random() - 0.5);
    this.setPlayerOneDeck = shuffledDeck.slice(0, 26);
    this.setPlayerTwoDeck = shuffledDeck.slice(26)
  }

  function playRound() {
      var inProgress = true;
      var p1DeckCopy = playerOneDeck;
      var p2DeckCopy = playerTwoDeck;
      var cardsWon = [];
      var roundWinner;
      var roundStatus;
      var gameState = gameStates.inProgress;

      while(inProgress) {
        var playerOneCard = p1DeckCopy.shift();
        var playerTwoCard = p2DeckCopy.shift();

        cardsWon.push(playerOneCard, playerTwoCard);

        var playerOneCardVal = playerOneCard.match(numRegex);
        var playerTwoCardVal = playerTwoCard.match(numRegex);

        //war
        if(playerOneCardVal === playerTwoCardVal) {
          var inWar = true;
          while(inWar) {
            if(p1DeckCopy.length < 2) {
              inProgress = false;
              inWar = false;
              roundWinner = "playerOne";
              roundStatus = 'Player two is out of cards.  Player one wins!'
              gameState = gameStates.done;
            } else if(p2DeckCopy.length<2) {
              inProgress = false;
              inWar = false;
              roundWinner = "playerTwo";
              roundStatus = 'Player one is out of cards.  Player two wins!'
              gameState = gameStates.done;

            } else {
              playerOneCard = p1DeckCopy.shift();
              playerTwoCard = p2DeckCopy.shift();
              cardsWon.push(playerOneCard, playerTwoCard);
              cardsWon.push(p1DeckCopy.shift(), playerTwoCard.shift());
              if(playerOneCard !== playerTwoCard) {
                playerOneCardVal = playerOneCard.match(numRegex);
                playerTwoCardVal = playerTwoCard.match(numRegex);
                
                if(playerOneCardVal > playerTwoCardVal) {
                  roundWinner = "playerOne"
                  p1DeckCopy.push(cardsWon);
                  inWar = false;
                  inProgress = false;
                  roundStatus = "War was declared.  Player 1 won the war and received {cardsWon.length} cards.";
                } else if(playerTwoCardVal > playerOneCardVal) {
                    roundWinner = "playerTwo";
                    p2DeckCopy.push(cardsWon);
                    inWar = false;
                    inProgress = false;
                    roundStatus = "War was declared.  Player 2 won the war and received {cardsWon.length} cards.";
                }
              }
            }
          }
        } else {
          if(playerOneCardVal > playerTwoCardVal) {
            roundWinner = "playerOne";
            p1DeckCopy.push(cardsWon);
            roundStatus = "Player one won {cardsWon.length} cards."
          } else {
            roundWinner = "playerTwo";
            p2DeckCopy.push(cardsWon);
            roundStatus = "Player two won {cardsWon.length} cards."
          }
          inProgress = false;
        }  
      }
      if(p1DeckCopy.length === 0 || p2DeckCopy.length.length === 0) {
        gameState = gameStates.done;
      }
      setRoundWinner(roundWinner);
      setPlayerOneDeck(p1DeckCopy);
      setPlayerTwoDeck(p2DeckCopy);
      setRoundStatus(roundStatus);
      setPlayerOnePlayedCard(playerOneCard);
      setPlayerTwoPlayedCard(playerTwoCard);
      setGameState(gameState);

  }

  
  

  return (
    <div className="main">
      <h1> WAR</h1>
      <button id="startButton" onClick={startGame} style={{gameState}==gameStates.notStarted ? {} : {display: 'none'}}> START </button>
      <div className="gameBoard">
          <div className = "playerOne">
              <Card player="Player One"/>
          </div>
          <div className="gameStatus"> 
            <p> TEST </p>
          </div> 
          <div className = "playerTwo">
              <Card player="Player Two"/>
          </div>
      </div>
    </div>
  );
}

export default App;
