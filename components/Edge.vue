<template lang="pug">
  g(
    :id='`ed-${edge.id}`'
  )
    path.edge(
      marker-end='url(#arrow)'
      stroke-width='2'
      fill='none'
      stroke='grey'
      :d="path"
    )
    rect.ed-body(
      v-if='!isConnection'
      :x='x-identifierWidth/2'
      :y='y-12'
      :width='identifierWidth+10'
      height='24'
      rx='5'
      ry='5'
      :style='EDBodyStyle'
    )
    text.ed-text(
      :x='x-identifierWidth/2'
      :y='y-12'
      :style='EDTextStyle'
    ) {{ edge.identifier }}
    foreignObject(
      v-if='!isConnection'
      :x='x-identifierWidth/2+5'
      :y='y-12'
      :width='identifierWidth'
      height="22"
    )
      v-text-field.pa-0.ma-0.text-field(
        dark
        hide-details
        single-line
        height='24'
        @input='updateIdentifier'
        v-model='edge.identifier'
        browser-autocomplete='off'
      )
        //- :rules='textRule'
        //- @input='updateIdentifier'
        //- @dblclick.stop.prevent='onDblClickIdentifier'
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { IEdge } from '~/models/interfaces'
import { Mutation } from 'vuex-class'
import { onMove, onStart, onEnd } from '~/mixins/draggable'

@Component({})
export default class EdgeComponent extends Vue {
  @Mutation('updateEDIdentifier') mutationUpdateEDIdentifier

  @Prop({
    default: '',
    type: String
  })
  readonly useCaseId!: string

  @Prop({
    default: () => {},
    type: Object as () => IEdge
  })
  readonly edge!: IEdge

  x: any = null
  y: any = null

  identifierWidth: any = 150

  path: string = ''

  EDTextStyle: any = {
    fill: 'transparent',
    fontSize: '16px'
  }

  EDBodyStyle: any = {
    fill: '#CE93D8',
    stroke: '#BA68C8',
    strokeWidth: 1
  }

  created() {
    this.$bus.$on('MovingElement', this.onElementMove)
    this.$bus.$on('UseCaseResized', this.onUseCaseResized)
  }

  beforeDestroy() {
    this.$bus.$off('MovingElement', this.onElementMove)
    this.$bus.$off('UseCaseResized', this.onUseCaseResized)
  }

  mounted(): void {
    this.$nextTick(() => {
      this.drawConnection()
    })
  }

  @Watch('edge.identifier', { immediate: true, deep: false })
  onIdentifierChange(value: string): void {
    if (!value.length) return
    this.$nextTick(() => {
      const text = this.$snap.select(`#ed-${this.edge.id} .ed-text`)
      const textBBox = text.getBBox()
      this.identifierWidth = textBBox.width
    })
  }

  drawConnection() {
    const { sourceId, targetId } = this.edge
    const elem1 = this.$snap.select(`[id$="${sourceId}"]`)
    const elem2 = this.$snap.select(`[id$="${targetId}"]`)
    this.calculatePath(elem1, elem2, 'grey')
  }

  onElementMove(elementId) {
    const { sourceId, targetId } = this.edge
    if (sourceId === elementId || targetId === elementId) {
      const elem1 = this.$snap.select(`[id$="${sourceId}"]`)
      const elem2 = this.$snap.select(`[id$="${targetId}"]`)
      this.$nextTick(() => {
        this.calculatePath(elem1, elem2, 'grey')
      })
    }
  }

  onUseCaseResized(useCaseId) {
    if (useCaseId !== this.useCaseId) return
    this.drawConnection()
  }

  calculatePath(obj1, obj2, line) {
    if (obj1.line && obj1.from && obj1.to) {
      line = obj1
      obj1 = line.from
      obj2 = line.to
    }
    const bb1 = obj1.getBBox()
    const bb2 = obj2.getBBox()
    const p = [
      { x: bb1.x + bb1.width / 2, y: bb1.y - 1 },
      { x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1 },
      { x: bb1.x - 1, y: bb1.y + bb1.height / 2 },
      { x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2 },

      { x: bb2.x + bb2.width / 2, y: bb2.y - 1 },
      { x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1 },
      { x: bb2.x - 1, y: bb2.y + bb2.height / 2 },
      { x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2 }
    ]
    const d = {}; const dis = []
    for (let i = 0; i < 4; i++) {
      for (let j = 4; j < 8; j++) {
        const dx = Math.abs(p[i].x - p[j].x)
        const dy = Math.abs(p[i].y - p[j].y)
        if ((i === j - 4) ||
          ((
            (i !== 3 && j !== 6) || p[i].x < p[j].x) &&
              ((i !== 2 && j !== 7) || p[i].x > p[j].x) &&
              ((i !== 0 && j !== 5) || p[i].y > p[j].y) &&
              ((i !== 1 && j !== 4) || p[i].y < p[j].y)
          )) {
          dis.push(dx + dy)
          d[dis[dis.length - 1]] = [i, j]
        }
      }
    }
    let res
    if (dis.length === 0) {
      res = [0, 4]
    } else {
      res = d[Math.min.apply(Math, dis)]
    }
    const x1 = p[res[0]].x
    const y1 = p[res[0]].y
    const x4 = p[res[1]].x
    const y4 = p[res[1]].y
    const dx = Math.max(Math.abs(x1 - x4) / 2, 10)
    const dy = Math.max(Math.abs(y1 - y4) / 2, 10)
    const x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3)
    const y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3)
    const x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3)
    const y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3)

    this.path = 'M' + x1.toFixed(3) + ',' + y1.toFixed(3) + 'C' + [x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join()

    this.$nextTick(() => {
      this.getIdentifierCoords()
    })
  }

  getIdentifierCoords() {
    const path = this.$snap.select(`#ed-${this.edge.id} .edge`)
    const parentTransform = path.parent().transform()
    const length = path.getTotalLength()
    const coords = path.getPointAtLength(length / 2)
    this.x = coords.x
    this.y = coords.y
  }

  updateIdentifier(identifier) {
    this.mutationUpdateEDIdentifier({ useCaseId: this.useCaseId, id: this.edge.id, identifier })
  }

  get isConnection(): Boolean {
    return this.edge.targetId === 'fake-target'
  }
}
</script>
