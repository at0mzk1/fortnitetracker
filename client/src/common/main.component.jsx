import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
import Home from './home.component'
import Tracker from '../tracker/tracker.component'
import Auth from '../util/auth';
import Profile from '../tracker/profile.component'

// Configure all routes here
const Main = (props) => (
    <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/tracker' render={() => <Tracker {...props} />} />
        <Route exact path='/profile' component={Profile} />
        <Route exact path='/logout' render={() => { Auth.deauthenticateUser(); localStorage.removeItem('loggedInUser'); return(<Redirect to="/"/>)}} />
    </Switch>
)

export default Main