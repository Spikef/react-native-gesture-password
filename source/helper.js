export function isPointInCircle(point, center, radius) {
    let d = getDistance(point, center);

    return d <= radius;
}

export function getDistance(pt1, pt2) {
    let a = Math.pow((pt1.x - pt2.x), 2);
    let b = Math.pow((pt1.y - pt2.y), 2);
    let d = Math.sqrt(a + b);

    return d;
}

export function getTransform(pt1, pt2) {
    let d = getDistance(pt1, pt2);

    let c = (pt2.x - pt1.x) / d;
    let a = Math.acos(c);           // 旋转角度
    if ( pt1.y > pt2.y ) a = 2 * Math.PI - a;

    let c1 = {
        x: pt1.x + d / 2,
        y: pt1.y
    };
    let c2 = {
        x: (pt2.x + pt1.x) / 2,
        y: (pt2.y + pt1.y) /2
    };
    let x = c2.x - c1.x;
    let y = c2.y - c1.y;

    return {d, a, x, y};
}

export function isEquals(pt1, pt2) {
    return (pt1.x === pt2.x && pt1.y === pt2.y);
}

export function getMiddlePoint(pt1, pt2) {
    return {
        x: (pt2.x + pt1.x) / 2,
        y: (pt2.y + pt1.y) /2
    };
}

export function getRealPassword(str) {
    return str.replace(/\d/g, function($0) {
        return Number($0) + 1;
    });
}