import React, { Component } from 'react';
import { Container, Row, Fa, Card, CardBody, Col, Input, Button } from 'mdbreact';
import CustomChipInput from '../theme/CustomChipInput'
import PlayerCard from './playercard.component';
import './profile.css';

let players = [];

class Profile extends Component {

    constructor(props) {
        super(props);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.state = {
            userId: '',
            email: '',
            players: [],
            playerCards: []
        }
    }

    componentWillMount() {
        this.getProfile();
    }

    handleDelete(deletedPlayer) {
            this.setState({
                players: this.state.players.filter((c) => c !== deletedPlayer)
            })
    }
    
    handleAdd(player) {
        this.setState({
            players: [...this.state.players, player]
        })
    }

    handleUpdate(e) {
        e.preventDefault();
        // const formData = Array.from(e.target.elements)
        //     .filter(el => el.id)
        //     .reduce((a, b) => ({ ...a, [b.id]: b.value }), {});

        // fetch(process.env.REACT_APP_API_HOSTNAME + '/api/profile', {
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json'
        //     },
        //     method: 'POST',
        //     body: JSON.stringify(formData)
        // }).then((response) => response.json())
        //     .then(response => {
        //         if (response.success === false) {
        //             response.message === "Incorrect User ID" ?
        //                 this.setState({
        //                     userId: response.message
        //                 })
        //                 :
        //                 this.setState({
        //                     userId: '',
        //                     password: response.message
        //                 });
        //         }
        //         if (response.success) {
        //             Auth.authenticateUser(response.token);
        //             localStorage.removeItem('successMessage');
        //             localStorage.setItem('loggedInUser', response.user.name)
        //             this.props.toggle();
        //         }

        //     });
    }

    addFriends(e) {
        e.preventDefault();
        var elem = document.getElementById('friendsList');
        if (typeof elem !== 'undefined' && elem !== null) {
            elem.scrollIntoView();
        }
        return false;
    }

    getProfile() {
        players = [];
        fetch(process.env.REACT_APP_API_HOSTNAME + '/api/profile/' + localStorage.getItem('loggedInUser'), {
            headers: {
                'Authorization': process.env.REACT_APP_API_TOKEN
            }
        }).then((results) => results.json())
        .then(results => {
            let playerCards = results.players.map((player, i) => {
                players.push(player.name);
                return (<PlayerCard key={i} player={player} />)
            })
            this.setState({ playerCards: playerCards, userId: results.userid, email: results.email, players: players })
            });
    }

    render() {
        return (
            <Container >
                <h1 className="text-align-center">Edit your profile</h1>
                <form onSubmit={this.handleUpdate}>
                    {localStorage.getItem('successMessage') && <p className="success-message">{localStorage.getItem('successMessage')}</p>}
                    <Input id="userid" label="User ID" value={this.state.userId} group icon="user" type="text" validate required />
                    <Input id="email" label="Email" value={this.state.email} group icon="envelope" type="email" validate required />
                    {/* <h5>Your friends:</h5> */}
                    <CustomChipInput value={this.state.players}
                        onAdd={this.handleAdd}
                        onDelete={this.handleDelete}
                        fullWidth
                        label="Manage your friends:"
                        helperText="Add your friends by typing and pressing Enter."
                        placeholder='Add your friends here'
                        id="friendsList"/>
                    <div className="text-right">
                        <Button type="submit">Submit</Button>
                    </div>
                </form>
                <h1>Dashboard preview:</h1>
                <Row>
                    {this.state.playerCards}
                    <Col sm="6" md="3" lg="4" key={1231214523} style={{ padding: 15 }}>
                        <a href="PleaseEnableJavascript.html" onClick={this.addFriends}>
                            <Card className="addFriendCard">
                                <CardBody style={{ padding: 0 }} className="addFriendCardBody">
                                    Add more friends!
                                <Fa icon="plus" className="addFriend"/>
                            </CardBody>
                        </Card>
                        </a>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Profile;