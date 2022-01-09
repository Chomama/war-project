import "./card.css";
import React from "react";

function Card(props) {
//   const [gameStatus, setGameStatus] = React.useState(false);
    

  return (
    <div className="card">
        <h1> { props.cardNumber } </h1>
    </div>
  );
}

export default Card;