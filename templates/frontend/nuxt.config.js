import colors from 'vuetify/es5/util/colors'
import {sortRoutes} from '@nuxt/utils'
import {join} from 'path'
import {copySync, removeSync} from 'fs-extra'

// fro.config()

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  srcDir: __dirname,

  env: {
    apiUrl: process.env.API_URL || process.env.APP_URL + '/api/',
    appName: process.env.APP_NAME || 'Laravel Nuxt',
    appLocale: process.env.APP_LOCALE || 'en',
    githubAuth: !!process.env.GITHUB_CLIENT_ID
  },
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - ' + process.env.APP_NAME,
    title: process.env.APP_NAME,
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: ''},
      {name: 'format-detection', content: 'telephone=no'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ]
  },

  loading: {color: '#007bff'},

  router: {
    middleware: [
      'locale',
      'check-auth'
    ],
    extendRoutes(routes, _) {
      sortRoutes(routes)
    }
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {src: '~/plugins/notifications-ssr', mode: 'server'},
    {src: '~/plugins/notifications-client', mode: 'client'},
    '~/plugins/axios',
    '~/plugins/axios-accessor',
    '~/plugins/i18n',
    '~/plugins/vue-composition',
    '~/plugins/vee-validate',
    '~/plugins/sweetalert2',

    '~/plugins/store-accessor',
    '~/plugins/redirect-accessor',
    '~/plugins/sweetalert2-accessor',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/moment'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/router',
    '@nuxtjs/axios',
    '@nuxtjs/moment',
    'vue-sweetalert2/nuxt'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extractCSS: true,
    transpile: [
      'vee-validate/dist/rules'
    ]
  },

  hooks: {
    // build: {
    //   done(generator) {
    //     console.log(generator)
    //     // Copy dist files to public/_nuxt
    //     if (generator.nuxt.options.dev === false && generator.nuxt.options.mode === 'spa') {
    //       const publicDir = join(generator.nuxt.options.rootDir, 'public', '_nuxt')
    //       removeSync(publicDir)
    //       copySync(join(generator.nuxt.options.generate.dir, '_nuxt'), publicDir)
    //       copySync(join(generator.nuxt.options.generate.dir, '200.html'), join(publicDir, 'index.html'))
    //       removeSync(generator.nuxt.options.generate.dir)
    //     }
    //   }
    // },
    generate: {
      done(generator) {
        // Copy dist files to public/_nuxt
        if (generator.nuxt.options.dev === false && generator.nuxt.options.mode === 'spa') {
          const publicDir = join(generator.nuxt.options.rootDir, 'public', '_nuxt')
          removeSync(publicDir)
          copySync(join(generator.nuxt.options.generate.dir, '_nuxt'), publicDir)
          copySync(join(generator.nuxt.options.generate.dir, '200.html'), join(publicDir, 'index.html'))
          removeSync(generator.nuxt.options.generate.dir)
        }
      }
    }
  }
}
