import React, { Component } from 'react';
import { Container, Row, Input, Button } from 'mdbreact';
import CustomChipInput from '../theme/CustomChipInput';
import CustomFormControlLabel from '../theme/CustomFormControlLabel';
import PlayerCard from './playercard.component';
import api from '../util/api';
import './profile.css';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import { FormControl, FormLabel, RadioGroup, Radio } from '@material-ui/core/';
import {THEME} from '../theme/theme';

let players = [];

class Profile extends Component {

    constructor(props) {
        super(props);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleChangePlatform = this.handleChangePlatform.bind(this);
        this.state = {
            userId: '',
            email: '',
            players: [],
            playerCards: [],
            platform: "ps4",
            sameId: "Yes",
            fortniteId: ''
        }
    }

    componentWillMount() {
        this.getProfile();
    }

    handleDelete(player) {
        let that = this;

        api.get('/api/removePlayer/', player, function (results) {
            let removedPlayer = {name: results.player.name, platform: results.player.platform};

            if (results.success) {
                that.setState({
                    players: that.state.players.filter((c) => JSON.stringify(c) !== JSON.stringify(removedPlayer))
                })
            }
            else
                console.log("Error adding user: " + results.err);
        });
    }
    
    handleAdd(player) {
        let that = this;

        api.get('/api/checkPlayer/', player, function (results) {
            if(results.success) {
                that.setState({
                    players: [...that.state.players, {name: results.player.name, platform: results.player.platform}]
                })
            }
            else
            console.log("Error adding user: " + results.err);
        });
    }

    handleChangePlatform = event => {
        this.setState({ platform: event.target.value });
    };
        
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

    handleSameId = event => {
        this.setState({ sameId: event.target.value });
    };

    getPlatformIcon(platform) {
        return THEME.PLATFORM[platform[0].platform].icon;
    }

    getPlatformColor(platform) {
        return THEME.PLATFORM[platform[0].platform].color;
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
        let that = this;
        api.get('/api/profile/', localStorage.getItem('loggedInUser'), function (results) {
            console.log(results);
            let playerCards = results.friends.map((player, i) => {
                players.push({name: player.player_id, platform: player.platform});
                return (<PlayerCard key={i+1} player={player} />)
            })
            that.setState({ playerCards: playerCards, userId: results.userid, email: results.email, players: players })
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
                    <FormControl component="fieldset" required >
                        <FormLabel component="label" style={{ color: 'inherit' }}>Is this your Fortnite ID?</FormLabel>
                        <RadioGroup 
                            value={this.state.sameId}
                            onChange={this.handleSameId}
                            style={{ display: 'inline-block' }}
                        >
                            <CustomFormControlLabel value="Yes" label="Yes" control={<Radio style={{color: 'inherit'}} />} />
                            <CustomFormControlLabel value="No" label="No" control={<Radio style={{ color: 'inherit' }} />} />
                        </RadioGroup>
                    </FormControl>
                    <div style={this.state.sameId === "Yes" ? { display: "none" } : {}}>
                        <Input id="fortniteid" label="Fortnite ID" group value={this.state.fortniteId} type="text" validate required />
                    </div>
                    <div className="text-right">
                        <Button type="submit">Submit</Button>
                    </div>
                </form>
                    <CustomChipInput value={this.state.players.map(player => player.name)}
                        onAdd={this.handleAdd}
                        onDelete={this.handleDelete}
                        label="Manage your friends:"
                        helperText="Add your friends by typing and pressing Enter."
                        placeholder='Add your friends here'
                        chipRenderer={({ value, isFocused, isDisabled, handleClick, handleDelete, defaultStyle }, key) => (
                            <Chip
                                key={key}
                                style={{ ...defaultStyle, pointerEvents: isDisabled ? 'none' : undefined, color: "inherit", backgroundColor: this.getPlatformColor(this.state.players.filter(player => player.name === value)) }}
                                onClick={handleClick}
                                onDelete={handleDelete}
                                label={value}
                                avatar={<Avatar size={32} src={this.getPlatformIcon(this.state.players.filter(player => player.name === value))}/>}
                            />
                        )}
                        id="friendsList" />

                <h1>Dashboard preview:</h1>
                <Row>
                    {this.state.playerCards}
                </Row>
            </Container>
        )
    }
}

export default Profile;