import { isEquals, getTransform } from './helper'
import React, { PropTypes, Component } from 'react'
import { StyleSheet, View } from 'react-native'

export default class Line extends Component {
    constructor(props) {
        super(props);

        this.state = this.props;
    }

    setNativeProps(props) {
        this.setState(props);
    }

    componentWillReceiveProps(nextProps) {
        if ( nextProps.color !== this.props.color ) {
            this.setState({color: nextProps.color});
        }
    }

    render() {
        console.log(this.state)
        let { start, end, color } = this.state;

        if ( isEquals(start, end) ) return null;

        let transform = getTransform(start, end);
        let length = transform.d;
        let angle = transform.a + 'rad';
        let moveX = transform.x;
        let moveY = transform.y;

        return (
            <View ref='line' style={[
                styles.line, {backgroundColor: color, left: start.x, top: start.y, width: length},
                {transform: [{translateX: moveX}, {translateY: moveY}, {rotateZ: angle}]}
            ]} />
        )
    }
}

Line.propTypes = {
    color: PropTypes.string,
    start: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number
    }),
    end: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number
    })
}

Line.defaultProps = {
    color: '#8E91A8',
    start: {x: 0, y: 0},
    end: {x: 0, y: 0}
}

const styles = StyleSheet.create({
    line: {
        position: 'absolute',
        height: 1
    }
})

module.exports = Line    // for compatible with require only