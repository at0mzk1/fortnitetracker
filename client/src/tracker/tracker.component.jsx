import React, { Component } from 'react';
import { Container, Row, Fa, Card, CardBody, Col } from 'mdbreact';
import { Link } from 'react-router-dom'
import PlayerCard from './playercard.component';
import UserCard from './usercard.component';
import api from '../util/api';
import Auth from '../util/auth';
import Timer from '../util/timer.component'
class Tracker extends Component {

    constructor(props) {
        super(props);
        this.updateTimerKey = this.updateTimerKey.bind(this)
        this.state = {
            userCard: [],
            playerCards: [],
            key: 12345
        }
    }

    componentWillMount() {
        this.getPlayers();
    }

    updateTimerKey() {
        this.setState({ key: Math.random() });
    }

    getPlayers() {
        let that = this;
        if(Auth.isUserAuthenticated()) {
            api.get('/api/profile/', localStorage.getItem('loggedInUser'), function (results) {

                let userCard = results.primary.map((player, i) => {
                    return (<UserCard key={i} player={player} />)
                })

                let playerCards = results.friends.map((player, i) => {
                    return (<PlayerCard key={i} player={player} />)
                })
                that.setState({ userCard: userCard, playerCards: playerCards })
            });
        }
        else
        return null;        
    }

    render() {
        if(Auth.isUserAuthenticated()) {
            return (
                <Container >
                    <h1 className="text-align-center">Your Dashboard</h1>
                    <Row>
                        <Timer key={this.state.key} update={this.updateTimerKey} />
                    </Row>
                    <Row>
                        {this.state.userCard}
                    </Row>
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
        else {
            return (<Container >
                <h1 className="text-align-center">Your Dashboard</h1>
                <Row>
                    <Link to="#" onClick={this.props.toggleModal}>Please log in to see your dashboard.</Link>
                </Row>
            </Container>)
        }
    }
}

export default Tracker;