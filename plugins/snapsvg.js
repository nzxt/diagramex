/* eslint-disable */
import * as Snap from 'snapsvg-cjs'
// import 'snap.svg.zpd'
// or import * as Snap from 'snap.svg'
// if you are using the official version of snap.svg

export default (ctx, inject) => {
  inject('snap', Snap)
}
