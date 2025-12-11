<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { downloadFile, FileItem, FilesResponse, getFiles } from '../../api/files'
import { useFilePreview, getEmojiForFile } from './useFilePreview'
import FilePreviewModal from './FilePreviewModal.vue'

const loading = ref(false)
const errorMessage = ref<string | null>(null)
const currentBase = ref('')
const currentPath = ref('')
const items = ref<FileItem[]>([])

const {
  isOpen: isPreviewOpen,
  url: previewUrl,
  type: previewType,
  name: previewName,
  open: openPreview,
  close: closePreview,
} = useFilePreview()

function normalizePath(path: string): string {
  return path.trim()
}

function splitPath(path: string): string[] {
  if (!path) return []
  return path.split(/[\\/]+/).filter(Boolean)
}

function joinPath(segments: string[]): string {
  return segments.filter(Boolean).join('\\')
}

function formatFileSize(size: number | null | undefined): string {
  if (size == null || size < 0) return ''
  if (size === 0) return '0 B'

  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let value = size
  let unitIndex = 0

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }

  const fixed =
    value < 10 && unitIndex > 0
      ? value.toFixed(1)
      : value.toFixed(0)

  return `${fixed} ${units[unitIndex]}`
}

const breadcrumbSegments = computed(() => splitPath(currentPath.value))

const hasParent = computed(() => breadcrumbSegments.value.length > 0)

async function load(path: string = ''): Promise<void> {
  loading.value = true
  errorMessage.value = null

  try {
    const normalized = normalizePath(path)
    const data: FilesResponse = await getFiles(normalized)

    currentBase.value = data.base
    currentPath.value = data.path ?? ''
    items.value = Array.isArray(data.items) ? data.items : []
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = 'Неизвестная ошибка'
    }
  } finally {
    loading.value = false
  }
}

function openDirectory(item: FileItem): void {
  load(item.relativePath)
}

async function openFile(item: FileItem): Promise<void> {
  try {
    const blob = await downloadFile(item.relativePath)
    openPreview(blob, item.name)
  } catch (error) {
    console.error('Ошибка при открытии файла:', error)
  }
}

function handleItemClick(item: FileItem): void {
  if (item.type === 'dir') {
    openDirectory(item)
    return
  }
  openFile(item)
}

function goToRoot(): void {
  load('')
}

function goToParent(): void {
  if (!hasParent.value) return
  const segments = breadcrumbSegments.value
  if (segments.length <= 1) {
    load('')
    return
  }
  const parentPath = joinPath(segments.slice(0, -1))
  load(parentPath)
}

function handleBreadcrumbClick(index: number): void {
  const segments = breadcrumbSegments.value
  if (index < 0 || index >= segments.length) return
  const targetPath = joinPath(segments.slice(0, index + 1))
  load(targetPath)
}

const sortedItems = computed(() =>
  [...items.value].sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'dir' ? -1 : 1
    }
    return a.name.localeCompare(b.name, 'ru')
  }),
)

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && isPreviewOpen.value) {
    event.preventDefault()
    closePreview()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  load('')
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="file-browser">
    <div class="file-browser__header">
      <div class="file-browser__breadcrumb">
      <span
        class="file-browser__breadcrumb-root"
        :class="{ 'file-browser__breadcrumb-item--active': !breadcrumbSegments.length }"
        @click="goToRoot"
      >
        /
      </span>

        <template v-for="(segment, index) in breadcrumbSegments" :key="index">
          <span class="file-browser__breadcrumb-separator">·</span>
          <span
            class="file-browser__breadcrumb-item"
            :class="{ 'file-browser__breadcrumb-item--active': index === breadcrumbSegments.length - 1 }"
            @click="handleBreadcrumbClick(index)"
          >
          {{ segment }}
        </span>
        </template>
      </div>

      <div class="file-browser__controls">
        <button
          type="button"
          class="file-browser__button"
          @click="goToRoot"
        >
          Главная
        </button>

        <button
          type="button"
          class="file-browser__button"
          :disabled="!hasParent"
          @click="goToParent"
        >
          Назад
        </button>
      </div>
    </div>



    <div class="file-browser__status" v-if="loading">
      Загрузка…
    </div>

    <div
      class="file-browser__status file-browser__status--error"
      v-else-if="errorMessage"
    >
      Ошибка: {{ errorMessage }}
    </div>

    <div class="file-browser__empty" v-else-if="!sortedItems.length">
      Папка пуста
    </div>

    <table v-else class="file-browser__table">
      <thead>
      <tr>
        <th class="file-browser__cell-name">Имя</th>
        <th class="file-browser__cell-size">Размер</th>
      </tr>
      </thead>
      <tbody>
      <tr
        v-for="item in sortedItems"
        :key="item.relativePath"
        class="file-browser__row"
        @click="handleItemClick(item)"
      >
        <td class="file-browser__cell-name">
          <span class="file-browser__item-emoji">
            {{ item.type === 'dir' ? '📁' : getEmojiForFile(item.name) }}
          </span>
          <span class="file-browser__item-name">
            {{ item.name }}
          </span>
        </td>
        <td class="file-browser__cell-size">
          <span v-if="item.type === 'file' && item.size != null">
            {{ formatFileSize(item.size) }}
          </span>
          <span v-else>
            —
          </span>
        </td>
      </tr>
      </tbody>
    </table>

    <FilePreviewModal
      :open="isPreviewOpen"
      :url="previewUrl"
      :type="previewType"
      :name="previewName"
      @close="closePreview"
    />
  </div>
</template>

<style scoped>

.file-browser {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px 14px;
  background-color: var(--vp-c-bg-soft);
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
  flex: 1 1 auto;
}

.file-browser__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  gap: 8px;
}

.file-browser__base {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 12px;
  color: var(--vp-c-text-2);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-browser__controls {
  display: flex;
  gap: 6px;
}

.file-browser__button {
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  padding: 4px 8px;
  background-color: var(--vp-c-bg);
  cursor: pointer;
  font-size: 12px;
}

.file-browser__button:disabled {
  opacity: 0.5;
  cursor: default;
}

.file-browser__breadcrumb {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 2px;
  margin-bottom: 8px;
  font-size: 13px;
}

.file-browser__breadcrumb-root,
.file-browser__breadcrumb-item {
  cursor: pointer;
  color: var(--vp-c-text-2);
}

.file-browser__breadcrumb-item--active {
  font-weight: 600;
  color: var(--vp-c-text-1);
  cursor: default;
}

.file-browser__breadcrumb-separator {
  color: var(--vp-c-text-3);
}

.file-browser__status {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.file-browser__status--error {
  color: #d93025;
}

.file-browser__empty {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.file-browser__table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 4px;
  table-layout: fixed;
}

.file-browser__table th,
.file-browser__table td {
  padding: 14px 14px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.file-browser__row {
  cursor: pointer;
}

.file-browser__row:hover {
  background-color: var(--vp-c-bg-mute);
}

.file-browser__cell-name {
  width: auto;
}

.file-browser__cell-size {
  width: 140px;
  text-align: right;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 12px;
}

.file-browser__item-emoji {
  display: inline-block;
  margin-right: 6px;
}

.file-browser__item-name {
  vertical-align: middle;
  font-size: 15px;
}


</style>

