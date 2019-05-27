import VuexPersistence from 'vuex-persist'

export default ({ store }) => {
  window.onNuxtReady(() => {
    new VuexPersistence({
    /* options here */
      // modules: ['index']
      // reducer: state => ({
      //   match: state.match,
      //   training: state.training
      // })
    }).plugin(store)
  })
}
