import React from "react";
import "./ScoreBoard.css"

function ScoreBoard(props) {
  return (
    <div className="scoreBoard">
        <p> Player One: { props.playerOneWins }</p>
        <p> Player Two: { props.playerTwoWins } </p>
    </div>
  );

}
export default ScoreBoard;