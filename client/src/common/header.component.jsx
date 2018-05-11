import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import MyLargeModal from './modal.component';



class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false
        };
    }

    render() {
        let lgClose = () => this.setState({ show: false });

        return(
            <Navbar collapseOnSelect staticTop fluid className="navBar">
                <Navbar.Header>
                    <Navbar.Brand>
                        Fortnite Friends Rankings <small>created by at0mz</small>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse className="navBarMenu">
                    <Nav className="menuItems">
                        <NavItem eventKey={1} href="/">Home</NavItem>
                        <NavItem eventKey={2} href="/tracker">Tracker</NavItem>
                    </Nav>
                </Navbar.Collapse>
                <Nav pullRight>
                    <NavItem onClick={() => this.setState({ show: true })}>
                        Login
                </NavItem>
                    <MyLargeModal show={this.state.show} onHide={lgClose} />
                </Nav>
            </Navbar>
        )
    }

}

export default Header;