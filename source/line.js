var helper = require('./helper');

var React = require('react-native');
var {
    StyleSheet,
    PropTypes,
    View,
    } = React;

var Line = React.createClass({
    propTypes: {
        color: PropTypes.string,
        start: PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number
        }),
        end: PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number
        })
    },
    getDefaultProps: function() {
        return {
            color: '#8E91A8',
            start: {x: 0, y: 0},
            end: {x: 0, y: 0}
        }
    },
    setNativeProps: function(props) {
        this.setState(props);
    },
    componentWillReceiveProps: function(nextProps) {
        if ( nextProps.color !== this.props.color ) {
            this.setState({color: nextProps.color});
        }
    },
    getInitialState: function() {
        return this.props;
    },
    render: function() {
        var { start, end, color } = this.state;

        if ( helper.isEquals(start, end) ) return null;

        var transform = helper.getTransform(start, end);
        var length = transform.d;
        var angle = transform.a + 'rad';
        var moveX = transform.x;
        var moveY = transform.y;

        return (
            <View ref='line' style={[
                styles.line, {backgroundColor: color, left: start.x, top: start.y, width: length},
                {transform: [{translateX: moveX}, {translateY: moveY}, {rotateZ: angle}]}
            ]} />
        )
    }
});

var styles = StyleSheet.create({
    line: {
        position: 'absolute',
        height: 1
    }
});

module.exports = Line;