import { ref, onUnmounted } from 'vue'

type PreviewType = 'image' | 'pdf' | 'other'

function detectPreviewType(name: string, mimeType?: string | null): PreviewType {
  const lowerName = name.toLowerCase()
  const lowerMime = (mimeType ?? '').toLowerCase()

  if (lowerMime.startsWith('image/')) return 'image'
  if (lowerMime === 'application/pdf') return 'pdf'

  if (/\.(png|jpe?g|gif|webp|bmp|svg)$/.test(lowerName)) return 'image'
  if (/\.pdf$/.test(lowerName)) return 'pdf'

  return 'other'
}

export function useFilePreview() {
  const isOpen = ref(false)
  const url = ref<string | null>(null)
  const type = ref<PreviewType | null>(null)
  const name = ref<string | null>(null)

  function reset() {
    if (url.value) {
      URL.revokeObjectURL(url.value)
    }
    url.value = null
    type.value = null
    name.value = null
  }

  function open(blob: Blob, fileName: string) {
    reset()
    url.value = URL.createObjectURL(blob)
    type.value = detectPreviewType(fileName, blob.type)
    name.value = fileName
    isOpen.value = true
  }

  function close() {
    reset()
    isOpen.value = false
  }

  onUnmounted(() => {
    reset()
  })

  return {
    isOpen,
    url,
    type,
    name,
    open,
    close,
  }
}
