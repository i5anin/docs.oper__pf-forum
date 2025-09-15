// D:\GitHub\docs.pfforum\docs\.vitepress\script\check-links.ts
import { promises as fs } from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { nav, sidebar } from '../config/menu'

type LinkItem = { text: string; link: string; items?: LinkItem[] }
type Status = 'ok' | 'missing' | 'empty'
type Result = { link: string; filePath: string; status: Status }

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const docsRoot = path.resolve(__dirname, '..', '..')

function collectLinks(items: LinkItem[] = []): string[] {
  return items.flatMap(i => (i.items ? [i.link, ...collectLinks(i.items)] : [i.link]))
}

function isSkippable(link: string): boolean {
  if (!link) return true
  const s = link.trim()
  if (s === '/' || s.startsWith('#')) return true
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(s)) return true
  return false
}

function stripQueryHash(link: string): string {
  const q = link.indexOf('?')
  const h = link.indexOf('#')
  const cut = [q, h].filter(v => v >= 0).sort((a, b) => a - b)[0]
  return cut >= 0 ? link.slice(0, cut) : link
}

function toRelPath(raw: string): string | null {
  const base = decodeURI(stripQueryHash(raw))
  if (!base || base === '/') return null
  return base.startsWith('/') ? base.slice(1) : base
}

function toFsPath(rel: string): string {
  if (rel.endsWith('.md')) return path.join(docsRoot, rel.replace(/^\//, ''))
  return path.join(docsRoot, rel.replace(/^\//, ''), 'index.md')
}

async function exists(p: string): Promise<boolean> {
  try {
    await fs.access(p)
    return true
  } catch {
    return false
  }
}

function stripFrontMatter(s: string): string {
  if (s.startsWith('---')) {
    const end = s.indexOf('\n---', 3)
    if (end !== -1) return s.slice(end + 4)
  }
  return s
}

function stripMdNoise(s: string): string {
  let t = s
  t = t.replace(/```[\s\S]*?```/g, '')
  t = t.replace(/`[^`]*`/g, '')
  t = t.replace(/!\[[^\]]*]\([^)]*\)/g, '')
  t = t.replace(/\[[^\]]*]\([^)]*\)/g, '')
  t = t.replace(/^\s{0,3}[-*+]\s+/gm, '')
  t = t.replace(/^\s{0,3}\d+\.\s+/gm, '')
  t = t.replace(/^\s{0,3}#{1,6}\s+/gm, '')
  t = t.replace(/^\s{0,3}>\s?.*$/gm, '')
  t = t.replace(/\s+/g, ' ')
  return t.trim()
}

function hasMeaningfulText(s: string): boolean {
  const core = stripMdNoise(stripFrontMatter(s))
  if (core.length < 20) return false
  return /\p{L}/u.test(core)
}

async function checkOne(link: string): Promise<Result | null> {
  if (isSkippable(link)) return null
  const rel = toRelPath(link)
  if (!rel) return null
  const filePath = toFsPath(rel)
  if (!(await exists(filePath))) return { link, filePath, status: 'missing' }
  const content = await fs.readFile(filePath, 'utf8')
  if (!hasMeaningfulText(content)) return { link, filePath, status: 'empty' }
  return { link, filePath, status: 'ok' }
}

function parseFlags(argv: string[]) {
  return {
    failOnMissing: argv.includes('--fail-on-missing'),
    failOnEmpty: argv.includes('--fail-on-empty'),
  }
}

async function main() {
  const { failOnMissing, failOnEmpty } = parseFlags(process.argv.slice(2))
  const links = [...collectLinks(nav as LinkItem[]), ...collectLinks(sidebar as LinkItem[])]
  const unique = Array.from(new Set(links))
  const results = (await Promise.all(unique.map(checkOne))).filter(Boolean) as Result[]

  const missing = results.filter(r => r.status === 'missing')
  const empty = results.filter(r => r.status === 'empty')

  if (missing.length === 0 && empty.length === 0) {
    console.log('Все файлы найдены и содержат осмысимый текст.')
    process.exit(0)
  }

  if (missing.length > 0) {
    console.log('Отсутствуют файлы:')
    for (const m of missing) console.log(`→ ${m.link} (ожидалось: ${m.filePath})`)
  }

  if (empty.length > 0) {
    console.log('Пустые файлы (нет осмысимого текста):')
    for (const e of empty) console.log(`→ ${e.link} (путь: ${e.filePath})`)
  }

  if ((failOnMissing && missing.length > 0) || (failOnEmpty && empty.length > 0)) {
    const code = failOnMissing && failOnEmpty ? 3 : failOnMissing ? 2 : 4
    process.exit(code)
  }

  process.exit(0)
}

main().catch(e => {
  console.error('Ошибка проверки:', e)
  process.exit(1)
})
