import React from "react";
import Grid from "./components/Grid";
import "./App.css";

const App = () => {
  return (
    <div className="app">
      <h1 className="title">Falling Rain Pattern</h1>
      <Grid rows={15} cols={20} />
    </div>
  );
};

export default App;
