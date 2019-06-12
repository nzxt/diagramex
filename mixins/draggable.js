/* eslint-disable */
const onMove = function(dx, dy, x, y, evt) {
  if(evt.button !== 0 || !evt.shiftKey) return

  const tstr = this.data('ot') + `t${dx},${dy}`
  this.transform(tstr)
  let { id: nodeId } = this.node
  nodeId = nodeId.substring(3)
  window.$nuxt.$bus.$emit('MovingElement', nodeId)
}
const onStart = function(x, y, evt) {
  if(evt.button !== 0 || !evt.shiftKey) return

  evt.cancelBubble = true
  this.data('ot', this.transform().local)
}
const onEnd = function(evt) {
  if(evt.button !== 0 || !evt.shiftKey) return

  const { id: nodeId } = this.node
  const { x, y } = this.getBBox()
  const { id: nodeParentId } = this.parent().parent().node // Upward to Usecase <g>
  window.$nuxt.$bus.$emit('DragEnded', { x, y, nodeId, nodeParentId } )
  window.$nuxt.$bus.$emit('ChildDragEnded', nodeParentId.substring(3) )
  window.$nuxt.$bus.$emit('CircleEndDrag', evt)
  console.log('Drag ended..')
}

export { onMove, onStart, onEnd }
/* eslint-enable */
