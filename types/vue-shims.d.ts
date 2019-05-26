/**
 * Extends interfaces in Vue.js
 */
import Vue, { ComponentOptions } from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    // $auth: any;
    // $noty: any;
 }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    // This adds the `auth` property to the existing `vue/types/options/ComponentOptions` type
    // auth?: Boolean | string | string[];
  }
}
