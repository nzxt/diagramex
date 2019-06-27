<template lang="pug">
  v-layout.align-center
    v-flex.text-xs-center(xs12)
      div.display-1.blue-grey--text {{ messageText }}
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  auth: false
})
export default class AuthPage extends Vue {
  error: string = 'Please Authenticate!'
  success: string = 'You are signed in. Thanks!'

  get messageText(): string {
    return this.$store.state.auth.loggedIn ? this.success : this.error
  }
}
</script>
