<template lang="pug">
  v-layout.justify-center
    v-flex(xs12 elevation-5)
      v-stage(ref='stage' :config='configKonva')
        v-layer(ref='layer')
</template>

<script lang="ts">
import Konva from 'konva'
import { Component, Vue } from 'vue-property-decorator'

const width = window.innerWidth - 64
const height = window.innerHeight - 144

@Component
export default class BubblesPage extends Vue {
  name: string = 'Bubbles'
  configKonva: object = {
    width: width,
    height: height,
    draggable: true
  }
  targets: Array<any> = []
  connectors: Array<any> = []

  mounted() {
    const layer = this.$refs.layer.getNode()

    this.targets = this.generateTargets()
    this.connectors = this.generateConnectors()

    // generate nodes for the app
    this.connectors.forEach((connect) => {
      const line = new Konva.Arrow({
        stroke: 'black',
        id: connect.id,
        fill: 'black'
      })
      layer.add(line)
    })

    this.targets.forEach((target) => {
      const node = new Konva.Circle({
        id: target.id,
        fill: Konva.Util.getRandomColor(),
        radius: 20 + Math.random() * 20,
        shadowBlur: 10,
        draggable: true
      })
      layer.add(node)

      node.on('dragmove', () => {
        // mutate the state
        target.x = node.x()
        target.y = node.y()

        // update nodes from the new state
        this.updateObjects()
      })
    })

    this.updateObjects()
    layer.draw()
  }

  // function to generate a list of "targets" (circles)
  generateTargets() {
    const stage = this.$refs.stage.getStage()

    const number = 10
    const result = []
    while (result.length < number) {
      result.push({
        id: 'target-' + result.length,
        x: stage.width() * Math.random(),
        y: stage.height() * Math.random()
      })
    }
    return result
  }

  // function to generate arrows between targets
  generateConnectors() {
    const number = 10
    const result = []
    while (result.length < number) {
      const from = 'target-' + Math.floor(Math.random() * this.targets.length)
      const to = 'target-' + Math.floor(Math.random() * this.targets.length)
      if (from === to) {
        continue
      }
      result.push({
        id: 'connector-' + result.length,
        from: from,
        to: to
      })
    }
    return result
  }

  getConnectorPoints(from, to) {
    const dx = to.x - from.x
    const dy = to.y - from.y
    const angle = Math.atan2(-dy, dx)

    const radius = 50

    return [
      from.x + -radius * Math.cos(angle + Math.PI),
      from.y + radius * Math.sin(angle + Math.PI),
      to.x + -radius * Math.cos(angle),
      to.y + radius * Math.sin(angle)
    ]
  }

  // update all objects on the canvas from the state of the app
  updateObjects() {
    const layer = this.$refs.layer.getNode()
    this.targets.forEach((target) => {
      const node = layer.findOne('#' + target.id)
      node.x(target.x)
      node.y(target.y)
    })

    this.connectors.forEach((connect) => {
      const line = layer.findOne('#' + connect.id)
      const fromNode = layer.findOne('#' + connect.from)
      const toNode = layer.findOne('#' + connect.to)

      const points = this.getConnectorPoints(
        fromNode.position(),
        toNode.position()
      )
      line.points(points)
    })
    layer.batchDraw()
  }
}
</script>
