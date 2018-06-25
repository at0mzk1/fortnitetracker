import React, { Component } from 'react';
import './App.css';
import Main from './common/main.component';
import Header from './common/header.component';
import AccountModal from './common/modal.component';
import Auth from './util/auth';

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
    if (Auth.isUserAuthenticated()) {
      fetch(process.env.REACT_APP_API_HOSTNAME + '/auth/verify', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({token: Auth.getToken()})
      }).then((response) => response.json())
        .then(response => {
          if (response.success === false) {
            Auth.deauthenticateUser();
          }
        });
    }


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
