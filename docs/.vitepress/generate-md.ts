import { promises as fs } from 'fs'
import * as path from 'path'

// импортируем nav и sidebar из menu.ts
import { nav, sidebar } from './menu'

interface MenuItem {
  text: string
  link?: string
  items?: MenuItem[]
}

async function createMdFiles(items: MenuItem[], rootDir: string) {
  for (const item of items) {
    if (item.link) {
      const cleanLink = item.link.replace(/\/$/, '') // убираем слеш на конце
      const filePath = path.join(rootDir, `${cleanLink}.md`)

      const dir = path.dirname(filePath)
      await fs.mkdir(dir, { recursive: true })

      try {
        await fs.access(filePath)
        console.log(`Файл уже существует: ${filePath}`)
      } catch {
        const content = `# ${item.text}\n\nПуть: \`${item.link}\`\n`
        await fs.writeFile(filePath, content, 'utf-8')
        console.log(`Создан: ${filePath}`)
      }
    }

    if (item.items && item.items.length > 0) {
      await createMdFiles(item.items, rootDir)
    }
  }
}

async function main() {
  const rootDir = path.resolve(__dirname, 'docs')

  await createMdFiles(nav as MenuItem[], rootDir)
  await createMdFiles(sidebar as MenuItem[], rootDir)

  console.log('Генерация завершена')
}

main().catch(err => console.error(err))
