/**
 * Extends interfaces in Vue.js
 */
import Vue, { ComponentOptions } from 'vue'

// import * as Snap from 'snapsvg-cjs'
// or  import * as Snap from 'snap.svg';
// if you are using the official version of snap.svg

declare module 'vue/types/vue' {
  interface Vue {
    $snap: any
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

// declare module  'snapsvg-cjs' {
//   interface Paper{

//       zpd (options?:any, callbackFunc?:(nan:null,zpdelement:any)=>void):void
//       zoomTo(zoom:number, interval?:number, ease?:(num:number)=>number, callbackFunction?:(nan:null,zpdelement:any)=>void):void;
//       panTo(x:string|number, y:string|number, interval?: number, ease?:(num:number)=>number, cb?:(nan:null,zpdelement:any)=>void):void;
//       rotate(a:number,x?:number, y?:number, interval?: number, ease?:(num:number)=>number, cb?:(nan:null,zpdelement:any)=>void):void;
//   }
// }
