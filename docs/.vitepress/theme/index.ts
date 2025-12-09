import DefaultTheme from 'vitepress/theme'

import SideA from './components/SideA.vue'
import SideB from './components/SideB.vue'

import FileBrowser from './components/FileBrowser.vue'
import FilePreviewModal from './components/FilePreviewModal.vue'
import VideoPreview from './components/VideoPreview.vue'
import DocxPreview from './components/DocxPreview.vue'

export default {
  extends: DefaultTheme,

  enhanceApp({ app }) {
    app.component('SideA', SideA)
    app.component('SideB', SideB)

    app.component('FileBrowser', FileBrowser)
    app.component('FilePreviewModal', FilePreviewModal)

    app.component('VideoPreview', VideoPreview)
    app.component('DocxPreview', DocxPreview)
  },
}
