Circle = function (cx, cy, radius) {
  this.cx = cx
  this.cy = cy
  this.radius = radius
}

Circle.prototype.pointOnRadius = function (angle, deg=false) {
  if (deg) angle = degToRadian(angle)
  return pointOnRadius(this.cx, this.cy, this.radius, angle)
}

function degToRadian (deg) {
  return deg * Math.PI / 180
}

function pointOnRadius (cx, cy, r, angle) {
  return {
    x: r * Math.cos(angle) + cx,
    y: r * Math.sin(angle) + cy
  }
}

var circleTest = new Circle(102, 102, 100)

console.log(circleTest.pointOnRadius(90))