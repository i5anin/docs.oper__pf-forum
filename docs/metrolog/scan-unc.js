import { promises as fs } from 'fs';
import path from 'path';

const root = '\\\\192.168.0.97\\метрология\\НД\\НД по МОП\\ИНФОРМАЦИЯ О МИ';
const outputFile = './structure.md';

// иконки для типов
const icons = {
  folder: '📂',
  root: '📦',
  file: '📄',
  script: '📜',
  special: '🟡',
  subfolder: '🟪'
};

// рекурсивное сканирование
async function scanDir(dir, depth = 0) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const result = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push({
        name: entry.name,
        type: 'dir',
        children: await scanDir(fullPath, depth + 1)
      });
    } else {
      result.push({
        name: entry.name,
        type: 'file'
      });
    }
  }
  return result;
}

// генерация Markdown дерева
function renderTree(nodes, prefix = '', isRoot = true) {
  let output = '';
  const folderIcon = isRoot ? icons.root : icons.folder;

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const isLast = i === nodes.length - 1;
    const connector = isLast ? '└──' : '├──';
    const nextPrefix = prefix + (isLast ? '    ' : '│   ');

    if (node.type === 'dir') {
      output += `${prefix}${connector} ${folderIcon} ${node.name}\n`;
      output += renderTree(node.children, nextPrefix, false);
    } else {
      const ext = path.extname(node.name);
      const icon =
        ext === '.js' ? icons.script : ext === '.md' ? icons.file : icons.file;
      output += `${prefix}${connector} ${icon} ${node.name}\n`;
    }
  }

  return output;
}

// запуск
(async () => {
  try {
    console.log(`Scanning: ${root}`);
    const tree = await scanDir(root);
    const markdown = `## 📂 Структура проекта\n\`\`\`\n${icons.root} ${path.basename(root)}\n${renderTree(tree)}\`\`\`\n`;
    await fs.writeFile(outputFile, markdown, 'utf8');
    console.log(`✅ Файл structure.md создан.`);
  } catch (err) {
    console.error('Ошибка при сканировании:', err.message);
  }
})();
