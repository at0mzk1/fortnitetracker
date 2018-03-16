import React, { Component } from 'react';
import { Panel, Col, Nav, NavItem, Badge, Row, Grid, DropdownButton, MenuItem } from 'react-bootstrap';
import './playercard.css';

let styles = ["primary", "success", "info", "warning", "danger"];

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
        let style = styles[Math.floor(Math.random() * styles.length)];
        return (
                    <Col lg={2} key={player.accountId}>
                <Panel bsStyle={style}>
                            <Panel.Heading>
                                <Panel.Title componentClass="h3">{player.name} <Badge pullRight>{player.stats.rating}</Badge></Panel.Title>
                            </Panel.Heading>
                            <Panel.Body className="playerCardBody">
                                <Nav justified="true" bsStyle="pills" activeKey={this.state.activeSeasonKey} onSelect={k => this.handleSelect("season", k)}>
                                        <NavItem key={1} eventKey={"current"}>Current</NavItem>
                                        <NavItem key={2} eventKey={"lifetime"}>Lifetime</NavItem>
                                </Nav>
                        <PlayerSeasonStats key={this.state.activeSeasonKey} {...player.stats} nav={this.handleSelect} style={style} activeSeasonKey={this.state.activeSeasonKey} activeModeKey={this.state.activeModeKey}/>
                            </Panel.Body>
                        </Panel>
                    </Col>
        )
    }

    render() {
            return (
                <Col>
                    {this.generateCard(this.props.player)}
                </Col>
            )
    }
}

const PlayerSeasonStats = (props) => {
    let keys = Object.keys(props).slice(0, 6);
    let modeDetails = organizeData(keys, props, props.activeSeasonKey);

    return (
        <div className="playerCardStatBody">
            <DropdownButton
                bsStyle={props.style}
                title={modeDetails[keys[props.activeModeKey]].mode}
                key={Math.random()}
                id={`dropdown-basic-${1}`}
                className="modeDropdown"
            >                
            {/* <Nav bsStyle="tabs" activeKey={props.activeModeKey} onSelect={k => props.nav("mode", k)}> */}
                {
                    modeDetails.map((mode, i) => { 
                    if (mode.season === props.activeSeasonKey) {
                        return (<MenuItem key={i} eventKey={i} onSelect={k => props.nav("mode", k)} className="modeDropdown">{mode.mode}</MenuItem>)
                    }
                    return null;
                } )
                }
            </DropdownButton>
            {/* </Nav> */}
            <PlayerStats key={props.activeModeKey} {...modeDetails[keys[props.activeModeKey]]}/>
        </div>);
}

let organizeData = (keys2, props, season) => {
    let modeDetails = [];
    keys2.map((mode, i) => {
        if (props[mode].season === season) {
            return (modeDetails.push(props[keys2[mode]]));
        }
        return null;
    })
    return modeDetails.reverse();
}

const PlayerStats = (props) => {
    let filter = ["id", "player_id", "season", "mode", "avg_match_time"];
    let keys = Object.keys(props).filter(item => !filter.includes(item));
    return (
        <div>
            {keys.map((key, i) =>
                <Stat key={i} value={props[key]} label={key} />
            )
            }
        </div>);
}

const Stat = (props) => {
    return(
        <Grid fluid={true}>
        <Row className="statRow">
                <Col sm={6} key={props.label} className="statLabel">
                    <div className="statInfo">{props.label}</div>
            </Col>
                <Col sm={6} key={props.value} className="statValue">
                    <div className="statInfo">{props.value}</div>
            </Col>
        </Row>
        </Grid>);
}

export default Player;