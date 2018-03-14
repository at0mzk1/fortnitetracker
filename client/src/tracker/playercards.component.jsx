import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';
import PlayerCard from './playercard.component';

class PlayerCards extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeSeasonKey: 0,
            activeModeKey: 0,
            playerCards: []
        }
    }

    handleSelect = (selection, eventKey) => {
        if(selection === "season"){
            this.setState({
                activeSeasonKey: eventKey
            });
        }
        if (selection === "mode") {
            this.setState({
                activeModeKey: eventKey
            });
        }
    }

    componentWillMount(){
        this.getPlayers();
    }

    getPlayers() {
        fetch('http://localhost:5000/players')
            .then((results) => results.json())
            .then(results => {
                let playerCards = results.map((player, i) => {
                    return (<PlayerCard key={i} player={player}/>)
                })
                this.setState({playerCards: playerCards})
            });
    }

    render() {
        return (
            <Grid>
                {this.state.playerCards}
            </Grid>
        )
    }
}

export default PlayerCards;