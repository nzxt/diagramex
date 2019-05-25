<template lang="pug">
  div
    v-stage(
      v-if='!loading'
      ref='stage'
      :config='configKonva'
      @contextmenu='onRClickCanvas'
      @dragstart='handleDragstart'
      @dragend='handleDragend'
    )
      v-layer(ref='layer')
        v-star.pointer(v-for='item in list' :key='item.id' :config='item')
      v-layer(ref='dragLayer')

    v-layout(v-else)
      v-flex(xs12)
        v-icon.mdi-18px(:class='loading ? "mdi-spin warning--text" : "success--text"') {{ loading ? 'mdi-camera-iris' : 'mdi-check-circle-outline' }}
        span.ml-1.subheaing {{ loading ? loadingMsg : readyMsg }}

    v-menu(
      v-model="showMenu"
      :position-x="menuX"
      :position-y="menuY"
      absolute
      offset-y
    )
      v-list(dense)
        v-list-tile(@click="reset")
          v-list-tile-title {{ 'Clear Stage' }}
        v-list-tile(@click="randomize")
          v-list-tile-title {{ 'Randomize Stars' }}
</template>

<script>
import Konva from 'konva'

const width = window.innerWidth - 96
const height = window.innerHeight - 144

export default {
  data() {
    return {
      showMenu: false,
      menuX: null,
      menuY: null,
      readyMsg: 'Ready!',
      loadingMsg: 'Loading...',
      loading: false,
      list: [],
      configKonva: {
        width: width,
        height: height
      }
    }
  },

  mounted() {
    this.randomize()
  },

  methods: {
    reset() {
      this.loading = true
      const stage = this.$refs.stage.getStage()
      stage.clear()
      this.randomize()
      setTimeout(() => {
        this.loading = false
      }, 618)
    },

    randomize() {
      for (let n = 0; n < 30; n++) {
        const scale = Math.random()
        const stage = this.$refs.stage.getStage()
        this.list.push({
          x: Math.random() * stage.width(),
          y: Math.random() * stage.height(),
          rotation: Math.random() * 180,
          numPoints: 5,
          innerRadius: 30,
          outerRadius: 50,
          fill: '#89b717',
          opacity: 0.8,
          draggable: true,
          scaleX: scale,
          scaleY: scale,
          shadowColor: 'black',
          shadowBlur: 10,
          shadowOffsetX: 5,
          shadowOffsetY: 5,
          shadowOpacity: 0.6,
          startScale: scale
        })
      }
    },

    handleDragstart(e) {
      const shape = e.target
      const dragLayer = this.$refs.dragLayer.getNode()
      const stage = this.$refs.stage.getNode()
      // moving to another layer will improve dragging performance
      shape.moveTo(dragLayer)
      stage.draw()
      shape.setAttrs({
        shadowOffsetX: 15,
        shadowOffsetY: 15,
        scaleX: shape.getAttr('startScale') * 1.2,
        scaleY: shape.getAttr('startScale') * 1.2
      })
    },

    handleDragend(e) {
      const shape = e.target
      const layer = this.$refs.layer.getNode()
      const stage = this.$refs.stage.getNode()
      shape.moveTo(layer)
      stage.draw()
      shape.to({
        duration: 0.5,
        easing: Konva.Easings.ElasticEaseOut,
        scaleX: shape.getAttr('startScale'),
        scaleY: shape.getAttr('startScale'),
        shadowOffsetX: 5,
        shadowOffsetY: 5
      })
    },

    onRClickCanvas(ctx) {
      if (!ctx.evt) return
      ctx.evt.preventDefault()

      const { clientX, clientY } = ctx.evt

      this.menuX = clientX
      this.menuY = clientY

      this.$nextTick(() => {
        this.showMenu = true
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  .pointer
    cursor pointer
</style>
