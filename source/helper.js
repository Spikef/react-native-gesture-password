exports.isPointInCircle = function(point, center, radius) {
    var d = this.getDistance(point, center);

    return d <= radius;
};

exports.getDistance = function(pt1, pt2) {
    var a = Math.pow((pt1.x - pt2.x), 2);
    var b = Math.pow((pt1.y - pt2.y), 2);
    var d = Math.sqrt(a + b);

    return d;
};

exports.getTransform = function(pt1, pt2) {
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
};

exports.isEquals = function(pt1, pt2) {
    return (pt1.x === pt2.x && pt1.y === pt2.y);
};

exports.getMiddlePoint = function(pt1, pt2) {
    return {
        x: (pt2.x + pt1.x) / 2,
        y: (pt2.y + pt1.y) /2
    };
};

exports.getRealPassword = function(str) {
    return str.replace(/\d/g, function($0) {
        return Number($0) + 1;
    });
};