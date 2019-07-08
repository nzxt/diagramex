export default ({ app }) => {
  const { store, $auth, $axios } = app

  $auth.onError((error, name, endpoint) => {
    console.error(endpoint, name, error)
  })

  /* Only _actual_ login/outs (including resets) will be watched here. */
  $auth.$storage.watchState('loggedIn', (isLoggedIn) => {
    /* Follow @nuxtjs/auth workflow */
    if (isLoggedIn) {
      $auth.redirect('home')
    } else {
      $auth.redirect('logout')
    }
  })

  if (!$auth.loggedIn) return

  console.info(`[AUTH] Hi, ${$auth.user.name}!`)

  $axios.get(`https://stas-k.org/user`)
    .then((res) => {
      console.info(`[${res.status}] BackEnd authorized you too, ${res.data.name}`)
      store.commit('setUserId', res.data.uid)
    })
    .catch(err => console.warn(`${err.status} ${err.statusText}`))
}
