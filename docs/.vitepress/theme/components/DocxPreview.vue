<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { renderAsync } from 'docx-preview'

const props = defineProps<{
  file?: Blob | null
  src?: string | null
}>()

const container = ref<HTMLDivElement | null>(null)
const loading = ref(false)
const errorMessage = ref<string | null>(null)

let abortController: AbortController | null = null

async function loadFromBlob(blob: Blob): Promise<void> {
  if (!container.value) return

  loading.value = true
  errorMessage.value = null
  container.value.innerHTML = ''

  try {
    await renderAsync(blob, container.value)
  } catch (error) {
    console.error('Ошибка рендера DOCX:', error)
    errorMessage.value = 'Ошибка при отображении документа'
  } finally {
    loading.value = false
  }
}

async function loadFromUrl(url: string): Promise<void> {
  if (!container.value) return

  loading.value = true
  errorMessage.value = null
  container.value.innerHTML = ''

  abortController?.abort()
  abortController = new AbortController()

  try {
    const response = await fetch(url, { signal: abortController.signal })
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const blob = await response.blob()
    await renderAsync(blob, container.value)
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return
    }
    console.error('Ошибка загрузки DOCX:', error)
    errorMessage.value = 'Ошибка при загрузке документа'
  } finally {
    loading.value = false
  }
}

async function renderDocx(): Promise<void> {
  if (!container.value) return

  container.value.innerHTML = ''
  errorMessage.value = null

  if (props.file instanceof Blob) {
    await loadFromBlob(props.file)
    return
  }

  if (props.src) {
    await loadFromUrl(props.src)
    return
  }

  errorMessage.value = 'Источник документа не задан'
}

watch(
  () => [props.file, props.src],
  () => {
    void renderDocx()
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  abortController?.abort()
  abortController = null
})
</script>

<template>
  <div class="docx-preview">
    <div class="docx-preview__status" v-if="loading">
      Загрузка документа…
    </div>

    <div
      class="docx-preview__status docx-preview__status--error"
      v-else-if="errorMessage"
    >
      {{ errorMessage }}
    </div>

    <div
      v-else
      ref="container"
      class="docx-preview__content"
    />
  </div>
</template>

<style scoped>
.docx-preview {
  width: 100%;
  height: 100%;
  background-color: #fff;
  overflow: auto;
}

.docx-preview__content {
  padding: 16px;
}

.docx-preview__status {
  padding: 12px;
  font-size: 13px;
  color: #555;
}

.docx-preview__status--error {
  color: #d93025;
}
</style>
