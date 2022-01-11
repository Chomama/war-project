import "./card.css";
import React from "react";

function Card(props) {
  return (
    <div className="card">
        <p style={props.player === "Player One" ? {} : {display: 'none'}}> {props.player} has {props.cardCount} card left. </p>
        <div id="card">
            <p> { props.cardValue } </p>
        </div>
        <p style={props.player === "Player Two" ? {} : {display: 'none'}}> {props.player} has {props.cardCount} card left. </p>
    </div>
  );

}
export default Card;