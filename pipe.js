'use strict'

function Pipe(circle1, circle2, startAngle, endAngle) {
  this.circle1 = circle1
  this.circle2 = circle2
  this.startAngle = startAngle
  this.endAngle = endAngle
  this.long = (endAngle - startAngle) >= Math.PI ? 1 : 0
}

Pipe.fromAngleLength = function (circle1, circle2, startAngle, angleLength) {
  var delta = angleLength / 2
  //console.log(startAngle, angleLength, delta)
  return new Pipe(circle1, circle2, startAngle - delta, startAngle + delta)
}

Pipe.prototype.getCenterAngle = function () {
  return this.startAngle + (this.endAngle - this.startAngle)
}

Pipe.prototype.setStartAngle = function (angle) {
  this.startAngle = angle
}

Pipe.prototype.setEndAngle = function (angle) {
  this.endAngle = angle
}

Pipe.prototype.setAngles = function (startAngle, angleLength) {
  var delta = angleLength / 2
  this.setStartAngle(startAngle - delta)
  this.setEndAngle(startAngle + delta)
  this.getLong()
}

Pipe.prototype.getLong = function() {
  this.long = (this.endAngle - this.startAngle) >= Math.PI ? 1 : 0
}

Pipe.prototype.createPath = function () {
  return createPath(this.circle1, this.circle2, this.startAngle, this.endAngle, this.long)
}

Pipe.prototype.toSvg = function (attributes) {
  var c
  c = document.createElementNS("http://www.w3.org/2000/svg", "path")

  // c.setAttributeNS(null, "cx", pointOnCircle.x);
  // c.setAttributeNS(null, "cy", pointOnCircle.y);
  c.setAttributeNS(null, "d", this.createPath())

  if (attributes) {
    Object.keys(attributes)
      .forEach(key => {
        c.setAttributeNS(null, key, attributes[key])
      })
  } else {
    c.setAttributeNS(null, "fill-opacity", 0.2)
    c.setAttributeNS(null, "fill", "#555")
  }

  // c.setAttributeNS(null, "stroke", "#d0a7dd")
  // c.setAttributeNS(null, "stroke-width", 2)

  return c
}

var createPath = (function () {
  var op, op2, ip, ip2
  var r1, r2

  return function createPath(circle1, circle2, startAngle, endAngle, long) {

    r1 = circle1.radius
    op = circle1.pointOnRadius(startAngle)
    op2 = circle1.pointOnRadius(endAngle)

    r2 = circle2.radius
    ip = circle2.pointOnRadius(startAngle)
    ip2 = circle2.pointOnRadius(endAngle)

    return createPathFromPoints(r1, op, op2, r2, ip, ip2, long)
  }
})()

function createPathFromPoints (r1, op, op2, r2, ip, ip2, long) {
  return `M ${op.x} ${op.y} A ${r1} ${r1} 0 ${long} 1 ${op2.x} ${op2.y}
              L ${ip2.x} ${ip2.y} 
              A ${r2} ${r2} 0 ${long} 0 ${ip.x} ${ip.y} Z`
}