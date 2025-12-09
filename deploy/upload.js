import { config } from 'dotenv';
import Client from 'ssh2-sftp-client';
import { fileURLToPath } from 'node:url';
import { resolve, join, dirname } from 'node:path';
import { readdirSync, existsSync, statSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

const envPath = resolve(__dirname, '.env.deploy');
console.log('ENV PATH:', envPath);

const envResult = config({ path: envPath });
console.log('DOTENV RESULT:', envResult);

const requiredEnv = [
  'DEPLOY_HOST',
  'DEPLOY_USER',
  'DEPLOY_PASSWORD',
  'REMOTE_DIR',
  'DIST_DIR'
];

const missingEnv = requiredEnv.filter((v) => !process.env[v]);

if (missingEnv.length > 0) {
  throw new Error(`Отсутствуют переменные окружения: ${missingEnv.join(', ')}`);
}

const {
  DEPLOY_HOST,
  DEPLOY_USER,
  DEPLOY_PASSWORD,
  REMOTE_DIR,
  DIST_DIR
} = process.env;

const normalizedDistDir = DIST_DIR.replace(/^[/\\]+/u, '');
const distPath = resolve(projectRoot, normalizedDistDir);

console.log('DEPLOY_HOST:', DEPLOY_HOST);
console.log('DEPLOY_USER:', DEPLOY_USER);
console.log('REMOTE_DIR:', REMOTE_DIR);
console.log('DIST_DIR:', DIST_DIR);
console.log('projectRoot:', projectRoot);
console.log('distPath:', distPath);

if (!existsSync(distPath) || !statSync(distPath).isDirectory()) {
  throw new Error(`Каталог сборки не найден или не является директорией: ${distPath}`);
}

const sftp = new Client();

const uploadDirectory = async (localDir, remoteDir) => {
  const entries = readdirSync(localDir, { withFileTypes: true });

  try {
    await sftp.stat(remoteDir);
  } catch {
    console.log('Создаю директорию на сервере:', remoteDir);
    await sftp.mkdir(remoteDir, true);
  }

  for (const entry of entries) {
    const localPath = resolve(localDir, entry.name);
    const remotePath = join(remoteDir, entry.name).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      await uploadDirectory(localPath, remotePath);
      continue;
    }

    if (entry.isFile()) {
      console.log('UPLOAD:', localPath, '→', remotePath);
      await sftp.fastPut(localPath, remotePath);
    }
  }
};

const main = async () => {
  await sftp.connect({
    host: DEPLOY_HOST,
    username: DEPLOY_USER,
    password: DEPLOY_PASSWORD
  });

  console.log('SSH/SFTP соединение установлено');

  await uploadDirectory(distPath, REMOTE_DIR);

  await sftp.end();

  console.log('DEPLOY DONE');
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
