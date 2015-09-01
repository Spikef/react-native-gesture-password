# react-native-gesture-password

A gesture password component for React Native

一个React Native的手势密码组件

![image](https://github.com/Spikef/react-native-gesture-password/raw/master/screenshots.gif)

## Usage

```javascript
npm install react-native-gesture-password --save
```

In XCode, in the project navigator, right click Libraries ➜ Add Files to [your project's name], Go to node_modules ➜ react-native-gesture-password and add the `RNGesturePassword.xcodeproj` file

In XCode, in the project navigator, select your project. Add the lib*.a from the RNGesturePassword project to your project's Build Phases ➜ Link Binary With Libraries Click `RNGesturePassword.xcodeproj` file you added before in the project navigator and go the Build Settings tab. Make sure 'All' is toggled on (instead of 'Basic'). Look for Header Search Paths and make sure it contains  both $(SRCROOT)/../react-native/React and $(SRCROOT)/../../React - mark both as recursive.

Run your project (Cmd+R)

## Examples

```javascript

var React = require('react-native');
var {
    AppRegistry,
} = React;

var PasswordGesture = require('react-native-gesture-password');

var Password1 = '';
var PhonePickerDemo = React.createClass({
    // Example for check password
    onEnd: function(password) {
        if (password == '012') {
            this.refs.pg.setNativeProps({
                gestureError: false,
                inputTipText: 'Password is right, success.'
            })
            
            // your codes to close this view
        } else {
            this.refs.pg.setNativeProps({
                gestureError: true,
                inputTipText: 'Password is wrong, try again.'
            });
        }
    },
    onStart: function() {
        this.refs.pg.setNativeProps({
            inputDefault: 'Please input your password.'
        })
    },
    /*
    // Example for set password
    onEnd: function(password) {
        if ( Password1 === '' ) {
            if (password !== '') {
                Password1 = password;
                this.refs.pg.setNativeProps({
                    gestureError: false,
                    inputDefault: 'Please input your password secondly.'
                })
            }
        } else {
            if ( password === Password1 ) {
                this.refs.pg.setNativeProps({
                    gestureError: false,
                    inputTipText: 'Your password is set to ' + password
                });

                // your codes to close this view
            } else {
                this.refs.pg.setNativeProps({
                    gestureError: true,
                    inputTipText: 'Not the same, try again.'
                })
            }
        }
    },
    onStart: function() {
        if ( Password1 === '') {
            this.refs.pg.setNativeProps({
                inputDefault: 'Please input your password.'
            })
        } else {
            this.refs.pg.setNativeProps({
                inputDefault: 'Please input your password secondly.'
            })
        }
    },
     */
    render: function() {
        return (
            <PasswordGesture
                ref='pg'
                inputDefault='Please input your password.'
                onStart={() => this.onStart()}
                onEnd={(password) => this.onEnd(password)}
                />
        );
    }
});

AppRegistry.registerComponent('AppDemo', () => AppDemo);

```
# Credits

This project is inspired by [GesturePasswordView](https://github.com/cluries/GesturePasswordView).
If you have suggestions or bug reports, feel free to send pull request or [create new issue](https://github.com/spikef/react-native-gesture-password/issues/new).