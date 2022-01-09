import "./App.css";
import Card from "./components/Card";
import React, { useEffect } from "react";

function App() {
  const [gameRunning, setGameRunning] = React.useState(false);


  useEffect(() => {
    console.log(gameRunning);
  })
  function startGame() {
    if (this.gameRunning == false) {
      setGameRunning(true);
    }
  }

  return (
    <div className="main">
      <h1> WAR</h1>
      <button id="startButton" onClick={startGame} style={{gameRunning} ? {} : {display: 'none'}}> START </button>
      <div id="cardPlaceholders">
        <div id="rectangle1">
          <Card />
        </div>
        <div id="rectangle2">
          <Card />
        </div>
      </div>
    </div>
  );
}

export default App;
