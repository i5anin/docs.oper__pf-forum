// docs/.vitepress/generate-md.ts
import { promises as fs } from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { nav, sidebar } from './menu'

type Item = { text: string; link?: string; items?: Item[] }

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function toFilePath(rootDir: string, link: string): string {
  if (link === '/') return path.join(rootDir, 'index.md')
  const clean = link.replace(/\/$/, '')
  const parts = clean.split('/').filter(Boolean)
  const file = parts.pop() ?? 'index'
  const dir = path.join(rootDir, ...parts)
  return path.join(dir, `${file}.md`)
}

async function ensureFile(filePath: string, title: string, originalLink: string) {
  const dir = path.dirname(filePath)
  await fs.mkdir(dir, { recursive: true })
  try {
    await fs.access(filePath)
  } catch {
    const content = `# ${title}\n\nПуть: \`${originalLink}\`\n`
    await fs.writeFile(filePath, content, 'utf-8')
  }
}

async function collect(items: Item[], acc: Map<string, { title: string; link: string }>) {
  for (const it of items) {
    if (it.link) {
      acc.set(it.link, { title: it.text, link: it.link })
    }
    if (it.items?.length) {
      await collect(it.items, acc)
    }
  }
}

async function main() {
  const docsRoot = path.resolve(__dirname, '..') // .../docs
  const map = new Map<string, { title: string; link: string }>()

  await collect(nav as Item[], map)
  await collect(sidebar as Item[], map)

  for (const { title, link } of map.values()) {
    const filePath = toFilePath(docsRoot, link)
    await ensureFile(filePath, title, link)
  }
}

main().catch(err => {
  console.error(err)
  process.exitCode = 1
})
