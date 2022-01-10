import "./card.css";
import React from "react";

function Card(props) {
  return (
    <div className="card">
        <p> {props.player} has {props.cardCount} card left. </p>
        <div id="card">
            <p> { props.cardValue } </p>
        </div>
    </div>
  );

}
export default Card;