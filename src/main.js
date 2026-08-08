import { createApp } from 'vue'
import { Quasar } from 'quasar'
import quasarUserOptions from './quasar-user-options'
import router from './router'
import App from './App.vue'

import 'quasar/src/css/index.sass'

const app = createApp(App)

app.use(Quasar, quasarUserOptions)
app.use(router)
app.mount('#q-app')
