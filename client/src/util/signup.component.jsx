import React, { Component } from 'react';
import { Input, Button } from 'mdbreact';
import validate from './validator';
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
        var errs = validate(e);
        this.setState({
            userId: errs.userId,
            password: errs.password,
            email: errs.email
        });
        // //https://long-drink.glitch.me/user
        // fetch('http://localhost:5000/auth/signup', {
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json'
        //     },
        //     method: 'POST',
        //     body: JSON.stringify(formData)
        // }).then((response) => response.json())
        //     .then(response => {
        //     console.log(response);
        //     });
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