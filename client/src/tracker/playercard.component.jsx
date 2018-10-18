import React, { Component } from 'react';
import { Container, Card, CardBody, CardTitle, Col, Row } from 'mdbreact';
import { Tabs } from '@material-ui/core'
import { Error } from '@material-ui/icons';
import CustomTab from '../theme/CustomTab'
import './playercard.css';
import Avatar from '@material-ui/core/Avatar';
import {THEME} from '../theme/theme';

class PlayerCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeSeasonKey: "current",
            activeModeKey: "solo"
        }
    }

    getPlatformIcon(platform) {
        return THEME.PLATFORM[platform].icon;
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

    generateCard(player) {
        return (
            <Card className="text-align-center">
                <CardTitle className='playerCardTitle'>
                    {player.player_id} <Avatar size={16} src={this.getPlatformIcon(player.platform)} />
                </CardTitle>
                <CardBody style={{padding: 0}}>
                    <Tabs
                        value={this.state.activeSeasonKey}
                        onChange={(k, value) => this.handleSelect("season", value)}
                        indicatorColor="primary"
                        textColor="primary"
                        fullWidth
                    >
                        <CustomTab value="current" label="Current" />
                        <CustomTab value="lifetime" label="Lifetime" />
                    </Tabs>
                    <PlayerSeasonStats 
                        {...player.stats}
                        key={this.state.activeSeasonKey} 
                        nav={this.handleSelect} 
                        activeSeasonKey={this.state.activeSeasonKey} 
                        activeModeKey={this.state.activeModeKey} 
                    />
                </CardBody>
            </Card>
        )
    }

    render() {
            return (
                <Col sm="6" md="3" lg="4" key={this.props.accountId} style={{ padding: 15 }}>
                    {this.generateCard(this.props.player)}
                </Col>
            )
    }
}

const PlayerSeasonStats = (props) => {
    let stats;

    if (props[props.activeSeasonKey] == null || props[props.activeSeasonKey][props.activeModeKey] == null || props[props.activeSeasonKey][props.activeModeKey].matches === "0") {
     stats = <div className="noStatsCard">
            <div className="centered">
                <div className="noDataSvg"><Error style={{ fontSize: "100px", padding: "5px" }} /></div>
                <div style={{ fontSize: 25 }}>No data found</div>
            </div>
        </div>
    }
    else
        stats = <PlayerStats key={props.activeModeKey} {...props[props.activeSeasonKey][props.activeModeKey]} />

        return (
            <div className="playerCardStatBody">
                <Tabs
                    value={props.activeModeKey}
                    onChange={(k, value) => props.nav("mode", value)}
                    indicatorColor="secondary"
                    textColor="secondary"
                    centered
                >
                    <CustomTab key={0} value="solo" label="Solo" />
                    <CustomTab key={1} value="duo" label="Duo" />
                    <CustomTab key={2} value="squad" label="Squad" />
                </Tabs>
                {stats}
            </div>);
}

const PlayerStats = (props) => {
    return (
        <Container className="playerCardStats">
            {Object.keys(props).map((key, i) =>
                <Row key={key+i} className="statRow">
                    <Col xs="6" key={key} className="statLabel">
                        <div className="statInfo">{key}</div>
                    </Col>
                    <Col xs="6" key={props[key]} className="statValue">
                        <div className="statInfo">{props[key]}</div>
                    </Col>
                </Row>
            )
            }
            
        </Container>
        );
}

export default PlayerCard;