<script setup lang="ts">
import { ref } from 'vue'

interface ToolRow {
  id: number | string
  size: string
  qty: string | number
}

interface ToolGroup {
  title: string
  color: string
  border: string
  rows: ToolRow[]
}

const groups = ref<ToolGroup[]>([
  {
    title: 'Резьбофрезы',
    color: '#a00000',
    border: '#7a0000',
    rows: [
      { id: '1 – 2', size: 'M', qty: 'Приложение 1–2' },
      { id: '3', size: 'G', qty: 'Приложение 3' },
      { id: '4', size: 'RC', qty: 'Приложение 4' }
    ]
  },
  {
    title: 'Фасочники',
    color: '#00a651',
    border: '#006c32',
    rows: [
      { id: '5 – 6', size: 'Фасочник 90°', qty: '3 (Ø 4; 6; 8; 10)' },
      { id: '7 – 8', size: 'Фасочник 90° с пластинами', qty: 1 },
      { id: '9', size: 'Фасочник 60°', qty: '2 (Ø 6; 8; 10)' },
      { id: '10', size: 'Фасочник 60° с пластинами', qty: 1 },
      { id: '11 – 12', size: 'Фасочники разные', qty: 'разные' }
    ]
  },
  {
    title: 'Оправки',
    color: '#1e9edb',
    border: '#1473a4',
    rows: [{ id: '13 – 14', size: 'Оправки', qty: 'разные' }]
  },
  {
    title: 'Центровки',
    color: '#7b52ab',
    border: '#573a7b',
    rows: [{ id: '17 – 18', size: 'Центровки', qty: '4 (Ø 4; 5; 6; 8; 10; 16)' }]
  },
  {
    title: 'Перья',
    color: '#ffe457',
    border: '#c9a300',
    rows: [
      { id: '19', size: 'D 0.4', qty: '10 (5 длин)' },
      { id: '20', size: 'D 0.6', qty: '10 (5 длин)' },
      { id: '21', size: 'R0.5, R1, R1.2, R1.5', qty: 2 },
      { id: '22', size: '60°', qty: '4 (2 длины)' }
    ]
  },
  {
    title: 'Фрезы',
    color: '#e89a56',
    border: '#a85e20',
    rows: [
      { id: '26', size: 'Обратный радиус', qty: 'Приложение 5' },
      { id: '27 – 29', size: 'Специальные', qty: '30' }
    ]
  },
  {
    title: 'Метчики',
    color: '#4b4b4b',
    border: '#2a2a2a',
    rows: [
      { id: '32 – 34', size: 'M', qty: 'Приложение 6–8' },
      { id: '35', size: 'G', qty: 'Приложение 9' },
      { id: '36', size: 'RC', qty: 'Приложение 10' }
    ]
  }
])
</script>

<template>
  <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;">
    <h2 style="text-align:center; letter-spacing:.5px; margin:8px 0 12px;">
      СТОРОНА
      <span style="display:inline-block; background:#d7263d; padding:2px 8px; border-radius:4px; font-weight:700;">
        A
      </span>
    </h2>

    <table style="width:100%; border-collapse:collapse; table-layout:fixed; font-size:14px; margin:0 auto;">
      <colgroup>
        <col style="width:14%;" />
        <col style="width:56%;" />
        <col style="width:30%;" />
      </colgroup>

      <template v-for="group in groups" :key="group.title">
        <tr>
          <td
            colspan="3"
            :style="{
              background: group.border,
              textAlign: 'center',
              fontWeight: 700,
              border: `1px solid ${group.border}`,
              color: '#fff',
              padding: '10px 8px'
            }"
          >
            {{ group.title }}
          </td>
        </tr>

        <tr v-for="row in group.rows" :key="row.id">
          <td
            :style="{
              background: group.color,
              textAlign: 'center',
              border: `1px solid ${group.border}`,
              padding: '8px',
              color: group.color === '#ffe457' ? '#111' : '#fff'
            }"
          >
            {{ row.id }}
          </td>
          <td
            :style="{
              background: group.color,
              border: `1px solid ${group.border}`,
              padding: '8px',
              color: group.color === '#ffe457' ? '#111' : '#fff'
            }"
          >
            {{ row.size }}
          </td>
          <td
            :style="{
              background: group.color,
              textAlign: 'right',
              border: `1px solid ${group.border}`,
              padding: '8px',
              color: group.color === '#ffe457' ? '#111' : '#fff'
            }"
          >
            {{ row.qty }}
          </td>
        </tr>
      </template>
    </table>
  </div>
</template>
