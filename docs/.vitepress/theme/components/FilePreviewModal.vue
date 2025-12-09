<script setup lang="ts">
import { computed } from 'vue'

type PreviewType = 'image' | 'pdf' | 'video' | 'other'

const props = defineProps<{
  open: boolean
  url: string | null
  type: PreviewType | null
  name: string | null
  file?: Blob | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const hasContent = computed(() => props.open && !!props.url)

const isDocx = computed(() => {
  const n = props.name?.toLowerCase() ?? ''
  return n.endsWith('.docx')
})

function handleBackgroundClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}

function handleCloseClick() {
  emit('close')
}
</script>

<template>
  <div
    v-if="hasContent"
    class="file-preview-modal"
    @click="handleBackgroundClick"
  >
    <div class="file-preview-modal__content">
      <div class="file-preview-modal__header">
        <div class="file-preview-modal__title">
          {{ name }}
        </div>
        <button
          type="button"
          class="file-preview-modal__close"
          @click="handleCloseClick"
        >
          ✕
        </button>
      </div>

      <div class="file-preview-modal__body">
        <img
          v-if="type === 'image'"
          :src="url ?? ''"
          alt=""
          class="file-preview-modal__image"
        />

        <VideoPreview
          v-else-if="type === 'video' && url"
          :src="url"
        />

        <DocxPreview
          v-else-if="isDocx"
          :file="file"
          :src="url ?? null"
        />

        <iframe
          v-else-if="type === 'pdf'"
          :src="url ?? ''"
          class="file-preview-modal__frame"
        />

        <iframe
          v-else
          :src="url ?? ''"
          class="file-preview-modal__frame"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.file-preview-modal {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: stretch;
  justify-content: stretch;
}

.file-preview-modal__content {
  background-color: var(--vp-c-bg);
  border-radius: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.file-preview-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
}

.file-preview-modal__title {
  font-size: 14px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-preview-modal__close {
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  padding: 2px 6px;
  background-color: var(--vp-c-bg);
  cursor: pointer;
  font-size: 14px;
}

.file-preview-modal__body {
  flex: 1;
  position: relative;
  background-color: #000;
}

.file-preview-modal__image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  position: absolute;
  inset: 0;
  margin: auto;
}

.file-preview-modal__frame {
  width: 100%;
  height: 100%;
  border: none;
  background-color: #fff;
}
</style>
