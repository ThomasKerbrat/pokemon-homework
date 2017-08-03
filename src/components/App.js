import React, { Component } from 'react';
import { BrowserRouter, Route, Link, } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          Pokémons will arrive soon!
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
