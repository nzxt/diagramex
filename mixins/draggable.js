import { findParent } from '~/mixins/helpers'
/* eslint-disable */
const onMove = function(dx, dy, x, y, evt) {
  if(evt.button !== 0 || !evt.shiftKey) return

  const tstr = this.data('ot') + `t${dx},${dy}`
  this.transform(tstr)

  let { id: nodeId } = this.node
  nodeId = nodeId.substring(3)

  const parentId = this.data('parentId')

  window.$nuxt.$bus.$emit('MovingElement', nodeId)
  window.$nuxt.$bus.$emit('MovingChildElement', parentId)
}
const onStart = function(x, y, evt) {
  if(evt.button !== 0 || !evt.shiftKey) return

  evt.cancelBubble = true
  this.data('ot', this.transform().local)

  const parent = findParent(this.parent())
  const parentId = parent.node.id.substring(3)
  this.data('parentId', parentId)
}
const onEnd = function(evt) {
  if(evt.button !== 0 || !evt.shiftKey) return

  const { id: nodeId } = this.node
  const { x, y } = this.getBBox()
  const { id: nodeParentId } = this.parent().parent().node // Upward to Usecase <g>
  window.$nuxt.$bus.$emit('DragEnded', { x, y, nodeId, nodeParentId } )
  console.log('Drag ended..')
}

export { onMove, onStart, onEnd }
/* eslint-enable */
