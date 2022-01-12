import "./card.css";
import React from "react";

function Card(props) {
  return (
    <div className="card">
        <p style={props.player === "Player One" ? {} : {display: 'none'}}> {props.player} has {props.cardCount} card left. </p>
        <div id="card">
            <img src={props.cardValue === null ? "red_joker.png": ("/cards/" + props.cardValue +".png")}/>
        </div>
        <p style={props.player === "Player Two" ? {} : {display: 'none'}}> {props.player} has {props.cardCount} card left. </p>
    </div>
  );
}
export default Card;