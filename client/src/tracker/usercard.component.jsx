import React, { Component } from 'react';
import { Card, CardTitle, CardBody, Container, Col, Row } from 'mdbreact';
import './usercard.css';
import {THEME} from '../theme/theme';
import { Tabs } from '@material-ui/core'
import CustomTab from '../theme/CustomTab'

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

    handleSelect = (value) => {
        this.setState({ activeModeKey: value });
    }

    generateCard(player) {
        return (
            <Card className="text-align-center full-width">
                <CardTitle className='playerCardTitle'>
                    <Tabs
                        value={this.state.activeModeKey}
                        onChange={(k, value) => this.handleSelect(value)}
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        <CustomTab key={0} value="solo" label="Solo" />
                        <CustomTab key={1} value="duo" label="Duo" />
                        <CustomTab key={2} value="squad" label="Squad" />
                    </Tabs>
                </CardTitle>
                <CardBody>
                    <Container fluid>
                        <UserCardView {...[(<h5>{player.player_id}</h5>), ...player.stats.labels]}/>
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