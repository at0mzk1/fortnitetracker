import React, { Component } from 'react';
import './App.css';
import Main from './common/main.component';
import Header from './common/header.component';

class App extends Component {

  constructor() {
    super();
    //if (window.location.protocol !== "https:") window.location.protocol = "https:";
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Main {...this.props} />
      </div>
    );
  }
}

export default App;
