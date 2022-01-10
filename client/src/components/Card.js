import "./card.css";
import React from "react";

function Card(props) {
  return (
    <div className="card">
        <p> {props.player} has {props.cardCount} card left. </p>
        <div id="card">
        </div>
    </div>
  );

}
export default Card;