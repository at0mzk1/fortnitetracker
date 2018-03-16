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
                </Navbar.Header>
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