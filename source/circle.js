var helper = require('./helper');

var React = require('react-native');
var {
    StyleSheet,
    PropTypes,
    View,
    } = React;

var Circle = React.createClass({
    propTypes: {
        color: PropTypes.string,
        fill: PropTypes.bool,
        x: PropTypes.number,
        y: PropTypes.number,
        r: PropTypes.number
    },
    render: function() {
        var {color, fill, x, y, r} = this.props;

        return (
            <View style={[styles.outer,
                        {left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: r},
                        fill && {borderColor: color}]}>

                {fill && <View style={{width: 2 * r / 3, height: 2 * r / 3, borderRadius: r / 3, backgroundColor: color}} />}
            </View>
        )
    }
});

var styles = StyleSheet.create({
    outer: {
        position: 'absolute',
        borderColor: '#8E91A8',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

module.exports = Circle;