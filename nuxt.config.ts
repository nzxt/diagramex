import VuetifyLoaderPlugin from 'vuetify-loader/lib/plugin'
import pkg from './package.json'

export default {
  mode: 'spa',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    '~/assets/style/app.styl',
    '@mdi/font/css/materialdesignicons.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/vuetify',
    '@/plugins/snapsvg',
    '@/plugins/eventbus',
    // { src: '~/plugins/vuex-persist', ssr: false }
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/pwa'
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    debug: true
  },

  auth: {
    strategies: {
      local: false,
      // local: {
      //   endpoints: {
      //     login: { url: 'https://stas-k.org/login', method: 'get' },
      //     logout: { url: 'https://stas-k.org/logout', method: 'get' },
      //     user: false // { url: 'https://stas-k.org/login/authorized', method: 'get', propertyName: '' }
      //   },
      //   tokenRequired: false
      // },
      facebook: {
        client_id: '632260073878047',
        userinfo_endpoint: 'https://graph.facebook.com/v2.12/me?fields=about,name,picture{url},email,birthday',
        scope: ['public_profile', 'email', 'user_birthday']
      },
    },
    watchLoggedIn: true,
    resetOnError: true,
    rewriteRedirects: true,
    redirect: {
      login: '/auth',
      logout: '/',
      callback: '/auth',
      home: '/'
    },
    localStorage: {
      prefix: 'auth.'
    },
    cookie: false,
    plugins: [ '~/plugins/auth' ]
  },

  router: {
    middleware: ['auth']
  },

  /*
  ** Build configuration
  */
  build: {
    transpile: ['vuetify/lib'],
    plugins: [new VuetifyLoaderPlugin()],
    loaders: {
      stylus: {
        import: ['~assets/style/variables.styl']
      }
    },
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(ts|js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
          options: {
            fix: true
          }
        })
      }
    }
  }
}
