var React = require('react-native');
var {
    AppRegistry,
    } = React;

var PasswordGesture = require('react-native-gesture-password');

var Password1 = '';
var AppDemo = React.createClass({
    // Example for check password
    onEnd: function(password) {
        if (password == '123') {
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
    },
    onStart: function() {
        this.setState({
            status: 'normal',
            message: 'Please input your password.'
        });
    },

    // Example for set password
    /*
    onEnd: function(password) {
        if ( Password1 === '' ) {
            // The first password
            Password1 = password;
            this.setState({
                status: 'normal',
                message: 'Please input your password secondly.'
            });
        } else {
            // The second password
            if ( password === Password1 ) {
                this.setState({
                    status: 'right',
                    message: 'Your password is set to ' + password
                });

                Password1 = '';
                // your codes to close this view
            } else {
                this.setState({
                    status: 'wrong',
                    message:  'Not the same, try again.'
                });
            }
        }
    },
    onStart: function() {
        if ( Password1 === '') {
            this.setState({
                message: 'Please input your password.'
            });
        } else {
            this.setState({
                message: 'Please input your password secondly.'
            });
        }
    },
    */

    getInitialState: function() {
        return {
            message: 'Please input your password.',
            status: 'normal'
        }
    },
    render: function() {
        return (
            <PasswordGesture
                ref='pg'
                status={this.state.status}
                message={this.state.message}
                onStart={() => this.onStart()}
                onEnd={(password) => this.onEnd(password)}
                />
        );
    }
});

AppRegistry.registerComponent('AppDemo', () => AppDemo);