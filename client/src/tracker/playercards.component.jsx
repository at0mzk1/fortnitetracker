import React, { Component } from 'react';
import { Container, Row } from 'mdbreact';
import PlayerCard from './playercard.component';

class PlayerCards extends Component {

    constructor(props) {
        super(props);
        this.state = {
            playerCards: []
        }
    }

    componentWillMount(){
        this.getPlayers();
    }

    getPlayers() {
        fetch('https://long-drink.glitch.me/players')
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
            <Container >
                <h1>Your Dashboard</h1>
                <Row>
                    {this.state.playerCards}
                </Row>
            </Container>
        )
    }
}

export default PlayerCards;