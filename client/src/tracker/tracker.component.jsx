import React, { Component } from 'react';
import PlayerCards from './playercards.component';

class Tracker extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
                <PlayerCards {...this.props} />
        )
    }

}

export default Tracker;