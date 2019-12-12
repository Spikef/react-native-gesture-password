import { isEquals, getTransform } from "./helper";
import React, { PureComponent } from "react";
import { StyleSheet, View } from "react-native";
import PropTypes from "prop-types";
export default class Line extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { ...props };
  }

  setNativeProps(props) {
    this.setState(props);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.color !== state.color) {
      return {
        color: props.color,
      };
    }
    return null;
  }

  render() {
    let { start, end, color, transparentLine } = this.state;

    if (isEquals(start, end)) return null;

    let transform = getTransform(start, end);
    let length = transform.d;
    let angle = transform.a + "rad";
    let moveX = transform.x;
    let moveY = transform.y;

    //for transparent line
    color = transparentLine ? "#00000000" : color;

    return (
      <View
        ref="line"
        style={[
          styles.line,
          {
            backgroundColor: color,
            left: start.x,
            top: start.y,
            width: length,
          },
          {
            transform: [
              { translateX: moveX },
              { translateY: moveY },
              { rotateZ: angle },
            ],
          },
        ]}
      />
    );
  }
}

Line.propTypes = {
  color: PropTypes.string,
  start: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  end: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
};

Line.defaultProps = {
  color: "#8E91A8",
  start: { x: 0, y: 0 },
  end: { x: 0, y: 0 },
};

const styles = StyleSheet.create({
  line: {
    position: "absolute",
    height: 1,
  },
});

module.exports = Line; // for compatible with require only
