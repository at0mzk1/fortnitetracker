import React from 'react';
import { Switch, Route } from 'react-router-dom'
import Home from './home.component'
import Tracker from '../tracker/tracker.component'

// Configure all routes here
const Main = () => (
    <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/tracker' component={Tracker} />
    </Switch>
)

export default Main