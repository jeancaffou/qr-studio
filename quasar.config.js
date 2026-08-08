import { configure } from 'quasar/wrappers'

export default configure(function () {
  return {
    boot: [],

    css: ['app.scss'],

    extras: ['material-icons'],

    build: {
      vueRouterMode: 'hash',
      publicPath: process.env.NODE_ENV === 'production' ? '/qr-studio/' : '/',
      target: {
        browser: ['es2022', 'firefox115', 'chrome115', 'safari15'],
        node: 'node22'
      }
    },

    devServer: {
      open: false,
      host: '0.0.0.0',
      port: 9000
    },

    framework: {
      config: {},
      plugins: ['Notify']
    },

    animations: []
  }
})
