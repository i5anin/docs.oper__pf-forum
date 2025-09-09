<template>
  <div class="pagefind-search">
    <input
      v-model.trim="q"
      type="search"
      class="input"
      placeholder="Поиск по документации (Ctrl+/)"
      @keydown.ctrl.slash.prevent="focusInput"
      @input="onInput"
    />
    <div v-if="open" class="panel">
      <div v-if="loading" class="empty">Индексация…</div>
      <div v-else-if="!items.length && q.length>=minLen" class="empty">Ничего не найдено</div>
      <div
        v-for="(it, i) in items"
        :key="it.url"
        class="row"
        :class="{ active: i===active }"
        @mousedown.prevent="go(it.url)"
      >
        <div class="title">{{ it.meta.title || it.url }}</div>
        <div class="url">{{ it.url }}</div>
        <div class="snippet" v-html="it.excerpt"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onBeforeUnmount, ref} from 'vue'

const q = ref('')
const items = ref<any[]>([])
const open = ref(false)
const loading = ref(false)
const active = ref(0)
const minLen = 2
let debounce: number | undefined

function focusInput(e?: Event) {
  (e?.target as HTMLInputElement | undefined)?.focus?.()
}

async function onInput() {
  open.value = true
  if (debounce) window.clearTimeout(debounce)
  debounce = window.setTimeout(runSearch, 120)
}

async function runSearch() {
  if (q.value.length < minLen) {
    items.value = []
    active.value = 0
    return
  }
  loading.value = true
  try {
    // @ts-ignore pagefind добавляется плагином после build
    const api = (window as any).pagefind
    if (!api) {
      items.value = [];
      return
    }
    const res = await api.search(q.value)
    const out: any[] = []
    for (const r of res.results) {
      const data = await r.data()
      out.push(data) // { url, meta:{title}, excerpt, ... } — из всего индекса
    }
    items.value = out.slice(0, 30)
    active.value = 0
  } finally {
    loading.value = false
  }
}

function go(url: string) {
  open.value = false
  items.value = []
  // переход по абсолютному (с учётом base) url, который вернул pagefind
  window.location.href = url
}

function onKey(e: KeyboardEvent) {
  if (!open.value) return
  if (e.key === 'Escape') open.value = false
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    active.value = (active.value + 1) % Math.max(items.value.length, 1)
  }
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    active.value = (active.value - 1 + Math.max(items.value.length, 1)) % Math.max(items.value.length, 1)
  }
  if (e.key === 'Enter') {
    const it = items.value[active.value];
    if (it) go(it.url)
  }
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
.pagefind-search {
  position: relative;
  display: inline-block;
}

.input {
  width: 320px;
  height: 32px;
  padding: 0 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.input:focus {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
}

.panel {
  position: absolute;
  top: 38px;
  right: 0;
  width: 720px;
  max-height: 60vh;
  overflow: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  box-shadow: 0 8px 24px rgba(0, 0, 0, .08);
  z-index: 1000;
}

.row {
  padding: 10px 12px;
  cursor: pointer;
  border-bottom: 1px solid var(--vp-c-divider);
}

.row.active, .row:hover {
  background: var(--vp-c-bg);
}

.title {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.url {
  font-size: 12px;
  color: var(--vp-c-text-2);
  margin-top: 2px;
}

.snippet {
  font-size: 13px;
  margin-top: 4px;
  color: var(--vp-c-text-1);
}

.empty {
  padding: 12px;
  color: var(--vp-c-text-2);
}
</style>
