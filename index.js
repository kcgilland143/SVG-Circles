'use strict'

var svg = document.getElementById("main-svg")
const INNER_CIRCLE_RADIUS = 5
const INNER_CIRCLE_OFFSET = 45

var halfPi = Math.PI / 2
var twoPi = (2 * Math.PI)

console.log(svg)

var getRotationString = (function getRotationString() {
	var rStrings = {}
	var cur;
	return function rotationString(rotation) {
		cur = Math.round(radToDegree(rotation) + 'e+2') + 'e-2'
		if (!rStrings[cur]) rStrings[cur] = `rotate(${cur} 0 0)`
		return rStrings[cur]
	}
})()

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
  var cSize = startSize
  var totalSize = 0
  var offsetRange = (endOffset - startOffset)
  if (minMargin) {
    for (var s = 0; s < this.steps; s++) {
      totalSize += s > 0 ? cSize * 2 : cSize
      cSize -= sDelta
    }
    if (totalSize > offsetRange) {
      console.log('total size of circles is greater than offset range')
      minMargin = 0
      totalSize = 0
    }
  }
  var oDelta = (offsetRange - totalSize) / steps

  var cur
  var cOffset = startOffset
  cSize = startSize

  for (var i = 0; i < this.steps; i++) {
    cur = new Circle(0, cOffset, cSize)
    this.circles.push(cur)

    cSize = cSize - sDelta
    cOffset = minMargin ? cOffset + (2 * cSize) + oDelta : cOffset + oDelta
  }
}

var colors = ["#2CA02C", "#37ABC8", "#FF7F2A", "#C83737", "#FFCC00"]

var iCTest = new stepInnerCircles(10, 1, 14, 108, 8, 1)

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

    this.render = this.render.bind(this, cur)

    return this.render(cur)
  }

  circle.update = (function () {
    var timeDelta, angle
    return function circleUpdate (el, timestamp) {
      // console.log(timestamp)
      timeDelta = timestamp - (this.lastUpdate || timestamp)
      angle = this.angle + (this.speed * timeDelta)
      if (angle >= twoPi) angle = angle - twoPi
      this.angle = angle
      this.lastUpdate = timestamp
      return this.render
    }
  })()

  circle.render = function circleRender (el) {
    this.p = pointOnRadius(circleTest.cx, circleTest.cy, this.rotateRadius, this.angle)

    el.setAttributeNS(null, "cx", this.p.x)
    el.setAttributeNS(null, "cy", this.p.y)

    return el
  }

  circle.onPause = function (pausedBool) {
    if (pausedBool) { this.lastUpdate = 0 }
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
spinningCircles.paused = true
spinningCircles.enter()
spinningCircles.tick = function tickCircles (t) {
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
  pipe.speed = pipe.speed ? pipe.speed : (Math.random() * 0.01) + 0.005
  pipe.rotation = 0
  pipe.getElement = function () {
    var el = this.toSvg({'fill-opacity': 0.5})
    el.setAttributeNS(null, 'fill', colors[Math.floor(Math.random() * colors.length)])
    return el
  }
  var sA, eA
  pipe.update = function (el, timestamp) {
    sA = this.rotation + this.speed
    this.rotation = sA >= twoPi ? sA - twoPi : sA
    // sA = this.startAngle + this.speed
    // eA = this.endAngle + this.speed
    // this.setStartAngle(sA > twoPi ? sA - twoPi : sA)
    // this.setEndAngle(sA > twoPi ? eA - twoPi : eA)
    return this.render.bind(this, el)
  }
  pipe.render = function (el) {
    el.setAttributeNS(null, 'transform', getRotationString(this.rotation))
  }
})

var svg2 = document.getElementById('second-svg')
var spinningPipes = new Animation(svg2, pipes)

spinningPipes.enter()
spinningPipes.paused = true
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

var milliDelta = twoPi / 1000
var secondDelta = twoPi / 60
var minuteDelta = twoPi / 60
var hourDelta = twoPi / 12

var hourPipe = Pipe.fromAngleLength(circles[6], circles[14], -halfPi, (Math.PI / 6))
var minutePipe = Pipe.fromAngleLength(circles[4], circles[16], -halfPi, secondDelta * 2)
var secondPipe = Pipe.fromAngleLength(circles[2], circles[18], -halfPi, secondDelta / 2)
var milliPipe = Pipe.fromAngleLength(circles[0], circles[1], -halfPi, Math.PI)

var clockPipes = [hourPipe, minutePipe, secondPipe, milliPipe]

var timeObject = new Date()

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
milliPipe.update = (function () {
  var t, lastTick
  return function milliUpdate(el, timestamp) {
    t = arguments[2] % 100
    if (lastTick <= t) { timeObject = new Date() }
    lastTick = t
    milliPipe.setAngles(-halfPi, (milliDelta * (arguments[2] % 1000)))
    return updatePath.bind(null, el, milliPipe.createPath())
  }
})()

function updatePath (el, path) {
  el.setAttributeNS(null, 'd', path)
}

var Clock = new Animation(svg3, clockPipes)
Clock.enter()
Clock.paused = true

function clockTick () {
  Clock.update(timeObject, ...arguments)
  Clock.render()
  window.requestAnimationFrame(clockTick)
}
window.requestAnimationFrame(clockTick)

// UI 

var animations = [spinningCircles, spinningPipes, Clock]

animations.forEach((an) => {
  an.target.addEventListener('click', (function () {
    var toggle = new boolToggle()
    return function () {
      an.pause(toggle())
    }
  })())
})