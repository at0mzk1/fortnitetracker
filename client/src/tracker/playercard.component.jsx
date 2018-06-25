import React, { Component } from 'react';
import { Container, Card, CardBody, CardTitle, Col, Row, Badge } from 'mdbreact';
import { Tabs } from '@material-ui/core'
import { ErrorOutline } from '@material-ui/icons';
import CustomTab from '../theme/CustomTab'
import './playercard.css';

class Player extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeSeasonKey: "current",
            activeModeKey: 0
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

    generateCard(player) {
        return (
            <Card className="text-align-center">
                <CardTitle className='playerCardTitle'>
                    {player.name} <Badge color="primary">{player.platform}</Badge>
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
                    <PlayerSeasonStats key={this.state.activeSeasonKey} {...player.stats} nav={this.handleSelect} activeSeasonKey={this.state.activeSeasonKey} activeModeKey={this.state.activeModeKey} />
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
    let keys = Object.keys(props).slice(0, 6);
    let modeDetails = organizeData(keys, props, props.activeSeasonKey);
    console.log(props);

        return (
            <div className="playerCardStatBody">
                <Tabs
                    value={props.activeModeKey}
                    onChange={(k, value) => props.nav("mode", value)}
                    indicatorColor="secondary"
                    textColor="secondary"
                    centered
                >
                    <CustomTab key={0} value={0} label="Solo" />
                    <CustomTab key={1} value={1} label="Duo" />
                    <CustomTab key={2} value={2} label="Squad" />
                </Tabs>
                {
                     modeDetails[keys[props.activeModeKey]] ?
                    <PlayerStats key={props.activeModeKey} {...modeDetails[keys[props.activeModeKey]]} /> :
                        <div className="noStatsCard">
                            <div className="centered"> 
                                    <div className="noDataSvg"><ErrorOutline style={{ fontSize: "100px", padding: "5px" }} /></div>
                                    <div style={{fontSize: 25}}>No data found</div>
                            </div>
                        </div>                     
                }
                
            </div>);
}

let organizeData = (keys2, props, season) => {
    let modeDetails = [];
    keys2.map((mode, i) => {
        if (props[mode].season === season) {
            if (props[keys2[mode]].mode === 'solo') {
                modeDetails[0] = props[keys2[mode]];
            } else if (props[keys2[mode]].mode === 'duo') {
                modeDetails[1] = props[keys2[mode]];
            } else {
                modeDetails[2] = props[keys2[mode]];
            }
        }
        return null;
    })
    return modeDetails;
}

const PlayerStats = (props) => {
    let filter = ["id", "player_id", "season", "mode", "avg_match_time", "rating", "createdAt", "updatedAt"];
    let keys = Object.keys(props).filter(item => !filter.includes(item));
    return (
        <div className="playerCardStats">
            {keys.map((key, i) =>
                <Stat key={i} value={props[key]} label={key} />
            )
            }
        </div>);
}

const Stat = (props) => {
    return(
        <Container>
            <Row className="statRow">
                    <Col xs="6" key={props.label} className="statLabel">
                        <div className="statInfo">{props.label}</div>
                </Col>
                    <Col xs="6" key={props.value} className="statValue">
                        <div className="statInfo">{props.value}</div>
                </Col>
            </Row>
        </Container>);
}

export default Player;