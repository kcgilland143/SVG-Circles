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

function rotate2 (arcCircle, element, angle, speed, reverse) {
  var pointOnCircle

  var func = function () {
    pointOnCircle = arcCircle.pointOnRadius(angle)

    element.setAttributeNS(null, "cx", pointOnCircle.x)
    element.setAttributeNS(null, "cy", pointOnCircle.y)

    angle = reverse
      ? angle <= 0
        ? twoPi - angle
        : angle - speed
      : angle >= twoPi
        ? angle - twoPi
        : angle + speed
    window.requestAnimationFrame(func)
  }

  window.requestAnimationFrame(func)
}

var colors = ["#2CA02C", "#37ABC8", "#FF7F2A", "#C83737", "#FFCC00"]

var iCTest = new stepInnerCircles(10, 1, 14, 102, 6, 4)

for (var c = 0; c < 4; c++) {
  iCTest.circles.forEach((circle, i) => {
    var cur
    cur = document.createElementNS("http://www.w3.org/2000/svg", "circle")

    cur.setAttributeNS(null, "id", "i-circle-" + i)
    cur.setAttributeNS(null, "cx", circle.cx + circleTest.cx)
    cur.setAttributeNS(null, "cy", circle.cy + circleTest.cy)
    cur.setAttributeNS(null, "r", circle.radius)
    cur.setAttributeNS(
      null,
      "fill",
      colors[Math.floor(Math.random() * colors.length)]
    )
    cur.setAttributeNS(null, "fill-opacity", 1)

    svg.appendChild(cur)
    // rand angle Math.random() * (2 * Math.PI)
    rotate2(
      new Circle(circleTest.cx, circleTest.cy, circle.cy),
      cur,
      0 + (c * halfPi),
      0.05 - 0.005 * (i)
      // c % 2
    )
  })
}

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

var svg2 = document.getElementById('second-svg')

var pipeElements = pipes.map((pipe) => {
  pipe.speed = pipe.speed ? pipe.speed : (Math.random() * 0.005) + 0.002
  return pipe.toSvg()
})
pipeElements.forEach((pipe) => svg2.appendChild(pipe))
pipeElements.forEach((pipeElement) => pipeElement.setAttributeNS(null, 'fill', colors[Math.floor(Math.random() * colors.length)]))

setInterval(() => {
  pipes.forEach((pipe, i) => {
    var sA = pipe.startAngle + pipe.speed
    pipe.setStartAngle(sA > twoPi ? sA - twoPi : sA)
    pipe.setEndAngle(sA > twoPi ? pipe.endAngle + pipe.speed - twoPi : pipe.endAngle + pipe.speed)
    //pipe.getLong()
    //pipeElements[i].setAttributeNS(null, 'd', pipe.createPath())
  })
}, 0)

// pipes.forEach((p, i) => {
//   TweenLite.to(p, i % 2 == 0 ? 1 : 3, {startAngle: p.startAngle + Math.PI, endAngle: p.endAngle + Math.PI})
// })

//Third circles

var svg3 = document.getElementById('third-svg')

var pipeElements3 = pipes.map((pipe) => pipe.toSvg())
pipeElements3.forEach((pipe) => svg3.appendChild(pipe))
pipeElements3.forEach((pipeElement) => {
  pipeElement.setAttributeNS(null, 'fill', colors[Math.floor(Math.random() * colors.length)])
  pipeElement.setAttributeNS(null, 'fill-opacity', 0.9)
  // pipeElement.setAttributeNS(null, 'stroke', colors[Math.floor(Math.random() * colors.length)])
  // pipeElement.setAttributeNS(null, 'stroke-opacity', 0.2)
})

function rAFCircle() {
  pipeElements3.forEach((el, i) => {
    el.setAttributeNS(null, 'd', pipes[i].createPath())
  })
  window.requestAnimationFrame(rAFCircle)
}

rAFCircle()

//Clock

var svg4 = document.getElementById('fourth-svg')

var clockTicks = Array.from({length: 12}, (n, i) => {
  var p = new Pipe.fromAngleLength(circles[1], circles[3], 0 + (twoPi / 12 * i), twoPi / 360)
  var el = p.toSvg()
  el.setAttributeNS(null, 'fill-opacity', 1)
  el.setAttributeNS(null, 'fill', '#999')
  svg4.appendChild(el)
})

var hourPipe = Pipe.fromAngleLength(circles[6], circles[14], -halfPi, (Math.PI / 6))
var minutePipe = Pipe.fromAngleLength(circles[4], circles[16], -halfPi, (Math.PI / 30))
var secondPipe = Pipe.fromAngleLength(circles[2], circles[18], -halfPi, (Math.PI / (30 * 60)))
var milliPipe = Pipe.fromAngleLength(circles[0], circles[1], Math.PI, Math.PI)

var clockPipes = [hourPipe, minutePipe, secondPipe, milliPipe]

var clockElements = clockPipes.map((pipe) => pipe.toSvg())
clockElements.forEach((pipe, i) => {
  pipe.setAttributeNS(null, 'fill', colors[i])
  pipe.setAttributeNS(null, 'fill-opacity', 1)
  pipe.setAttributeNS(null, 'stroke', 'none')
  svg4.appendChild(pipe)
})

var milliDelta = twoPi / 1000
var secondDelta = twoPi / 60
var minuteDelta = twoPi / 60
var hourDelta = twoPi / 12

setInterval(() => {
  var d = new Date()

  // milliPipe.endAngle = milliPipe.startAngle + milliDelta * d.getMilliseconds()
  // milliPipe.getLong()
  milliPipe.setAngles(-halfPi, (milliDelta * d.getMilliseconds()))

  secondPipe.setAngles(-halfPi + (secondDelta * d.getSeconds()), secondDelta / 2)

  minutePipe.setAngles(-halfPi + (minuteDelta * d.getMinutes()), minuteDelta * 2)

  hourPipe.setAngles(-halfPi + (hourDelta * (d.getHours() % 12)), hourDelta)

  clockPipes.forEach((pipe, i) => clockElements[i].setAttributeNS(null, 'd', pipe.createPath()))
}, 0)
