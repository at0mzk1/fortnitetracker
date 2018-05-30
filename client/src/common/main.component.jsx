import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
import Home from './home.component'
import Tracker from '../tracker/tracker.component'
import Auth from '../util/auth';

// Configure all routes here
const Main = () => (
    <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/tracker' component={Tracker} />
        <Route exact path='/logout' render={() => { Auth.deauthenticateUser(); localStorage.removeItem('loggedInUser'); return(<Redirect to="/"/>)}} />
    </Switch>
)

export default Main