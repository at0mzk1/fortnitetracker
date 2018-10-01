import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from './home.component';
import Tracker from '../tracker/tracker.component';
import Auth from '../util/auth';
import Profile from '../tracker/profile.component';
import PasswordReset from '../util/forgotpassword.component';

// Configure all routes here
const Main = (props) => (
    <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/tracker' render={() => <Tracker {...props} />} />
        <Route exact path='/profile' component={Profile} />
        <Route exact path='/logout' render={() => { Auth.deauthenticateUser(); localStorage.removeItem('loggedInUser'); return(<Redirect to="/"/>)}} />
        <Route exact path='/forgot' render={(props) => <PasswordReset {...props} action="forgot" />} />
        <Route exact path='/reset/:token' render={(props) => <PasswordReset {...props} action="reset" />} />
    </Switch>
)

export default Main