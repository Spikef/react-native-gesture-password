var helper = require('./helper');

var React = require('react-native');
var {
    StyleSheet,
    PropTypes,
    Dimensions,
    PanResponder,
    View,
    Text
    } = React;

var Line = require('./line');
var Circle = require('./circle');

var Width = Dimensions.get('window').width;
var Height = Dimensions.get('window').height;
var Top = (Height - Width)/2.0 * 1.5;
var Radius = Width / 10;

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
        onReset: PropTypes.func,
        interval: PropTypes.number,
        allowCross: PropTypes.bool
    },
    getDefaultProps: function() {
        return {
            message: '',
            rightColor: '#5FA8FC',
            wrongColor: '#D93609',
            status: 'normal',
            interval: 0,
            allowCross: false
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
        var color = this.props.status === 'wrong' ? this.props.wrongColor : this.props.rightColor;

        return (
            <View style={[styles.frame, this.props.style, {flex: 1}]}>
                <View style={styles.message}>
                    <Text style={[styles.msgText, this.props.textStyle, {color: color}]}>
                        {this.state.message || this.props.message}
                    </Text>
                </View>
                <View style={styles.board} {...this._panResponder.panHandlers}>
                    {this.renderCircles()}
                    {this.renderLines()}
                    <Line ref='line' color={color} />
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
                <Circle key={'c_' + i} fill={fill} color={color} x={c.x} y={c.y} r={Radius} />
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

        var circles = this.state.circles;
        this.setState({circles});
    },
    resetActive: function() {
        this.state.lines = [];
        for (let i=0; i < 9; i++) {
            this.state.circles[i].isActive = false;
        }

        var circles = this.state.circles;
        this.setState({circles});
        this.props.onReset && this.props.onReset();
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
    getCrossChar: function(char) {
        var middles = '13457', last = String(this.lastIndex);

        if ( middles.indexOf(char) > -1 || middles.indexOf(last) > -1 ) return false;

        var point = helper.getMiddlePoint(this.state.circles[last], this.state.circles[char]);

        for (let i=0; i < middles.length; i++) {
            let index = middles[i];
            if ( helper.isEquals(point, this.state.circles[index]) ) {
                return String(index);
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

            var point = {
                x: this.state.circles[this.lastIndex].x,
                y: this.state.circles[this.lastIndex].y
            };

            this.refs.line.setNativeProps({start: point, end: point});

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
            this.refs.line.setNativeProps({end: {x, y}});

            var lastChar = null;

            if ( !helper.isPointInCircle({x, y}, this.state.circles[this.lastIndex], Radius) ) {
                lastChar = this.getTouchChar({x, y});
            }

            if ( lastChar && this.sequence.indexOf(lastChar) === -1 ) {
                if ( !this.props.allowCross ) {
                    var crossChar = this.getCrossChar(lastChar);

                    if ( crossChar && this.sequence.indexOf(crossChar) === -1 ) {
                        this.sequence += crossChar;
                        this.setActive(Number(crossChar));
                    }
                }

                var lastIndex = this.lastIndex;
                var thisIndex = Number(lastChar);

                this.state.lines.push({
                    start: {
                        x: this.state.circles[lastIndex].x,
                        y: this.state.circles[lastIndex].y
                    },
                    end: {
                        x: this.state.circles[thisIndex].x,
                        y: this.state.circles[thisIndex].y
                    }
                });

                this.lastIndex = Number(lastChar);
                this.sequence += lastChar;

                this.setActive(this.lastIndex);

                var point = {
                    x: this.state.circles[this.lastIndex].x,
                    y: this.state.circles[this.lastIndex].y
                };

                this.refs.line.setNativeProps({start: point});
            }
        }

        if ( this.sequence.length === 9 ) this.onEnd();
    },
    onEnd: function(e, g) {
        if ( this.isMoving ) {
            var password = helper.getRealPassword(this.sequence);
            this.sequence = '';
            this.lastIndex = -1;
            this.isMoving = false;

            var origin = {x: 0, y: 0};
            this.refs.line.setNativeProps({start: origin, end: origin});

            this.props.onEnd && this.props.onEnd(password);

            if ( this.props.interval>0 ) {
                this.timer = setTimeout(() => this.resetActive(), this.props.interval);
            }
        }
    }
});

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

module.exports = GesturePassword;
