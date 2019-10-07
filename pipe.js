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

Pipe.prototype.toSvg = function () {
  var c
  c = document.createElementNS("http://www.w3.org/2000/svg", "path")

  // c.setAttributeNS(null, "cx", pointOnCircle.x);
  // c.setAttributeNS(null, "cy", pointOnCircle.y);
  c.setAttributeNS(null, "d", this.createPath())
  c.setAttributeNS(null, "fill", "#d0a7dd")
  c.setAttributeNS(null, "fill-opacity", 0.2)

  // c.setAttributeNS(null, "stroke", "#d0a7dd")
  // c.setAttributeNS(null, "stroke-width", 2)

  return c
}

function createPath(circle1, circle2, startAngle, endAngle, long) {
  var op, op2, ip, ip2
  var r1, r2

  r1 = circle1.radius
  op = circle1.pointOnRadius(startAngle)
  op2 = circle1.pointOnRadius(endAngle)

  r2 = circle2.radius
  ip = circle2.pointOnRadius(startAngle)
  ip2 = circle2.pointOnRadius(endAngle)

  var path = `M ${op.x} ${op.y} A ${r1} ${r1} 0 ${long} 1 ${op2.x} ${op2.y}
              L ${ip2.x} ${ip2.y} 
              A ${r2} ${r2} 0 ${long} 0 ${ip.x} ${ip.y} Z`
  return path
}