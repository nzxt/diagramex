<template lang="pug">
  g(
    :id='`uc-${useCase.id}`'
    :transform='`translate(${useCase.position.x},${useCase.position.y})`'
  )

    rect.uc-title(
      x='0'
      y='0'
      :width='155'
      :height='35'
      rx='5'
      ry='5'
      :style='UCTitleStyle'
    )
    rect.uc-body(
      x='0'
      y='27'
      :width='450'
      :height='250'
      rx='5'
      ry='5'
      :style='UCBodyStyle'
    )
    text.uc-text(
      x='5'
      y='18'
      :style='UCTextStyle'
    ) {{ useCase.identifier }}
    g.variables
      Variable(
        v-for='item in useCase.variables'
        :key='item.id'
        :variable='item'
      )
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'
// import { Mutation } from 'vuex-class'

// import UseCase from '~/models/UseCase'
import { IUseCase } from '~/models/interfaces'
import { onMove, onStart, onEnd } from '~/mixins/draggable'

@Component({
  components: {
    Variable: () => import('~/components/Variable.vue')
  }
})
export default class UseCaseComponent extends Vue {
  @Prop({
    default: () => {},
    type: Object as () => IUseCase
  })
  readonly useCase!: IUseCase

  UCTitleStyle: any = {
    fill: '#03A9F4',
    stroke: '#01579B',
    strokeWidth: 1
    // opacity: 0.5
  }
  UCTextStyle: any = {
    fill: '#FAFAFA',
    fontSize: '14px'
  }
  UCBodyStyle: any = {
    fill: '#81D4FA',
    stroke: '#01579B',
    strokeWidth: 1
    // opacity: 0.75
  }

  mounted() {
    const uc = this.$snap.select(`#uc-${this.useCase.id}`)
    uc.drag(onMove, onStart, onEnd)
  }
}
</script>
