import React, { Component } from 'react';
import { Container, Input, Button } from 'mdbreact';
import api from '../util/api';
import validate from '../util/validator';
import './forgotpassword.css';

let token = '';
class PasswordReset extends Component {

    constructor(props) {
        super(props);
        this.handleForgot = this.handleForgot.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.validField = this.validField.bind(this);
        this.state = {
            password: '',
            tokenValid: false
        };
    }

    componentWillMount() {
        let that = this;
        if(this.props.action === "reset") {
            token = this.props.match.params.token;
            api.get("/auth/reset/", token, function (response) {
                if (response.success === false) {
                    localStorage.setItem('successMessage', response.message);
                    that.setState({
                        tokenValid: response.success
                    });
                }
                if (response.success === true) {
                    localStorage.removeItem('successMessage');
                    that.setState({
                        tokenValid: response.success
                    })
                }
            });
        }
    }

    handleForgot(e) {
        let that = this;
        e.preventDefault();
        const formData = Array.from(e.target.elements)
            .filter(el => el.id)
            .reduce((a, b) => ({ ...a, [b.id]: b.value }), {});
        api.post('/auth/forgot/', null, formData, function (response) {
            console.log(response);
            if (response.success === false) {
                localStorage.setItem('successMessage', response.message);
                that.setState({
                    forgot: response.message
                })
            }
            if (response.success) {
                localStorage.removeItem('successMessage');
                that.setState({
                    forgot: response.message
                })
            }
        });
    }

    handleReset(e) {
        let that = this;
        e.preventDefault();
        const formData = Array.from(e.target.elements)
            .filter(el => el.id)
            .reduce((a, b) => ({ ...a, [b.id]: b.value }), {});

        var errs = validate(formData);
        this.setState({
            password: errs.password
        });

        if(errs.password === "valid") {
            api.post('/auth/reset/', token, formData, function (response) {
                if (response.success === false) {
                    localStorage.setItem('successMessage', response.message);
                    that.setState({
                        reset: response.message
                    })
                }
                if (response.success) {
                    localStorage.removeItem('successMessage');
                    that.setState({
                        reset: response.message
                    })
                }
            });
        }
    }

    validField(field) {
        return this.state[field] === '' ? null : this.state[field] === "valid" ? "valid" : "invalid";
    }

    render() {
        if(this.state.tokenValid || this.props.action === "forgot"){
            return (
                <Container>
                    {this.props.action === "forgot" ?
                        <ForgotPassword handleForgot={this.handleForgot} status={this.state.forgot}/> :
                        <ResetPassword handleReset={this.handleReset} validField={this.validField} password={this.state.password} status={this.state.reset} />}
                </Container>
            );
        }
        else
        return (
            <Container>
                <h1 className="text-align-center">Forgot Password</h1>
                {localStorage.getItem('successMessage') && <p className="success-message">{localStorage.getItem('successMessage')}</p>}
            </Container>
        );           
    }
}

const ForgotPassword = (props) => {
    return (
    <div>
        <h1 className="text-align-center">Forgot Password</h1>
        <form onSubmit={props.handleForgot}>
            {localStorage.getItem('successMessage') && <p className="success-message">{localStorage.getItem('successMessage')}</p>}
            {props.status && <p className="success-message">{props.status}</p>}
            <Input id="email" label="Email" group icon="envelope" type="email" validate required />
            <div className="text-right">
                <Button type="submit">Request Password Reset</Button>
            </div>
        </form>
    </div>
    )
}

const ResetPassword = (props) => {
    return (
    <div>
        <h1 className="text-align-center">Forgot Password</h1>
        <form onSubmit={props.handleReset}>
            {localStorage.getItem('successMessage') && <p className="success-message">{localStorage.getItem('successMessage')}</p>}
            {props.status && <p className="success-message">{props.status}</p>}
            <Input id="password" label="Password" group icon="lock" type="password" validate required className={props.validField("password")} />
            <Input id="confirmPassword" label="Confirm Password" group icon="lock" type="password" validate error={props.password} required className={props.validField("password")} />
            <div className="text-right">
                <Button type="submit">Reset Password</Button>
            </div>
        </form>
    </div>
    )
}

export default PasswordReset;