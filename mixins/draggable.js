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
  const { id: nodeId } = this.node
  const { x, y } = this.getBBox()
  const { id: nodeParentId } = this.parent().parent().node // Upward to Usecase <g>
  window.$nuxt.$bus.$emit('dragEnd', { x, y, nodeId, nodeParentId } )
  console.log('Drag ended..')
}

export { onMove, onStart, onEnd }
/* eslint-enable */
