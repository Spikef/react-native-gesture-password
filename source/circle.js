import React, { memo, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import PropTypes from "prop-types";

const Circle = memo(({ color, normalColor, fill, x, y, r, inner, outer }) => {
  const _styleContainer = useMemo(
    () => [
      styles.outer,
      {
        left: x - r,
        top: y - r,
        width: 2 * r,
        height: 2 * r,
        borderRadius: r,
      },
      { borderColor: normalColor },
      fill && { borderColor: color },
      !outer && { borderWidth: 0 },
    ],
    [x, r, y, normalColor, color, fill, outer],
  );

  const _styleIner = useMemo(
    () => [
      !outer && styles.inner,
      {
        width: (2 * r) / 3,
        height: (2 * r) / 3,
        borderRadius: r / 3,
        backgroundColor: fill ? color : "transparent",
      },
    ],
    [r, outer, fill, color],
  );

  return (
    <View style={_styleContainer}>{inner && <View style={_styleIner} />}</View>
  );
});

Circle.propTypes = {
  color: PropTypes.string,
  fill: PropTypes.bool,
  x: PropTypes.number,
  y: PropTypes.number,
  r: PropTypes.number,
  inner: PropTypes.bool,
  outer: PropTypes.bool,
};

Circle.defaultProps = {
  inner: true,
  outer: true,
};

const styles = StyleSheet.create({
  outer: {
    position: "absolute",
    borderColor: "#8E91A8",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  inner: {
    backgroundColor: "#8E91A8",
  },
});

export default Circle;

module.exports = Circle; // for compatible with require only
