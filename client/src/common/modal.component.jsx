import React, { Component } from 'react';
import { Modal, Button, Nav, NavItem, FormGroup, Col, Checkbox, Form, ControlLabel, FormControl, Grid, Row } from 'react-bootstrap';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import './modal.css';

class MyLargeModal extends Component {

    constructor() {
        super();
        this.render.bind(this);
        this.state = {
            action: "Login",
            activeKey: 1,
            userId: "",
            password: ""
        };
    }

    handleSelect(eventKey) {
        this.setState({
            activeKey: eventKey
        });
    }

    render() {
        return (
            <Modal
                {...this.props}
                bsSize="small"
            >
                <Modal.Header closeButton>
                    <Nav bsStyle='pills' activeKey={this.state.activeKey} onSelect={this.handleSelect.bind(this)} className="login-nav-tab">
                        <NavItem eventKey={1} title="Item"><span>Log In</span></NavItem>
                        <NavItem eventKey={2} title="Item"><span>Sign Up</span></NavItem>
                    </Nav>
                </Modal.Header>
                <Modal.Body>
                    {this.state.activeKey === 1 ? <LoginForm/> : <SignUpForm validationState={this.getValidationState}/>}
                </Modal.Body>
                <Modal.Footer>
                    <Grid fluid={true}>
                        <Row>
                            <FormGroup className="formgroup-centered">
                        <ControlLabel>OR</ControlLabel>
                        <FormControl.Static>Sign in with social account</FormControl.Static>
                    </FormGroup>
                        </Row>
                        <Row>
                            <Col sm={6} className="formgroup-centered" >
                                <GoogleLogin
                                    clientId=" 669816818644-kk374gvqb31g9sc0ehoqlgcg81452dbh.apps.googleusercontent.com "
                                    buttonText="Google"
                                    onSuccess={responseGoogle}
                                    onFailure={responseGoogle}
                                    className="google-login"
                                />

                                </Col>
                            <Col sm={6} className="formgroup-centered" >
                                <FacebookLogin
                                    appId="1088597931155576"
                                    autoLoad={true}
                                    fields="name,email,picture"
                                    callback={responseFacebook}
                                    textButton="Facebook"
                                    cssClass="facebook-login"
                                />
                            </Col>
                        </Row>
                    </Grid>
                </Modal.Footer>
            </Modal>
        );
    }

    handleChange(e) {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({ [name]: value });
    }

    getValidationState(e) {
        const length = this.state.value.length;
        if (length > 10) return 'success';
        else if (length > 5) return 'warning';
        else if (length > 0) return 'error';
        return null;
    }
}

const responseGoogle = (response) => {
    console.log(response);
}

const responseFacebook = (response) => {
    console.log(response);
}

const LoginForm = (props) => {
    return (
        <Form>
            <FormControl
                id="userId"
                type="text"
                placeholder="User ID"
                onChange={this.handleChange}
            />
            <FormControl
                id="password"
                type="password"
                placeholder="Password"
                onChange={this.handleChange}
            />
            <Checkbox>
                Remember Me
            </Checkbox>
            <Button type="submit">Login</Button>
        </Form>


    );
}

const SignUpForm = (props) => {
    return (
        <Form>
            <FormControl
                id="formSignupLogin"
                type="text"
                placeholder="User ID"
                validationState={props.validationState}
            />
            <FormControl
                id="formSignupPassword"
                type="password"
                placeholder="Password"
                validationState={props.validationState}
            />
            <FormControl
                id="formSignupConfirmPassword"
                type="password"
                placeholder="Confirm Password"
                validationState={props.validationState}
            />
            <FormControl
                id="formSignupEmail"
                type="email"
                placeholder="Email"
                validationState={props.validationState}
            />
            <FormControl.Feedback />
            <Button type="submit">Create Account</Button>
        </Form>
    );
}

export default MyLargeModal;