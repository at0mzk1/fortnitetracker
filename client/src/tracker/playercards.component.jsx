import React, { Component } from 'react';
import { Container, Row, Fa, Card, CardBody, Col } from 'mdbreact';
import { Link } from 'react-router-dom'
import PlayerCard from './playercard.component';
import Auth from '../util/auth';
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
        fetch(process.env.REACT_APP_API_HOSTNAME + '/api/profile/' + localStorage.getItem('loggedInUser'), {
            headers: {
                'Authorization': process.env.REACT_APP_API_TOKEN
            }
        })
            .then((results) =>  results.json())
            .then(results => {
                let playerCards = results.players.map((player, i) => {
                    return (<PlayerCard key={i} player={player}/>)
                })
                this.setState({playerCards: playerCards})
            });
    }

    render() {
        return (
            <Container >
                <h1 className="text-align-center">Your Dashboard</h1>
                <Row>
                    {this.state.playerCards}
                    <Col sm="6" md="3" lg="4" key={1231214523} style={{ padding: 15 }}>
                        
                        <Link to={(Auth.isUserAuthenticated() ? { pathname: "/profile", hash: "friendsList" } : "#")} onClick={Auth.isUserAuthenticated() ? null : this.props.toggleModal}>
                            <Card className="addFriendCard">
                                <CardBody style={{ padding: 0 }} className="addFriendCardBody">
                                    {this.state.playerCards.length > 0 ? "Add more friends!" : "Add a friend!"}
                                <Fa icon="plus" className="addFriend" />
                                </CardBody>
                            </Card>
                        </Link>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default PlayerCards;