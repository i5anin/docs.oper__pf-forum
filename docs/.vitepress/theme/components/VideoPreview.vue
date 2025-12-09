<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  src: string
  mimeType?: string | null
}>()

const resolvedType = computed(() => props.mimeType ?? 'video/mp4')
</script>

<template>
  <div class="video-preview">
    <video
      class="video-preview__video"
      :src="src"
      :type="resolvedType"
      controls
      playsinline
    />
  </div>
</template>

<style scoped>
.video-preview {
  width: 100%;
  height: 100%;
  background-color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-preview__video {
  max-width: 100%;
  max-height: 100%;
}
</style>
