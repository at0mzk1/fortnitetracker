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
        fetch(process.env.REACT_APP_API_HOSTNAME + '/api/players', {
            headers: new Headers({
                'Authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTUyNzcxODEzNH0.8GjbPb8Me3-sE-iBVPStvfhAcloY-hl8KGG_Fn6t6aM'
            })
        })
            .then((results) =>  results.json())
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