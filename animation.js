function Animation (target, objects) {
  this.target = target
  this.objects = objects
  this.elements = []
  this.renderQueue = []
  this.paused = true
}

Animation.prototype.enter = function () {
  this.elements = this.objects.map(obj => obj.getElement())
  this.elements.forEach(obj => this.target.appendChild(obj))
}

Animation.prototype.update = function () {
  if (this.paused) return
  var update
  this.objects.forEach((obj, i) => {
    update = obj.update(this.elements[i], ...arguments)
    if (update) {
      this.renderQueue.push(update)
    }
  })
}

Animation.prototype.render = function () {
  var r
  var q = this.renderQueue
  while (q.length) {
    r = q.pop()
    r()
  }
}
