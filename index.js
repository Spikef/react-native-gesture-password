'use strict';

var React = require('react-native');
var { requireNativeComponent } = React;
var merge = require('merge');

class GesturePassword extends React.Component {
    constructor() {
        super();
        this._onEnd = this._onEnd.bind(this);
        this._onStart = this._onStart.bind(this);
        this._onCancel = this._onCancel.bind(this);
    }
    reset(text) {
        this.refs.password.reset(text);
    }
    setNativeProps(props) {
        this.refs.password.setNativeProps(props);
    }
    _onStart() {
        this.props.onStart && this.props.onStart();
    }
    _onCancel() {
        this.props.onCancel && this.props.onCancel();
    }
    _onEnd(event: Event) {
        var e = event.nativeEvent;
        this.props.onEnd && this.props.onEnd(e.password);
    }
    render() {
        var nativeProps = merge(this.props, {
            onStart: this._onStart,
            onCancel: this._onCancel,
            onEnd: this._onEnd
        });

        return <RNGesturePassword ref='password' {...nativeProps} />;
    }
}

GesturePassword.propTypes = {
    /**
     * 默认提示文本
     */
    inputDefault: React.PropTypes.string,

    /**
     * 当前提示文本
     */
    inputTipText: React.PropTypes.string,

    /**
     * 密码是否输入有误
     */
    gestureError: React.PropTypes.bool,

    /**
     * 开始输入
     */
    onStart: React.PropTypes.func,

    /**
     * 结束输入
     */
    onEnd: React.PropTypes.func,

    /**
     * 取消输入
     */
    onCancel: React.PropTypes.func
};

var RNGesturePassword = requireNativeComponent('RNGesturePassword', GesturePassword);

module.exports = GesturePassword;