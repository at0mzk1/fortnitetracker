import React, { Component } from 'react';
import { Panel, Col, Nav, NavItem, Badge, Row, Grid } from 'react-bootstrap';
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
                <Panel bsStyle={style}>
                    <Panel.Heading>
                        <Panel.Title componentClass="h3">
                            <div className="userId">{player.name}</div>
                            <Badge pullRight>
                                <a href="https://fortnitetracker.com/article/23/trn-rating-you" target="_blank" rel="noopener noreferrer">?</a>
                            </Badge>
                            <Badge pullRight>
                                Rating: {player.stats.filter(item => item.season === this.state.activeSeasonKey).reverse()[this.state.activeModeKey].rating}
                            </Badge>                           
                        </Panel.Title>
                    </Panel.Heading>
                    <Panel.Body className="playerCardBody">
                        <Nav bsStyle="pills" activeKey={this.state.activeSeasonKey} onSelect={k => this.handleSelect("season", k)}>
                                <NavItem key={1} eventKey={"current"} className="seasonSelect">Current</NavItem>
                                <NavItem key={2} eventKey={"lifetime"} className="seasonSelect">Lifetime</NavItem>
                        </Nav>
                        <PlayerSeasonStats key={this.state.activeSeasonKey} {...player.stats} nav={this.handleSelect} style={style} activeSeasonKey={this.state.activeSeasonKey} activeModeKey={this.state.activeModeKey}/>
                    </Panel.Body>
                </Panel>
        )
    }

    render() {
            return (
                <Col sm={6} md={3} lg={2} key={this.props.accountId}>
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
            <Nav bsStyle="pills" activeKey={props.activeModeKey} onSelect={k => props.nav("mode", k)}>
                {
                    modeDetails.map((mode, i) => { 
                    if (mode.season === props.activeSeasonKey) {
                        return (<NavItem key={i} eventKey={i} className="modeLi">{mode.mode}</NavItem>)
                    }
                    return null;
                } )
                }
            </Nav>
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
    let filter = ["id", "player_id", "season", "mode", "avg_match_time", "rating"];
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
        <Grid fluid={true}>
        <Row className="statRow">
                <Col xs={6} key={props.label} className="statLabel">
                    <div className="statInfo">{props.label}</div>
            </Col>
                <Col xs={6} key={props.value} className="statValue">
                    <div className="statInfo">{props.value}</div>
            </Col>
        </Row>
        </Grid>);
}

export default Player;