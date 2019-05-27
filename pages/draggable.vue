<template lang="pug">
  v-layout.justify-center
    v-flex.text-xs-center(xs12 elevation-5)
      | {{ groupSize.width }} / {{ groupSize.height }}
      v-btn(@click='calcSize')
        | calc
      v-stage(ref='stage' :config='configKonva' @dragend='handleDragend')
        v-layer(ref='layer')
          v-group(ref='group1' :config='{name: "gr1", x: 10, y: 10, draggable: true}')
            v-rect(:config='{x: 0, y: 0, width: 350, height: 350, fill: "grey"}')
            v-group(ref='group2' :config='{name: "gr2", x: 25, y: 25, rotation: -15}')
              v-rect(:config='{x: 25, y: 25, width: 150, height: 55, fill: "red", draggable: true}')
              v-rect(:config='{x: 35, y: 35, width: 150, height: 55, fill: "blue", draggable: true}')
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

const width = window.innerWidth - 64
const height = window.innerHeight - 144

@Component
export default class BubblesPage extends Vue {
  groupSize: any = {
    width: 0,
    height: 0
  }
  configKonva: object = {
    width: width,
    height: height
    // rotation: 20
    // draggable: true
  }

  calcSize() {
    const group = this.$refs.group2
    const size = group.getNode()
    this.groupSize.width = size.width()
    this.groupSize.height = size.height()
    // debugger
  }

  /* eslint-disable */
  handleDragend(e) {
    // debugger
  }
}
</script>

<style lang="stylus">
 .bordered
    border 1px dashed grey
</style>
