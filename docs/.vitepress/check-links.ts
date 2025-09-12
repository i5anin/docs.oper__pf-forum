import { promises as fs } from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { nav, sidebar } from './config/menu'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const docsRoot = path.resolve(__dirname, '../..', 'docs')

type LinkItem = { text: string; link: string; items?: LinkItem[] }

function collectLinks(items: LinkItem[] = []): string[] {
  return items.flatMap(i => i.items ? [i.link, ...collectLinks(i.items)] : [i.link])
}

async function checkFile(link: string) {
  if (!link || link === '/') return
  const relativePath = link.replace(/^\/|\/$/g, '') // убираем слэши
  const filePath = path.join(docsRoot, relativePath, 'index.md')
  try {
    await fs.access(filePath)
    return { link, exists: true }
  } catch {
    return { link, exists: false, filePath }
  }
}

async function main() {
  const allLinks = [
    ...collectLinks(nav as LinkItem[]),
    ...collectLinks(sidebar as LinkItem[])
  ]

  const uniqueLinks = [...new Set(allLinks)]
  const results = await Promise.all(uniqueLinks.map(checkFile))

  const missing = results.filter(r => r && !r.exists)
  if (missing.length === 0) {
    console.log('Все файлы найдены.')
  } else {
    console.log('Отсутствуют файлы:')
    for (const m of missing) {
      console.log(`→ ${m.link} (ожидалось: ${m.filePath})`)
    }
  }
}

main().catch(e => {
  console.error('Ошибка проверки:', e)
  process.exit(1)
})
