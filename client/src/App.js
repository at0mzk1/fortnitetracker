import React, { Component } from 'react';
import './App.css';
import Main from './common/main.component';
import Header from './common/header.component';
import AccountModal from './common/modal.component';

class App extends Component {

  constructor() {
    super();
    this.lgClose = this.lgClose.bind(this);
    this.state = {
      show: false
    }
    //if (window.location.protocol !== "https:") window.location.protocol = "https:";
  }

  lgClose() {
    this.setState({
      show: !this.state.show
    });
  }

  render() {
    return (
      <div className="App">
        <Header toggleModal={this.lgClose}/>
        <Main {...this.props} toggleModal={this.lgClose} />
        <AccountModal show={this.state.show} toggle={this.lgClose} />
      </div>
    );
  }
}

export default App;
