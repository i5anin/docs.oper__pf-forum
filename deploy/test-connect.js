import { config } from 'dotenv';
import Client from 'ssh2-sftp-client';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = resolve(__dirname, '.env.deploy');
console.log(`ENV PATH=${envPath}`);

config({ path: envPath });

const REQUIRED_ENV = [
  'DEPLOY_HOST',
  'DEPLOY_USER',
  'DEPLOY_PASSWORD',
  'REMOTE_DIR'
];

const missingEnv = REQUIRED_ENV.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
  throw new Error(`Отсутствуют переменные: ${missingEnv.join(', ')}`);
}

const {
  DEPLOY_HOST,
  DEPLOY_USER,
  DEPLOY_PASSWORD,
  REMOTE_DIR
} = process.env;

const sftp = new Client();

const main = async () => {
  const remoteDir = REMOTE_DIR.replace(/\\/g, '/');

  console.log(`DEPLOY_HOST=${DEPLOY_HOST}`);
  console.log(`DEPLOY_USER=${DEPLOY_USER}`);
  console.log(`REMOTE_DIR=${remoteDir}`);

  await sftp.connect({
    host: DEPLOY_HOST,
    username: DEPLOY_USER,
    password: DEPLOY_PASSWORD
  });

  console.log('SSH/SFTP соединение установлено');

  const list = await sftp.list(remoteDir);

  console.log(`\nСодержимое ${remoteDir}:`);
  for (const entry of list) {
    const type = entry.type === 'd' ? 'dir' : 'file';
    console.log(`- ${entry.name} (${type})`);
  }

  await sftp.end();

  console.log('Сеанс SFTP завершён');
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
