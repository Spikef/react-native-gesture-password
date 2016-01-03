var React = require('react-native');
var {
    StyleSheet,
    PropTypes,
    Dimensions,
    PanResponder,
    View,
    Text
    } = React;

var Width = Dimensions.get('window').width;
var Height = Dimensions.get('window').height;
var Top = (Height - Width)/2.0 * 1.5;
var Radius = Width / 10;
var Diameter = Radius * 2;

var Circle = React.createClass({
    propTypes: {
        color: PropTypes.string,
        fill: PropTypes.bool,
        x: PropTypes.number,
        y: PropTypes.number
    },
    render: function() {
        return (
            <View style={[circles.outer,
                        {left: this.props.x - Radius, top: this.props.y - Radius},
                        this.props.fill && {borderColor: this.props.color}]}>
                {this.props.fill && <View style={[circles.inner, {backgroundColor: this.props.color}]} />}
            </View>
        )
    }
});

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
    render: function() {
        var { start, end, color } = this.props;

        if ( helper.isEquals(start, end) ) return null;

        var transform = helper.getTransform(start, end);
        var length = transform.d;
        var angle = transform.a + 'rad';
        var moveX = transform.x;
        var moveY = transform.y;

        return (
            <View style={[
                circles.line, {backgroundColor: color, left: start.x, top: start.y, width: length},
                {transform: [{translateX: moveX}, {translateY: moveY}, {rotateZ: angle}]}
            ]} />
        )
    }
});

