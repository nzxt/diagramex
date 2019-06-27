import { Component, Watch, Vue } from 'vue-property-decorator'
import { State, Action, Mutation } from 'vuex-class'

import { Edge } from '~/models/Edge'
import { IPosition } from '../models/interfaces'

import { findParent } from '~/mixins/helpers'

@Component
export default class ConnectionMixin extends Vue {
  @State('programState') vuexProgramState

  @Action('addED') actionAddED
  @Action('deleteED') actionDeleteED
  @Action('updateEDTarget') actionUpdateEDTarget

  spz: any

  connection: any = {
    inProcess: false,
    useCaseId: null,
    sourceId: null,
    edgeId: null
  }

  cursorPos: IPosition = {
    x: 0,
    y: 0
  }

  onMoveTarget(evt) {
    if (this.connection.inProcess) {
      const canvasOffset = this.spz.getPan()
      const cursorPosOffset = this.cursorPosOffset()
      this.cursorPos.x = evt.layerX - cursorPosOffset.x - canvasOffset.x
      this.cursorPos.y = evt.layerY - cursorPosOffset.y - canvasOffset.y
      this.$bus.$emit('MovingElement', 'fake-target')
    }
  }

  onMouseDown(evt) {
    this.connection.inProcess = true
    this.findSource(evt)
  }

  onMouseUp(evt) {
    if (
      this.connection.inProcess &&
      this.connection.useCaseId
    ) this.findTarget(evt)

    this.connection.inProcess = false
    this.connection.useCaseId = null
    this.connection.sourceId = null
    this.connection.edgeId = null
  }

  findSource(evt) {
    const { clientX, clientY } = evt
    const elem = this.$snap.getElementByPoint(clientX, clientY)
    const parent = findParent(elem)
    const type = parent.node.id.substring(0, 2)

    if (type !== 'vr' && type !== 'ct') return

    const mainParent = findParent(parent.parent())
    const useCaseId = mainParent.node.id.substring(3)
    this.connection.useCaseId = useCaseId

    const sourceId = parent.node.id.substring(3)
    this.connection.sourceId = sourceId

    const targetId = 'fake-target'
    const edge = new Edge('Edge', sourceId, targetId)
    this.connection.edgeId = edge.id
    this.actionAddED({ useCaseId, edge })
  }

  findTarget(evt) {
    const { clientX, clientY } = evt
    const elem = this.$snap.getElementByPoint(clientX, clientY)
    const parent = findParent(elem)
    const targetId = parent.node.id.substring(3)
    const type = parent.node.id.substring(0, 2)
    const mainParent = findParent(parent.parent())
    const { useCaseId, sourceId, edgeId } = this.connection

    if (
      !mainParent ||
      useCaseId !== mainParent.node.id.substring(3) ||
      (type !== 'vr' && type !== 'ct') ||
      this.findDuplicatedEdge(useCaseId, sourceId, targetId)
    ) {
      this.actionDeleteED({ useCaseId, edgeId })
    } else {
      this.actionUpdateEDTarget({ useCaseId, id: edgeId, targetId })
      this.$bus.$emit('MovingElement', targetId)
    }
  }

  findDuplicatedEdge(useCaseId, sourceId, targetId) {
    const useCase = this.vuexProgramState.useCases.find(x => x.id === useCaseId)
    return useCase.edges.some(x =>
      (x.sourceId === sourceId && x.targetId === targetId)
      // (x.sourceId === targetId && x.targetId === sourceId)
    )
  }

  cursorPosOffset() {
    const { useCaseId } = this.connection
    if (!useCaseId) return { x: 0, y: 0 }
    const useCase = this.vuexProgramState.useCases.find(x => x.id === useCaseId)
    if (!useCase) return { x: 0, y: 0 }
    return useCase.position
  }

  @Watch('connection.inProcess', { immediate: false, deep: false })
  onConnection(value: Boolean) {
    if (!this.spz) return
    if (value) {
      this.spz.disablePan()
      this.spz.disableZoom()
    } else {
      this.spz.enablePan()
      this.spz.enableZoom()
    }
  }
}
