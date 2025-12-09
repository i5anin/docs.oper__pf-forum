import { config } from 'dotenv';
import Client from 'ssh2-sftp-client';

config({ path: '.env.deploy' });

const requiredEnv = [
  'DEPLOY_HOST',
  'DEPLOY_USER',
  'DEPLOY_PASSWORD',
  'REMOTE_DIR'
];

const missingEnv = requiredEnv.filter((v) => !process.env[v]);

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
  console.log(`DEPLOY_HOST=${DEPLOY_HOST}`);
  console.log(`DEPLOY_USER=${DEPLOY_USER}`);
  console.log(`REMOTE_DIR=${REMOTE_DIR}`);

  await sftp.connect({
    host: DEPLOY_HOST,
    username: DEPLOY_USER,
    password: DEPLOY_PASSWORD
  });

  console.log('SSH/SFTP соединение установлено');

  const list = await sftp.list(REMOTE_DIR);

  console.log(`\nСодержимое ${REMOTE_DIR}:`);
  list.forEach((f) =>
    console.log(`- ${f.name} (${f.type === 'd' ? 'dir' : 'file'})`)
  );

  await sftp.end();
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
