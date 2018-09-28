import React, { Component } from 'react';
import { Card, CardBody, Container, Col, Row } from 'mdbreact';
import './usercard.css';
import {THEME} from '../theme/theme';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

class User extends Component {

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            seasons: ["current", "lifetime"],
            modes: ["solo", "duo", "squad"],
            dropdownOpen: false,
            activeModeKey: "solo"
        }
    }

    getPlatformIcon(platform) {
        return THEME.PLATFORM[platform].icon;
    }

    getPlatformColor(platform) {
        return THEME.PLATFORM[platform].color;
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    handleSelect = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    generateCard(player) {
        console.log(player);
        let userInfo = (<h5>{player.player_id}
            <FormControl >
                <InputLabel htmlFor="mode-native" style={{ color: "whitesmoke" }}>Mode</InputLabel>
                <Select
                    value={this.state.activeModeKey}
                    onChange={this.handleSelect}
                    inputProps={{
                        name: 'activeModeKey',
                        id: 'mode-native',
                    }}
                    style={{ color: "whitesmoke" }}
                >
                    <option value="solo">Solo</option>
                    <option value="duo">Duo</option>
                    <option value="squad">Squad</option>
                </Select>
            </FormControl>
        </h5>);
        return (
            <Card className="text-align-center">
                <CardBody>
                    <Container fluid>
                        <UserCardView {...[userInfo, ...player.stats.labels]}/>
                        <UserCardView {...["current", ...player.stats["current"][this.state.activeModeKey]]} />
                        <UserCardView {...["lifetime", ...player.stats["lifetime"][this.state.activeModeKey]]} />
                    </Container>
                </CardBody>
            </Card>
        )
    }

    render() {
            return this.generateCard(this.props.player)
    }
}

const UserCardView = (props) => {
    return (
        <Row className="no-gutters">
            <Col sm="3">
                <div className="userStatInfo" key={123}>{props[0]}</div>
            </Col>
            <Col sm="1">
                <div className="userStatInfo" key={43}>{props[1]}</div>
            </Col>
            <Col sm="1">
                <div className="userStatInfo" key={53}>{props[2]}</div>
            </Col>
            <Col sm="1">
                <div className="userStatInfo" key={75}>{props[3]}</div>
            </Col>
            <Col sm="1">
                <div className="userStatInfo" key={890}>{props[4]}</div>
            </Col>
            <Col sm="2">
                <div className="userStatInfo" key={678}>{props[5]}</div>
            </Col>
            <Col sm="1">
                <div className="userStatInfo" key={345}>{props[6]}</div>
            </Col>
            <Col sm="2">
                <div className="userStatInfo" key={3445}>{props[7]}</div>
            </Col>
        </Row>
    );
}

export default User;