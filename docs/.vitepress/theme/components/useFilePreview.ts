import { ref, onUnmounted } from 'vue'

export type PreviewType = 'image' | 'pdf' | 'video' | 'other'

const extensionEmojiMap: Record<string, string> = {
  '.cdr': '🎨',
  '.db': '🗄️',
  '.doc': '📄',
  '.docx': '📄',
  '.gif': '🖼️',
  '.jpeg': '🖼️',
  '.jpg': '🖼️',
  '.log': '📑',
  '.mp4': '🎬',
  '.mpeg': '🎬',
  '.pdf': '📕',
  '.png': '🖼️',
  '.webp': '🖼️',
  '.wmv': '🎬',
}

export function getEmojiForFile(name: string): string {
  const lower = name.toLowerCase()
  const ext = Object.keys(extensionEmojiMap).find(x => lower.endsWith(x))
  return ext ? extensionEmojiMap[ext] : '📁'
}

function detectPreviewType(name: string, mimeType?: string | null): PreviewType {
  const lowerName = name.toLowerCase()
  const lowerMime = (mimeType ?? '').toLowerCase()

  if (lowerMime.startsWith('image/')) return 'image'
  if (lowerMime.startsWith('video/')) return 'video'
  if (lowerMime === 'application/pdf') return 'pdf'

  if (/\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(lowerName)) return 'image'
  if (/\.(mp4|webm|ogg|m4v|mov|mkv|mpeg|mpg)$/i.test(lowerName)) return 'video'
  if (/\.pdf$/i.test(lowerName)) return 'pdf'

  return 'other'
}

function revokeUrl(value: string | null): void {
  if (!value) return
  if (value.startsWith('blob:')) URL.revokeObjectURL(value)
}

export function useFilePreview() {
  const isOpen = ref(false)
  const url = ref<string | null>(null)
  const type = ref<PreviewType | null>(null)
  const name = ref<string | null>(null)
  const emoji = ref<string>('📁')

  function reset(): void {
    revokeUrl(url.value)
    url.value = null
    type.value = null
    name.value = null
    emoji.value = '📁'
    isOpen.value = false
  }

  function open(blob: Blob, fileName: string): void {
    reset()
    const objectUrl = URL.createObjectURL(blob)
    url.value = objectUrl
    type.value = detectPreviewType(fileName, blob.type)
    name.value = fileName
    emoji.value = getEmojiForFile(fileName)
    isOpen.value = true
  }

  function openFromUrl(previewUrl: string, fileName: string, mimeType?: string | null): void {
    reset()
    url.value = previewUrl
    type.value = detectPreviewType(fileName, mimeType)
    name.value = fileName
    emoji.value = getEmojiForFile(fileName)
    isOpen.value = true
  }

  function close(): void {
    reset()
  }

  onUnmounted(reset)

  return {
    isOpen,
    url,
    type,
    name,
    emoji,
    open,
    openFromUrl,
    close,
  }
}
