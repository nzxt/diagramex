<template lang="pug">
  div
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Mutation } from 'vuex-class'

import { IUseCase } from '~/models/interfaces'

@Component({
  components: {
    // Variable: () => import('~/components/Variable.vue')
  }
})
export default class UseCase extends Vue {

}
</script>
