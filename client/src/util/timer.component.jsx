import React, { Component } from 'react';
import api from './api';

class Timer extends Component {
    constructor() {
        super();
        this.state = { time: {}, seconds: this.getTimeRemaining() };
        this.timer = 0;
        this.startTimer = this.startTimer.bind(this);
        this.countDown = this.countDown.bind(this);
    }

    getTimeRemaining() {
        let that = this;
        
        api.get('/api/timer', "", function (results) {
            if (results.success) {
                that.setState({
                    seconds: results.timeLeft
                })
            }
        });
    }

    secondsToTime(secs) {
        let hours = Math.floor(secs / (60 * 60));

        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);

        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);

        let obj = {
            "h": hours,
            "m": minutes,
            "s": seconds
        };
        return obj;
    }

    addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }

    componentDidMount() {
        let timeLeftVar = this.secondsToTime(this.state.seconds);
        this.setState({ time: timeLeftVar });
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }
    
    startTimer() {
        if (this.timer === 0) {
            this.timer = setInterval(this.countDown, 1000);
        }
    }

    countDown() {
        let seconds = this.state.seconds - 1;
        this.setState({
            time: this.secondsToTime(seconds),
            seconds: seconds,
        });

        // Check if we're at zero.
        if (seconds === 0) {
            setTimeout(() => this.getTimeRemaining(), 1000);
            clearInterval(this.timer);
            this.timer = 0;
            this.props.update();
        }
    }

    render() {
        this.startTimer();
        return (
            <div className="text-align-right">
                Stats will be updated in {this.addZero(this.state.time.m)}:{this.addZero(this.state.time.s)}
            </div>
        );
    }
}

export default Timer;