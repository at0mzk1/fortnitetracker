import React, { Component } from 'react';
import './App.css';
import Tracker from './tracker/tracker.component';
import Header from './common/header.component';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Tracker />
      </div>
    );
  }
}

export default App;
