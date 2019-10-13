var svg = document.getElementById("main-svg")
const INNER_CIRCLE_RADIUS = 5
const INNER_CIRCLE_OFFSET = 45

var halfPi = Math.PI / 2
var twoPi = (2 * Math.PI)

console.log(svg)

var pointOnCircle = circleTest.pointOnRadius(0)

function stepInnerCircles (
  startSize,
  endSize,
  startOffset,
  endOffset,
  steps,
  minMargin
) {
  this.circles = []
  this.startSize = startSize
  this.endSize = endSize
  this.startOffset = startOffset
  this.endOffset = endOffset
  this.steps = steps
  this.minMargin = minMargin

  var sDelta = (startSize - endSize) / steps
  var oDelta = (startOffset - endOffset) / steps

  var cur
  var cSize = startSize
  var cOffset = startOffset

  for (var i = 0; i < this.steps; i++) {
    cur = new Circle(0, cOffset, cSize)
    this.circles.push(cur)

    cOffset = cOffset - oDelta
    cSize = cSize - sDelta
  }
}

var colors = ["#2CA02C", "#37ABC8", "#FF7F2A", "#C83737", "#FFCC00"]

var iCTest = new stepInnerCircles(10, 1, 14, 102, 10, 4)

iCTest.circles.forEach((circle, i) => {
  circle.angle = 0
  circle.speed = 0.002 - 0.0002 * i
  circle.rotateRadius = circle.cy
  circle.getElement = function () {
    var cur
    cur = document.createElementNS("http://www.w3.org/2000/svg", "circle")

    cur.setAttributeNS(null, "id", "i-circle-" + i)
    cur.setAttributeNS(null, "cx", this.cx + circleTest.cx)
    cur.setAttributeNS(null, "cy", this.cy + circleTest.cy)
    cur.setAttributeNS(null, "r", this.radius)
    cur.setAttributeNS(
      null,
      "fill",
      colors[Math.floor(Math.random() * colors.length)]
    )
    cur.setAttributeNS(null, "fill-opacity", 0.5)

    return cur
  }
  circle.update = function (el, timestamp) {
    // console.log(timestamp)
    var timeDelta = timestamp - (this.lastUpdate || timestamp)
    var angle = this.angle + (this.speed * timeDelta)
    angle = angle >= twoPi ? angle - twoPi : angle
    this.angle = angle
    this.lastUpdate = timestamp
    return this.render.bind(this, el)
  }
  circle.render = function (el) {
    var p = pointOnRadius(circleTest.cx, circleTest.cy, this.rotateRadius, this.angle)

    el.setAttributeNS(null, "cx", p.x)
    el.setAttributeNS(null, "cy", p.y)
  }
})

var multiCircles = []
for (var c = 0; c < 4; c++) {
  iCTest.circles.forEach((circle) => {
    var nC = Object.assign({}, circle, {angle: c * halfPi})
    multiCircles.push(nC)
  })
}

var spinningCircles = new Animation(svg, multiCircles)
spinningCircles.paused = false
spinningCircles.enter()
spinningCircles.tick = function (t) {
  spinningCircles.update(t)
  spinningCircles.render()
  window.requestAnimationFrame(spinningCircles.tick)
}
window.requestAnimationFrame(spinningCircles.tick)

// Tech Circles

var circles = Array.from({ length: 20 },
  (n, i) => new Circle(circleTest.cx, circleTest.cy, circleTest.radius - (5 * i)))

var myPipe = new Pipe(circles[0], circles[1], 0, 1)
var pipe2 = new Pipe(circles[2], circles[4], 1, 1 + Math.PI)
var pipe3 = new Pipe(circles[6], circles[9], 3, 4)
var pipes = [myPipe, pipe2, pipe3]
for (var i = 1; i < 10; i++) {
  var startI = Math.floor(Math.random() * (circles.length - 1))
  var start = Math.random() * (2 * Math.PI)
  pipes.push(new Pipe(circles[startI],
    circles[startI + Math.floor(Math.random() * (circles.length - startI - 1) + 1)],
    start, start + 0.1 + (Math.random() * Math.PI)
  ))
}

