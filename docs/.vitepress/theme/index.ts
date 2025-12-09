import DefaultTheme from 'vitepress/theme'

import SideA from './table/SideA.vue'
import SideB from './table/SideB.vue'

import FileBrowser from './components/FileBrowser.vue'
import FilePreviewModal from './components/FilePreviewModal.vue'

export default {
  extends: DefaultTheme,

  enhanceApp({ app }) {
    app.component('SideA', SideA)
    app.component('SideB', SideB)

    app.component('FileBrowser', FileBrowser)
    app.component('FilePreviewModal', FilePreviewModal)
  },
}
