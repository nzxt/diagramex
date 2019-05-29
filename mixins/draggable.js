/* eslint-disable */
const onMove = function(dx, dy, x, y, evt) {
  const tstr = this.data('ot') + `t${dx},${dy}`
  this.transform(tstr)
}
const onStart = function(x, y, evt) {
  evt.cancelBubble = true
  this.data('ot', this.transform().local)
}
const onEnd = function(evt) {
  console.log('Drag ended..')
}

export { onMove, onStart, onEnd }