var GesturePassword = React.createClass({
    timer: null,
    lastIndex: -1,
    sequence: '',   // 手势结果
    isMoving: false,
    propTypes: {
        message: PropTypes.string,
        rightColor: PropTypes.string,
        wrongColor: PropTypes.string,
        status: PropTypes.oneOf(['right', 'wrong', 'normal']),
        onStart: PropTypes.func,
        onEnd: PropTypes.func,
        interval: PropTypes.number
    },
    getDefaultProps: function() {
        return {
            message: '',
            rightColor: '#5FA8FC',
            wrongColor: '#D93609',
            status: 'normal',
            interval: 0
        }
    },
    getInitialState: function() {
        var circles = [];
        var Margin = Radius;
        for (let i=0; i < 9; i++) {
            let p = i % 3;
            let q = parseInt(i / 3);
            circles.push({
                isActive: false,
                x: p * (Radius * 2 + Margin) + Margin + Radius,
                y: q * (Radius * 2 + Margin) + Margin + Radius
            });
        }

        return {
            circles: circles,
            lines: []
        }
    },
    componentWillMount: function() {
        this._panResponder = PanResponder.create({
            // 要求成为响应者：
            onStartShouldSetPanResponder: (event, gestureState) => true,
            onStartShouldSetPanResponderCapture: (event, gestureState) => true,
            onMoveShouldSetPanResponder: (event, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (event, gestureState) => true,

            // 开始手势操作
            onPanResponderGrant: (event, gestureState) => {
                this.onStart(event, gestureState);
            },
            // 移动操作
            onPanResponderMove: (event, gestureState) => {
                this.onMove(event, gestureState);
            },
            // 释放手势
            onPanResponderRelease: (event, gestureState) => {
                this.onEnd(event, gestureState);
            }
        });
    },
    render: function() {
        var textColor = this.props.status === 'wrong' ? this.props.wrongColor : this.props.rightColor;

        return (
            <View style={[styles.frame, this.props.style, {flex: 1}]}>
                <View style={styles.message}>
                    <Text style={[styles.msgText, {color: textColor}]}>
                        {this.state.message || this.props.message}
                    </Text>
                </View>
                <View style={styles.board} {...this._panResponder.panHandlers}>
                    {this.renderCircles()}
                    {this.renderLines()}
                </View>

                {this.props.children}
            </View>
        )
    },
    renderCircles: function() {
        var array = [], fill, color;
        var{ status, wrongColor, rightColor } = this.props;

        this.state.circles.forEach(function(c, i) {
            fill = c.isActive;
            color = status === 'wrong' ? wrongColor : rightColor;

            array.push(
                <Circle key={'c_' + i} fill={fill} color={color} x={c.x} y={c.y} />
            )
        });

        return array;
    },
    renderLines: function() {
        var array = [], color;
        var{ status, wrongColor, rightColor } = this.props;

        this.state.lines.forEach(function(l, i) {
            color = status === 'wrong' ? wrongColor : rightColor;

            array.push(
                <Line key={'l_' + i} color={color} start={l.start} end={l.end} />
            )
        });

        return array;
    },
    setActive: function(index) {
        this.state.circles[index].isActive = true;
        this.forceUpdate();
    },
    resetActive: function() {
        this.state.lines = [];
        for (let i=0; i < 9; i++) {
            this.state.circles[i].isActive = false;
        }

        this.forceUpdate();
    },
    getTouchChar: function(touch) {
        var x = touch.x;
        var y = touch.y;

        for (let i=0; i < 9; i++) {
            if ( helper.isPointInCircle({x, y}, this.state.circles[i], Radius) ) {
                return String(i);
            }
        }

        return false;
    },
    onStart: function(e, g) {
        var x = e.nativeEvent.pageX;
        var y = e.nativeEvent.pageY - Top;

        var lastChar = this.getTouchChar({x, y});
        if ( lastChar ) {
            this.isMoving = true;
            this.lastIndex = Number(lastChar);
            this.sequence = lastChar;
            this.resetActive();
            this.setActive(this.lastIndex);

            this.state.lines.push({
                start: {
                    x: this.state.circles[this.lastIndex].x,
                    y: this.state.circles[this.lastIndex].y
                },
                end: {
                    x: this.state.circles[this.lastIndex].x,
                    y: this.state.circles[this.lastIndex].y
                }
            });

            this.props.onStart && this.props.onStart();

            if ( this.props.interval>0 ) {
                clearTimeout(this.timer);
            }
        }
    },
    onMove: function(e, g) {
        var x = e.nativeEvent.pageX;
        var y = e.nativeEvent.pageY - Top;

        if ( this.isMoving ) {
            this.state.lines[this.state.lines.length - 1].end = {x, y};
            this.forceUpdate();
        }

        if ( this.isMoving && !helper.isPointInCircle({x, y}, this.state.circles[this.lastIndex], Radius) ) {
            var lastChar = this.getTouchChar({x, y});
            if ( lastChar && this.sequence.indexOf(lastChar) === -1 ) {
                this.lastIndex = Number(lastChar);
                this.sequence += lastChar;

                this.state.lines[this.state.lines.length - 1].end = {
                    x: this.state.circles[this.lastIndex].x,
                    y: this.state.circles[this.lastIndex].y
                };

                this.state.lines.push({
                    start: {
                        x: this.state.circles[this.lastIndex].x,
                        y: this.state.circles[this.lastIndex].y
                    },
                    end: {
                        x: this.state.circles[this.lastIndex].x,
                        y: this.state.circles[this.lastIndex].y
                    }
                });

                this.setActive(this.lastIndex);
            }
        }
    },
    onEnd: function(e, g) {
        if ( this.isMoving ) {
            var password = helper.getRealPassword(this.sequence);
            this.sequence = '';
            this.lastIndex = -1;
            this.isMoving = false;

            var lastLine = this.state.lines[this.state.lines.length - 1];
            if ( !helper.isEquals(lastLine.start, lastLine.end) ) {
                this.state.lines.pop();
                this.forceUpdate();
            }

            this.props.onEnd && this.props.onEnd(password);

            if ( this.props.interval>0 ) {
                this.timer = setTimeout(() => this.resetActive(), this.props.interval);
            }
        }
    }
});

var helper = {
    isPointInCircle: function(point, center, radius) {
        var d = this.getDistance(point, center);

        return d <= radius;
    },
    getRealPassword: function(str) {
        return str.replace(/\d/g, function($0) {
            return Number($0) + 1;
        });
    },
    getDistance: function(pt1, pt2) {
        var a = Math.pow((pt1.x - pt2.x), 2);
        var b = Math.pow((pt1.y - pt2.y), 2);
        var d = Math.sqrt(a + b);

        return d;
    },
    getTransform: function(pt1, pt2) {
        var d = this.getDistance(pt1, pt2);

        var c = (pt2.x - pt1.x) / d;
        var a = Math.acos(c);           // 旋转角度
        if ( pt1.y > pt2.y ) a = 2 * Math.PI - a;

        var c1 = {
            x: pt1.x + d / 2,
            y: pt1.y
        };
        var c2 = {
            x: (pt2.x + pt1.x) / 2,
            y: (pt2.y + pt1.y) /2
        };
        var x = c2.x - c1.x;
        var y = c2.y - c1.y;

        return {d, a, x, y};
    },
    isEquals: function(pt1, pt2) {
        return (pt1.x === pt2.x && pt1.y === pt2.y);
    }
};

var styles = StyleSheet.create({
    frame: {
        backgroundColor: '#292B38'
    },
    board: {
        position: 'absolute',
        left: 0,
        top: Top,
        width: Width,
        height: Height
    },
    message: {
        position: 'absolute',
        left: 0,
        top: Top / 2.2,
        width: Width,
        height: Top / 3,
        alignItems: 'center',
        justifyContent: 'center'
    },
    msgText: {
        fontSize: 14
    }
});

var circles = StyleSheet.create({
    outer: {
        position: 'absolute',
        width: Diameter,
        height: Diameter,
        borderRadius: Radius,
        borderColor: '#8E91A8',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    inner: {
        width: Diameter / 3,
        height: Diameter / 3,
        borderRadius: Radius / 3
    },
    line: {
        position: 'absolute',
        height: 1
    }
});

module.exports = GesturePassword;