pipes.forEach((pipe, i) => {
  pipe.speed = pipe.speed ? pipe.speed : (Math.random() * 0.01) + 0.001
  pipe.getElement = function () {
    var el = pipe.toSvg({'fill-opacity': 0.5})
    el.setAttributeNS(null, 'fill', colors[Math.floor(Math.random() * colors.length)])
    return el
  }
  pipe.update = function (el, timestamp) {
    var sA = pipe.startAngle + pipe.speed
    var eA = pipe.endAngle + pipe.speed
    pipe.setStartAngle(sA > twoPi ? sA - twoPi : sA)
    pipe.setEndAngle(sA > twoPi ? eA - twoPi : eA)
    return function () {
      el.setAttributeNS(null, 'd', pipe.createPath())
    }
  }
})

var svg2 = document.getElementById('second-svg')
var spinningPipes = new Animation(svg2, pipes)

spinningPipes.enter()
spinningPipes.paused = false
spinningPipes.tick = function () {
  spinningPipes.update()
  spinningPipes.render()
  window.requestAnimationFrame(spinningPipes.tick)
}
window.requestAnimationFrame(spinningPipes.tick)

//Clock

var svg3 = document.getElementById('third-svg')

var clockTicks = Array.from({length: 12}, (n, i) => {
  var p = new Pipe.fromAngleLength(circles[1], circles[3], 0 + (twoPi / 12 * i), twoPi / 360)
  var el = p.toSvg()
  el.setAttributeNS(null, 'fill-opacity', 1)
  el.setAttributeNS(null, 'fill', '#999')
  svg3.appendChild(el)
  return el
})

var hourPipe = Pipe.fromAngleLength(circles[6], circles[14], -halfPi, (Math.PI / 6))
var minutePipe = Pipe.fromAngleLength(circles[4], circles[16], -halfPi, (Math.PI / 30))
var secondPipe = Pipe.fromAngleLength(circles[2], circles[18], -halfPi, (Math.PI / (30 * 60)))
var milliPipe = Pipe.fromAngleLength(circles[0], circles[1], Math.PI, Math.PI)

var clockPipes = [hourPipe, minutePipe, secondPipe, milliPipe]

var milliDelta = twoPi / 1000
var secondDelta = twoPi / 60
var minuteDelta = twoPi / 60
var hourDelta = twoPi / 12

var timeObject = new Date()
var lastTick

clockPipes.forEach((pipe, i) => {
  pipe.getElement = () => pipe.toSvg({
    'fill': colors[i],
    'fill-opacity': 1
  })
})

hourPipe.update = function (el, timestamp) {
  hourPipe.setAngles(-halfPi + (hourDelta * (timestamp.getHours() % 12)), hourDelta)
  return updatePath.bind(null, el, hourPipe.createPath())
}
minutePipe.update = function (el, timestamp) {
  minutePipe.setAngles(-halfPi + (minuteDelta * timestamp.getMinutes()), minuteDelta * 2)
  return updatePath.bind(null, el, minutePipe.createPath())
}
secondPipe.update = function (el, timestamp) {
  secondPipe.setAngles(-halfPi + (secondDelta * timestamp.getSeconds()), secondDelta / 2)
  return updatePath.bind(null, el, secondPipe.createPath())
}
milliPipe.update = function (el, timestamp) {
  var t = arguments[2] % 1000
  if (lastTick <= t) { timeObject = new Date() }
  lastTick = t
  milliPipe.setAngles(-halfPi, (milliDelta * (arguments[2] % 1000)))
  return updatePath.bind(null, el, milliPipe.createPath())
}

function updatePath (el, path) {
  el.setAttributeNS(null, 'd', path)
}

var Clock = new Animation(svg3, clockPipes)
Clock.enter()
Clock.paused = false

function clockTick () {
  Clock.update(timeObject, ...arguments)
  Clock.render()
  window.requestAnimationFrame(clockTick)
}
window.requestAnimationFrame(clockTick)