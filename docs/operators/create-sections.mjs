import { mkdir, open } from 'node:fs/promises'
import { join, resolve } from 'node:path'

const parseArgs = (argv) => {
    const args = new Map()
    for (let i = 2; i < argv.length; i++) {
        const a = argv[i]
        if (a.startsWith('--')) {
            const [k, v] = a.includes('=') ? a.slice(2).split('=') : [a.slice(2), argv[i + 1]]
            args.set(k, v ?? '')
            if (!a.includes('=') && v && !v.startsWith('--')) i++
        } else if (!args.has('_')) args.set('_', [a])
        else args.get('_').push(a)
    }
    return args
}

const args = parseArgs(process.argv)
const start = Number(args.get('start') ?? (args.get('_')?.[0] ?? 3))
const end = Number(args.get('end') ?? (args.get('_')?.[1] ?? 46))
const baseDir = resolve(String(args.get('dir') ?? process.cwd()))

if (!Number.isInteger(start) || !Number.isInteger(end) || start > end) {
    console.error('Неверный диапазон. Пример: node create-sections.mjs --start=3 --end=46 --dir=docs')
    process.exit(1)
}

let createdDirs = 0
let createdFiles = 0

for (let n = start; n <= end; n++) {
    const dir = join(baseDir, String(n))
    await mkdir(dir, { recursive: true })
    createdDirs++

    const file = join(dir, 'index.md')
    try {
        const fh = await open(file, 'wx')
        await fh.writeFile('')
        await fh.close()
        createdFiles++
    } catch {}
}

console.log(`Готово: папок создано ${createdDirs}, файлов index.md создано ${createdFiles} (без перезаписи существующих)`)
