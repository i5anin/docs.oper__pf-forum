import { readdir, mkdir, rename } from 'node:fs/promises'
import { resolve, join, parse } from 'node:path'

const baseDir = resolve(process.cwd())

const files = await readdir(baseDir, { withFileTypes: true })

for (const f of files) {
    if (!f.isFile()) continue

    const { name, ext } = parse(f.name)
    if (ext !== '.md') continue
    if (!/^\d+$/.test(name)) continue  // только цифры, например "3.md"

    const dirPath = join(baseDir, name)
    const newFile = join(dirPath, 'index.md')

    await mkdir(dirPath, { recursive: true })
    await rename(join(baseDir, f.name), newFile)

    console.log(`Перенесено: ${f.name} → ${name}/index.md`)
}
