'use strict'

function Animation (target, objects) {
  this.target = target
  this.objects = objects
  this.elements = []
  this.renderQueue = []
  this.paused = true
}

Animation.prototype.enter = function animationEnter () {
  this.elements = this.objects.map(obj => obj.getElement())
  this.elements.forEach(obj => this.target.appendChild(obj))
}

Animation.prototype.update = (function () {
  var update
  return function animationUpdate () {
    if (this.paused) return
    this.objects.forEach((obj, i) => {
      update = obj.update(this.elements[i], ...arguments)
      if (update) {
        this.renderQueue.push(update)
      }
    })
  }
})()

Animation.prototype.render = (function () {
  var r, q
  return function animationRender () {
    q = this.renderQueue
    while (q.length) {
      r = q.pop()
      r()
    }
  }
})()

Animation.prototype.pause = function (pausedBool) {
  this.paused = pausedBool
  this.objects.forEach(function (obj) {
    if (obj.onPause) obj.onPause(pausedBool)
  })
}
