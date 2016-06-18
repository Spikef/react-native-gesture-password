import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';

import PasswordGesture from 'react-native-gesture-password';

var Password1 = '123';

class AppDemo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: 'Please input your password.',
            status: 'normal'
        }
    }
    
    onEnd(password) {
        if (password == Password1) {
            this.setState({
                status: 'right',
                message: 'Password is right, success.'
            });

            // your codes to close this view
        } else {
            this.setState({
                status: 'wrong',
                message: 'Password is wrong, try again.'
            });
        }
    }

    onStart() {
        this.setState({
            status: 'normal',
            message: 'Please input your password.'
        });
    }

    onReset() {
        this.setState({
            status: 'normal',
            message: 'Please input your password (again).'
        });
    }

    render() {
        return (
            <PasswordGesture
                ref='pg'
                status={this.state.status}
                message={this.state.message}
                onStart={() => this.onStart()}
                onEnd={(password) => this.onEnd(password)}
                innerCircle={true}
                outerCircle={true}
            />
        );
    }
}

AppRegistry.registerComponent('AppDemo', () => AppDemo);