import DefaultTheme from 'vitepress/theme'

import SideA from './components/SideA.vue'
import SideB from './components/SideB.vue'

import FileBrowser from './components/FileBrowser.vue'

export default {
  extends: DefaultTheme,

  enhanceApp({ app }) {
    app.component('SideA', SideA)
    app.component('SideB', SideB)

    app.component('FileBrowser', FileBrowser)
  },
}
