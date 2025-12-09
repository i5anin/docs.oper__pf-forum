<script setup lang="ts">
import {ref} from 'vue'

interface ToolRow {
  id: number | string
  size: string
  qty: string | number
}

interface ToolGroup {
  title: string
  color: string
  border: string
  textColor?: string
  rows: ToolRow[]
}

const groups = ref<ToolGroup[]>([
  {
    title: 'Фрезы Сферы',
    color: '#d01313',
    border: '#a80f0f',
    rows: [
      {id: 91, size: 'Ø 1', qty: 2},
      {id: 92, size: 'Ø 1,5', qty: 2},
      {id: 93, size: 'Ø 2', qty: 2},
      {id: 94, size: 'Ø 2,5', qty: 2},
      {id: 95, size: 'Ø 3', qty: 2},
      {id: 96, size: 'Ø 3,5', qty: 2},
      {id: 97, size: 'Ø 4', qty: 2},
      {id: 98, size: 'Ø 5', qty: 2},
      {id: 99, size: 'Ø 6', qty: 3},
      {id: 100, size: 'Ø 8', qty: 2},
      {id: 101, size: 'Ø 10', qty: 2},
      {id: 102, size: 'Ø 12', qty: 2},
      {id: 103, size: 'Ø 14 + Ø 16', qty: 3},
      {id: 104, size: 'Ø 18 + Ø 20', qty: 2}
    ]
  },
  {
    title: 'Фрезы Концевые по Стали',
    color: '#16b56a',
    border: '#0b6e3e',
    rows: [
      {id: 105, size: 'Ø 20', qty: '4 + 2 длин'},
      {id: 106, size: 'Ø 1', qty: 3},
      {id: 107, size: 'Ø 1,5', qty: 3},
      {id: 108, size: 'Ø 2', qty: 3},
      {id: 109, size: 'Ø 2,5', qty: 3},
      {id: 110, size: 'Ø 3', qty: 3},
      {id: 111, size: 'Ø 3,5', qty: 3},
      {id: 112, size: 'Ø 4', qty: 3},
      {id: 113, size: 'Ø 5', qty: 3},
      {id: 114, size: 'Ø 6', qty: 4},
      {id: 115, size: 'Ø 8', qty: 4},
      {id: 116, size: 'Ø 10', qty: 4},
      {id: 117, size: 'Ø 12 + Ø 14', qty: 4},
      {id: 118, size: 'Ø 16 + Ø 18', qty: '4 + 2длин'},
      {id: 119, size: 'Ø 20', qty: '4 + 2длин'}
    ]
  },

  // ▼ Новые группы из скриншота ▼
  {
    title: 'Фрезы Концевые по Алюминию',
    color: '#2f56a6',
    border: '#1d3a77',
    rows: [
      {id: 121, size: 'Ø 1', qty: 3},
      {id: 122, size: 'Ø 1,5', qty: 3},
      {id: 123, size: 'Ø 2', qty: 3},
      {id: 124, size: 'Ø 2,5', qty: 3},
      {id: 125, size: 'Ø 3', qty: 3},
      {id: 126, size: 'Ø 3,5', qty: 3},
      {id: 127, size: 'Ø 4', qty: 3},
      {id: 128, size: 'Ø 5', qty: 3},
      {id: 129, size: 'Ø 6', qty: 3},
      {id: 130, size: 'Ø 8', qty: 3},
      {id: 131, size: 'Ø 10', qty: 3},
      {id: 132, size: 'Ø 12 + Ø 14', qty: 3},
      {id: 133, size: 'Ø 16 + Ø 18', qty: '3 + 2 длин'},
      {id: 134, size: 'Ø 20', qty: '3 + 2 длин'}
    ]
  },
  {
    title: 'Радиусная Фреза',
    color: '#bfbfbf',
    border: '#8c8c8c',
    textColor: '#000000',
    rows: [
      {id: 137, size: 'R 0.5', qty: 1},
      {id: 138, size: 'R 1', qty: 1},
      {id: 139, size: 'R 1.5', qty: 1},
      {id: 140, size: 'R 2', qty: 1},
      {id: 141, size: 'R 2.5', qty: 1},
      {id: 142, size: 'R 3', qty: 1},
      {id: 143, size: 'R 4', qty: 1},
      {id: 144, size: 'R 5', qty: 1}
    ]
  },
  {
    title: 'Фрезы с пластинами',
    color: '#f08a26',
    border: '#c86e10',
    rows: [
      // В шапке скриншота указан диапазон 148–149 и суммарное кол-во 5.
      // Отразим это одной агрегированной строкой по диапазону.
      {id: '148–149', size: 'Комплект/диапазон', qty: 5}
    ]
  }
  // ▲ Новые группы из скриншота ▲
])
</script>

<template>
  <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;">
    <h2 style="text-align:center; letter-spacing:.5px; margin:8px 0 12px;">
      СТОРОНА
      <span
          style="display:inline-block; background:#2f56a6; padding:2px 8px; border-radius:4px; font-weight:700;"
      >
        B
      </span>
    </h2>

    <table style="width:100%; border-collapse:collapse; table-layout:fixed; font-size:14px; margin:0 auto;">
      <colgroup>
        <col style="width:14%;"/>
        <col style="width:56%;"/>
        <col style="width:30%;"/>
      </colgroup>

      <template v-for="group in groups" :key="group.title">
        <tr>
          <td
              colspan="3"
              :style="{
              background: group.border,
              textAlign: 'center',
              color: group.textColor || '#fff',
              fontWeight: 700,
              border: `1px solid ${group.border}`
            }"
          >
            {{ group.title }}
          </td>
        </tr>

        <tr v-for="row in group.rows" :key="row.id">
          <td
              :style="{
    background: group.color,
    color: group.textColor || '#fff',
    textAlign: 'center',
    border: `1px solid ${group.border}`,
    padding: '8px'
  }"
          >
            {{ row.id }}
          </td>
          <td
              :style="{
    background: group.color,
    color: group.textColor || '#fff',
    border: `1px solid ${group.border}`,
    padding: '8px'
  }"
          >
            {{ row.size }}
          </td>
          <td
              :style="{
    background: group.color,
    color: group.textColor || '#fff',
    textAlign: 'right',
    border: `1px solid ${group.border}`,
    padding: '8px'
  }"
          >
            {{ row.qty }}
          </td>
        </tr>
      </template>
    </table>
  </div>
</template>
