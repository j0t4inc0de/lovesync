import 'dotenv/config';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load envs
if (fs.existsSync(path.resolve(__dirname, '.env'))) {
  dotenv.config({ path: path.resolve(__dirname, '.env') });
}
if (fs.existsSync(path.resolve(__dirname, '../.env.local'))) {
  dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
}

async function testR2() {
  console.log('--- Probando Conexión a Cloudflare R2 ---');
  console.log('Account ID configurado:', process.env.R2_ACCOUNT_ID ? 'SÍ ✅' : 'NO ❌');
  console.log('Access Key ID configurado:', process.env.R2_ACCESS_KEY_ID ? 'SÍ ✅' : 'NO ❌');
  console.log('Secret Access Key configurado:', process.env.R2_SECRET_ACCESS_KEY ? 'SÍ ✅' : 'NO ❌');
  console.log('Bucket Name:', process.env.R2_BUCKET_NAME || 'lovesync-media');
  console.log('Public URL:', process.env.R2_PUBLIC_URL || 'No configurada');

  if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
    console.error('\n❌ Faltan las credenciales en tu archivo backend/.env o .env.local.');
    return;
  }

  const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
    }
  });

  const testKey = `test/saludo_${Date.now()}.txt`;
  const testContent = '¡Hola desde LoveSync! Si puedes leer esto, Cloudflare R2 está funcionando al 100%.';

  try {
    console.log('\nSubiendo archivo de prueba al bucket...');
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME || 'lovesync-media',
      Key: testKey,
      Body: testContent,
      ContentType: 'text/plain; charset=utf-8'
    }));

    const publicUrl = `${(process.env.R2_PUBLIC_URL || '').replace(/\/$/, '')}/${testKey}`;
    console.log('✅ ¡Archivo subido con éxito!');
    console.log(`\n👉 Abre este enlace en tu navegador para ver si el archivo público carga:`);
    console.log(`   ${publicUrl}\n`);
  } catch (error) {
    console.error('\n❌ Error al intentar subir a Cloudflare R2:', error.message);
  }
}

testR2();
