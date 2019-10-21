//Boolean toggle

// returns a function that alternates return of true and false on
// subsequent calls 

function boolToggle(initalBool) {
  var b = initalBool
  var temp
  return function toggle () {
    temp = b
    b = !b
    return temp
  }
}