import React, { Component } from 'react';
import { Container, Modal, ModalFooter, Input, Button, Fa, Row, Col } from 'mdbreact';
import { Tabs, Typography, Checkbox } from '@material-ui/core'
import CustomTab from '../theme/CustomTab'
import CustomFormControlLabel from '../theme/CustomFormControlLabel'
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import validate from '../util/validator.js';
import './modal.css';

//setup before functions
var typingTimer;                //timer identifier
var doneTypingInterval = 500;  //time in ms (5 seconds)

function TabContainer({ children, dir }) {
    return (
        <Typography component="div" dir={dir} style={{ padding: 8 * 3, color: "whitesmoke" }}>
            {children}
        </Typography>
    );
}

class MyLargeModal extends Component {

    constructor() {
        super();
        this.render.bind(this);
        this.createUser = this.createUser.bind(this);
        this.state = {
            remember: false,
            value: 0,
            userId: null,
            password: null,
            emailAddress: null,
            success: false,
            err: null,
            modal: false
        };
    }

    handleChange = (event, value) => {
        event.preventDefault();
        this.setState({ value });
    };

    handleRemember = name => event => {
        console.log(name, event.target.checked);
        this.setState({ [name]: event.target.checked });
    };

    getValidationState(field) {
        return this.state[field];
    }

    handleFormSubmit() {
        if (this.state.userId === "success" && this.state.password === "success" && this.state.emailAddress === "success")
        this.setState({isDisabled: false});
    }

    //on keyup, start the countdown
    keyup(e) {
        let eventId = e.target.id;
        let eventVal = e.target.value;
        let that = this;
        clearTimeout(typingTimer);
        if (e.target.value) {
            typingTimer = setTimeout(() => {
                if(eventId === "confirmPassword")
                    that.setState({ [document.getElementById("password").id] : validate(eventId, eventVal, document.getElementById("password").value)});
                else if (eventId === "emailAddress") {
                    that.setState({ [eventId]: validate(eventId, eventVal) });
                    that.handleFormSubmit();
                }
                else
                    that.setState({[eventId]: validate(eventId, eventVal)});
            }, doneTypingInterval);
        }
    }

    createUser(e) {
        const formData = Array.from(e.target.elements)
            .filter(el => el.name)
            .reduce((a, b) => ({ ...a, [b.name]: b.value }), {});
            console.log(formData);
        //https://long-drink.glitch.me/user
        fetch('http://localhost:5000/auth/signup', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(formData)
        }).then((response) => response.json())
            .then(response => {
            console.log(response);
            });

        e.preventDefault();
    }

    render() {
        return (
            <Container>
                <Modal isOpen={this.props.show} toggle={this.props.toggle} centered>
                    <Tabs
                        value={this.state.value}
                        onChange={this.handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        fullWidth
                    >
                        <CustomTab label="Log In" icon={<Fa icon="user" />}/>
                        <CustomTab label="Sign Up" icon={<Fa icon="user-plus" />}/>
                    </Tabs>
                    {this.state.value === 0 && <TabContainer>
                        <LoginForm handleRemember={this.handleRemember.bind(this)} remember={this.state.remember}/>
                        </TabContainer>
                    }
                    {this.state.value === 1 && <TabContainer>
                        <SignUpForm getValidationState={this.getValidationState.bind(this)} validateForm={this.createUser} keyup={this.keyup.bind(this)} />
                        </TabContainer>
                    }
                    <ModalFooter>
                        <Container fluid>
                            <Row>
                                <Col sm='12' className="formgroup-centered" >
                                    <h6 className="formgroup-centered">OR</h6>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm='12' className="formgroup-centered" >
                                    <h5 className="formgroup-centered">Sign in with social account</h5>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm='6' className="formgroup-centered" >
                                    <GoogleLogin
                                        clientId="669816818644-kk374gvqb31g9sc0ehoqlgcg81452dbh.apps.googleusercontent.com"
                                        buttonText="Google"
                                        onSuccess={responseGoogle}
                                        onFailure={responseGoogle}
                                        className="google-login"
                                    />
                                </Col>
                                <Col sm='6' className="formgroup-centered" >
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
                        </Container>
                    </ModalFooter>
                </Modal>
            </Container>
        );
    }
}

const responseGoogle = (response) => {
    if(response.profileObj){
    console.log(response);
    }
    else
    console.log("Error autheticating with Google.");
}

const responseFacebook = (response) => {
    console.log(response);
}

const LoginForm = (props) => {
    return (
        <form>
            <Input id="userid" label="User ID" icon="user" group type="email" validate error="wrong" success="right" />
            <Input id="password" label="Password" icon="lock" group type="password" validate />
            <CustomFormControlLabel
                control={
                    <Checkbox
                        checked={props.remember}
                        onChange={props.handleRemember("remember")}
                        value="remember"
                        color="primary"
                        style={{color: "whitesmoke"}}
                    />
                }
                label="Remember me"
            />
            <div className="text-right">
                <Button type="submit">Login</Button>
            </div>
        </form>
    );
}

const SignUpForm = (props) => {
    return (
        <form onSubmit={props.validateForm}>
            <Input id="userid" label="User ID" icon="user" group type="email" validate error="wrong" success="right" />
            <Input id="password" label="Password" icon="lock" group type="password" validate />
            <Input id="confirmPassword" label="Confirm Password" icon="lock" group type="password" validate />
            <Input id="email" label="Email" icon="envelope" group type="email" validate error="wrong" success="right" />
            <div className="text-right">
                <Button type="submit">Sign Up</Button>
            </div>
        </form>
    );
}

export default MyLargeModal;