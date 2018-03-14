import React, { Component } from 'react';
import { Panel, Col, Nav, NavItem, Badge } from 'react-bootstrap';

class Player extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeSeasonKey: 1,
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
                    <Col lg={3} key={player.accountId}>
                        <Panel bsStyle="primary">
                            <Panel.Heading>
                                <Panel.Title componentClass="h3">{player.name} <Badge pullRight>{player.stats.rating}</Badge></Panel.Title>
                            </Panel.Heading>
                            <Panel.Body>
                                <Nav bsStyle="tabs" activeKey={this.state.activeSeasonKey} onSelect={k => this.handleSelect("season", k)}>
                                        <NavItem key={1} eventKey={1}>Current</NavItem>
                                        <NavItem key={2} eventKey={2}>Lifetime</NavItem>
                                </Nav>
                        <PlayerSeasonStats key={this.state.activeSeasonKey} {...player.stats} nav={this.handleSelect} activeSeasonKey={this.state.activeSeasonKey} activeModeKey={this.state.activeModeKey}/>
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
    let keys = Object.keys(props);
    let keys2 = keys.slice(0,6);
    let season = props.activeSeasonKey === 1 ? "current" : "lifetime";

    return (
        <div>
            <Nav bsStyle="tabs" activeKey={props.activeModeKey} onSelect={k => props.nav("mode", k)}>
                {
                    keys2.map((mode, i) => {
                    if(props[mode].season === season) {
                    return(<NavItem key={i} eventKey={i}>{props[mode].mode}</NavItem>)
                    }
                    return null;
                } )
                }
            </Nav>
            <PlayerStats key={props.activeModeKey} {...props[keys[props.activeModeKey]]} />
        </div>);
}

const PlayerStats = (props) => {
    let keys = Object.keys(props);

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
    <p>
    <span>{props.label}:&nbsp;</span> <span>{props.value}</span>
    </p>);
}

export default Player;