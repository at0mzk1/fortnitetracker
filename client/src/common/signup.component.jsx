import React, { Component } from 'react';
import { Input, Button } from 'mdbreact';
import validate from '../util/validator';
import './signup.css';

class SignUpForm extends Component {

    constructor() {
        super();
        this.createUser = this.createUser.bind(this);
        this.validField = this.validField.bind(this);
        this.state = {
            userId: '',
            password: '',
            email: '',
            err: ''
        };
    }

    validField(field) {
        return this.state[field] === '' ? null : this.state[field] === "valid" ? "valid" : "invalid";
    }

    createUser(e) {
        e.preventDefault();
        const formData = Array.from(e.target.elements)
            .filter(el => el.id)
            .reduce((a, b) => ({ ...a, [b.id]: b.value }), {});

        var errs = validate(formData);
        this.setState({
            password: errs.password,
            email: errs.email
        });
        fetch(process.env.REACT_APP_API_HOSTNAME + '/auth/signup', {
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }),
            method: 'POST',
            body: JSON.stringify(formData)
        }).then((response) => response.json())
            .then(response => {
                if(response.success) {
                    // set a message
                    localStorage.setItem('successMessage', response.message);
                    this.props.redirect(new Event('redirect'), 0);
                }
                else {
                    this.setState({userId: response.message});
                }
            });
    }
    
    render() {
        return (
            <form onSubmit={this.createUser}>
                <Input id="userid" label="User ID" group icon="user" type="text" validate error={this.state.userId} required className={this.validField("userId")}/>
                <Input id="password" label="Password" group icon="lock" type="password" validate required className={this.validField("password")}/>
                <Input id="confirmPassword" label="Confirm Password" group icon="lock" type="password" validate error={this.state.password} required className={this.validField("password")}/>
                <Input id="email" label="Email" group icon="envelope" type="email" validate error={this.state.email} required className={this.validField("email")}/>
                <div className="text-right">
                    <Button type="submit">Sign Up</Button>
                </div>
            </form>
        );
    }
}

export default SignUpForm