import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ponytail: Ensure both backend/.env and root .env.local are loaded if present
if (fs.existsSync(path.resolve(__dirname, '.env'))) {
  dotenv.config({ path: path.resolve(__dirname, '.env'), override: true });
}
if (fs.existsSync(path.resolve(__dirname, '../.env.local'))) {
  dotenv.config({ path: path.resolve(__dirname, '../.env.local'), override: true });
}

let _s3Client = null;
const getS3Client = () => {
  if (_s3Client) return _s3Client;
  const accountId = (process.env.R2_ACCOUNT_ID || '').trim();
  const accessKey = (process.env.R2_ACCESS_KEY_ID || '').trim();
  const secretKey = (process.env.R2_SECRET_ACCESS_KEY || '').trim();
  if (accountId && accessKey && secretKey) {
    _s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey
      }
    });
  }
  return _s3Client;
};

// ponytail: Lazy helper to initialize MercadoPago client using MP_ACCESS_TOKEN
let _mpClient = null;
const getMPClient = () => {
  if (_mpClient) return _mpClient;
  const token = (process.env.MP_ACCESS_TOKEN || '').trim();
  if (!token) return null;
  _mpClient = new MercadoPagoConfig({ accessToken: token });
  return _mpClient;
};

// ponytail: Helper to transparently upload Base64 images to Cloudflare R2 if configured
const uploadToR2IfBase64 = async (photoStr, coupleId) => {
  const client = getS3Client();
  if (!photoStr || !photoStr.startsWith('data:image/')) {
    return photoStr;
  }
  if (!client || !process.env.R2_BUCKET_NAME) {
    console.warn('⚠️ [R2 Upload Skipped] S3Client or R2_BUCKET_NAME missing in process.env. Using Base64 fallback. AccountID present:', !!process.env.R2_ACCOUNT_ID);
    return photoStr;
  }
  try {
    const matches = photoStr.match(/^data:image\/([a-zA-Z0-9+_-]+);base64,(.+)$/);
    if (matches) {
      const ext = matches[1].replace('jpeg', 'jpg');
      const buffer = Buffer.from(matches[2], 'base64');
      const fileName = `couples/${coupleId || 'shared'}/photo_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
      
      console.log(`📤 [R2 Uploading] Sending ${fileName} (${buffer.length} bytes) to bucket "${process.env.R2_BUCKET_NAME}"...`);
      await client.send(new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: `image/${ext}`
      }));
      
      const publicRoot = (process.env.R2_PUBLIC_URL || '').replace(/\/$/, '');
      const finalUrl = `${publicRoot}/${fileName}`;
      console.log(`✅ [R2 Upload Success] URL: ${finalUrl}`);
      return finalUrl;
    }
  } catch (err) {
    console.error('❌ [R2 Upload Error] Error uploading image to Cloudflare R2, keeping original Base64:', err.message, err);
  }
  return photoStr;
};

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

const JWT_SECRET = process.env.JWT_SECRET || 'lovesync-super-secret-key-123';
const PORT = process.env.PORT || 3000;

// Global map to store pending locks for couples during double-lock synchronization
const pendingLocks = new Map();

// PostgreSQL Connection Pool
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

// Auto-run schema.sql on startup to ensure tables exist (with retry logic)
const initDatabase = async (retries = 10, delay = 3000) => {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  for (let i = 1; i <= retries; i++) {
    try {
      // Test connection
      await pool.query('SELECT 1');
      // Run schema
      await pool.query(schemaSql);
      try {
        await pool.query('ALTER TABLE couples ADD COLUMN IF NOT EXISTS streak_count INT DEFAULT 0, ADD COLUMN IF NOT EXISTS last_streak_date DATE DEFAULT NULL, ADD COLUMN IF NOT EXISTS previous_streak INT DEFAULT 0, ADD COLUMN IF NOT EXISTS permanent_slots INT DEFAULT 0, ADD COLUMN IF NOT EXISTS unclaimed_streak_rewards INT DEFAULT 0, ADD COLUMN IF NOT EXISTS last_rewarded_streak INT DEFAULT 0;');
        await pool.query('ALTER TABLE dates ADD COLUMN IF NOT EXISTS reports_count INT DEFAULT 0, ADD COLUMN IF NOT EXISTS reported_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;');
      } catch (e) {
        console.warn('Advertencia ejecutando alter en initDatabase:', e.message);
      }
      console.log('PostgreSQL database schemas verified/created successfully.');
      return;
    } catch (error) {
      console.warn(`Failed to connect or initialize database (attempt ${i}/${retries}): ${error.message}`);
      if (i === retries) {
        console.error('Max database retries reached. Exiting.');
        process.exit(1);
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

// ── Authentication Middleware ──
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Acceso denegado. Token faltante.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido o expirado.' });
    req.user = user;
    next();
  });
};

// ── Auth Endpoints ──

// Register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  try {
    const userCheck = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'El correo ya está registrado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Generate clean unique invite code
    let inviteCode = '';
    let isUnique = false;
    while (!isUnique) {
      inviteCode = 'LVSY-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      const codeCheck = await pool.query('SELECT id FROM users WHERE invite_code = $1', [inviteCode]);
      if (codeCheck.rows.length === 0) isUnique = true;
    }

    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash, invite_code) VALUES ($1, $2, $3, $4) RETURNING id, name, email, invite_code',
      [name, email.toLowerCase(), passwordHash, inviteCode]
    );

    res.status(201).json({ message: 'Usuario registrado con éxito.', user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor al registrar.' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos.' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Credenciales inválidas.' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Credenciales inválidas.' });
    }

    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        couple_id: user.couple_id,
        invite_code: user.invite_code
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor al iniciar sesión.' });
  }
});

// ── Profile and Pairing Endpoints ──

// Get Profile Info
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const userRes = await pool.query(
      'SELECT id, name, email, couple_id, invite_code, last_trivia_date::text AS last_trivia_date, is_admin FROM users WHERE id = $1',
      [req.user.id]
    );
    if (userRes.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado.' });
    
    const user = userRes.rows[0];
    user.is_admin = !!(user.is_admin && user.id === 1 && user.email && user.email.toLowerCase() === 'jericesb5@gmail.com');
    let partnerName = null;
    let partnerId = null;
    let maxSlots = 10;
    let baseSlots = 10;
    let extraSlots = 0;
    let permanentSlots = 0;
    let unclaimedStreakRewards = 0;
    let lastRewardedStreak = 0;
    let unpairState = 'idle';
    let unpairRequestedBy = null;
    let unpairDaysLeft = 0;
    let streakCount = 0;
    let lastStreakDate = null;
    let previousStreak = 0;

    if (user.couple_id) {
      // Get partner info
      const partnerRes = await pool.query(
        'SELECT id, name FROM users WHERE couple_id = $1 AND id != $2 LIMIT 1',
        [user.couple_id, user.id]
      );
      if (partnerRes.rows.length > 0) {
        partnerName = partnerRes.rows[0].name;
        partnerId = partnerRes.rows[0].id;
      }

      // Ensure streak columns exist in production even if startup migrations were skipped
      try {
        await pool.query('ALTER TABLE couples ADD COLUMN IF NOT EXISTS streak_count INT DEFAULT 0, ADD COLUMN IF NOT EXISTS last_streak_date DATE DEFAULT NULL, ADD COLUMN IF NOT EXISTS previous_streak INT DEFAULT 0, ADD COLUMN IF NOT EXISTS permanent_slots INT DEFAULT 0, ADD COLUMN IF NOT EXISTS unclaimed_streak_rewards INT DEFAULT 0, ADD COLUMN IF NOT EXISTS last_rewarded_streak INT DEFAULT 0;');
      } catch (migErr) {
        // Ignored if already exists or permissions
      }

      // Get couple slots (base_slots + sum of extra_slots for the current month + permanent_slots)
      const coupleRes = await pool.query(
        `SELECT 
           c.slots AS base_slots,
           COALESCE(c.permanent_slots, 0) AS permanent_slots,
           COALESCE(c.unclaimed_streak_rewards, 0) AS unclaimed_streak_rewards,
           COALESCE(c.last_rewarded_streak, 0) AS last_rewarded_streak,
           c.unpair_requested_at,
           c.unpair_requested_by,
           c.streak_count,
           c.last_streak_date::text AS last_streak_date,
           c.previous_streak,
           COALESCE(
             (SELECT SUM(amount) FROM couple_extra_slots 
              WHERE couple_id = c.id 
                AND year = EXTRACT(YEAR FROM CURRENT_DATE)::int
                AND month = EXTRACT(MONTH FROM CURRENT_DATE)::int
             ), 0
           )::int AS extra_slots
         FROM couples c WHERE c.id = $1`,
        [user.couple_id]
      );
      if (coupleRes.rows.length > 0) {
        const couple = coupleRes.rows[0];
        baseSlots = couple.base_slots || 10;
        extraSlots = couple.extra_slots || 0;
        permanentSlots = couple.permanent_slots || 0;
        maxSlots = baseSlots + extraSlots + permanentSlots;
        unclaimedStreakRewards = couple.unclaimed_streak_rewards || 0;
        lastRewardedStreak = couple.last_rewarded_streak || 0;
        streakCount = couple.streak_count || 0;
        lastStreakDate = couple.last_streak_date || null;
        previousStreak = couple.previous_streak || 0;

        if (couple.unpair_requested_at) {
          const requestedDate = new Date(couple.unpair_requested_at);
          const diffTime = (new Date()) - requestedDate;
          const diffDays = diffTime / (1000 * 60 * 60 * 24);
          if (diffDays < 5) {
            unpairState = 'pending';
            unpairRequestedBy = couple.unpair_requested_by;
            unpairDaysLeft = Math.max(0, Math.ceil(5 - diffDays));
          } else {
            // Expired! We silently reset it
            await pool.query(
              'UPDATE couples SET unpair_requested_at = NULL, unpair_requested_by = NULL WHERE id = $1',
              [user.couple_id]
            );
          }
        }
      }
    }

    res.json({
      user,
      partnerName,
      partnerId,
      maxSlots,
      baseSlots,
      extraSlots,
      permanentSlots,
      unclaimedStreakRewards,
      lastRewardedStreak,
      unpairState,
      unpairRequestedBy,
      unpairDaysLeft,
      streakCount,
      lastStreakDate,
      previousStreak
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor al obtener perfil.', details: error.message, stack: error.stack });
  }
});

// Pair with partner
app.post('/api/profile/pair', authenticateToken, async (req, res) => {
  const { inviteCode } = req.body;
  if (!inviteCode) return res.status(400).json({ error: 'El código de invitación es requerido.' });

  const cleanCode = inviteCode.trim().toUpperCase();

  try {
    // 1. Get current user profile
    const userRes = await pool.query('SELECT id, couple_id FROM users WHERE id = $1', [req.user.id]);
    const user = userRes.rows[0];
    if (user.couple_id) {
      return res.status(400).json({ error: 'Ya estás vinculado a una pareja.' });
    }

    // 2. Find partner by invite code
    const partnerRes = await pool.query('SELECT id, couple_id FROM users WHERE invite_code = $1', [cleanCode]);
    if (partnerRes.rows.length === 0) {
      return res.status(404).json({ error: 'Código de invitación inválido o no encontrado.' });
    }

    const partner = partnerRes.rows[0];
    if (partner.id === user.id) {
      return res.status(400).json({ error: 'No puedes vincularte contigo mismo.' });
    }
    let coupleId = partner.couple_id;
    if (coupleId) {
      // Verificar cuántos miembros tiene actualmente este santuario de pareja
      const membersRes = await pool.query('SELECT COUNT(*) FROM users WHERE couple_id = $1', [coupleId]);
      const membersCount = parseInt(membersRes.rows[0].count, 10);
      if (membersCount >= 2) {
        return res.status(400).json({ error: 'Esta cuenta ya tiene un compañero/a vinculado y su bitácora está completa.' });
      }
      // Reconexión: el usuario se reincorpora al santuario existente donde se conservaron sus recuerdos
      await pool.query('UPDATE users SET couple_id = $1 WHERE id = $2', [coupleId, user.id]);
    } else {
      // 3. Create a brand new couple record
      const coupleRes = await pool.query('INSERT INTO couples (slots) VALUES (10) RETURNING id');
      coupleId = coupleRes.rows[0].id;
      // 4. Update both users with the new couple_id
      await pool.query('UPDATE users SET couple_id = $1 WHERE id = $2 OR id = $3', [coupleId, user.id, partner.id]);
    }

    res.json({ message: 'Vinculación completada con éxito. ¡Bienvenidos a su santuario compartida!', coupleId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor al vincular pareja.' });
  }
});

// Unpair / Desvincularse (Request, Cancel, and Confirm)

// Initiate unpairing request
app.post('/api/profile/unpair', authenticateToken, async (req, res) => {
  try {
    const userRes = await pool.query('SELECT couple_id FROM users WHERE id = $1', [req.user.id]);
    const coupleId = userRes.rows[0]?.couple_id;
    if (!coupleId) return res.status(400).json({ error: 'No estás en una pareja.' });
    
    // Set unpair request to NOW and requested_by to current user
    await pool.query(
      'UPDATE couples SET unpair_requested_at = NOW(), unpair_requested_by = $1 WHERE id = $2',
      [req.user.id, coupleId]
    );
    
    res.json({ success: true, message: 'Solicitud de desvinculación creada. Tu pareja tiene 5 días para aceptar.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al solicitar desvinculación.' });
  }
});

// Cancel pending unpairing request
app.post('/api/profile/unpair/cancel', authenticateToken, async (req, res) => {
  try {
    const userRes = await pool.query('SELECT couple_id FROM users WHERE id = $1', [req.user.id]);
    const coupleId = userRes.rows[0]?.couple_id;
    if (!coupleId) return res.status(400).json({ error: 'No estás en una pareja.' });
    
    await pool.query(
      'UPDATE couples SET unpair_requested_at = NULL, unpair_requested_by = NULL WHERE id = $1',
      [coupleId]
    );
    
    res.json({ success: true, message: 'Solicitud cancelada con éxito.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cancelar solicitud.' });
  }
});

// Confirm/Accept pending unpairing request
app.post('/api/profile/unpair/confirm', authenticateToken, async (req, res) => {
  try {
    const userRes = await pool.query('SELECT couple_id FROM users WHERE id = $1', [req.user.id]);
    const coupleId = userRes.rows[0]?.couple_id;
    if (!coupleId) return res.status(400).json({ error: 'No estás en una pareja.' });
    
    // Decouple both users
    await pool.query('UPDATE users SET couple_id = NULL WHERE couple_id = $1', [coupleId]);
    
    // Reset the couple columns
    await pool.query(
      'UPDATE couples SET unpair_requested_at = NULL, unpair_requested_by = NULL WHERE id = $1',
      [coupleId]
    );
    
    res.json({ success: true, message: 'Te has desvinculado con éxito.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al confirmar desvinculación.' });
  }
});

// Add monthly extra slots to couple (expires at the end of the calendar month)
app.post('/api/profile/slots', authenticateToken, async (req, res) => {
  const { amount } = req.body;
  const addAmount = parseInt(amount) || 1;
  
  try {
    const userRes = await pool.query('SELECT couple_id FROM users WHERE id = $1', [req.user.id]);
    const user = userRes.rows[0];
    if (!user.couple_id) {
      return res.status(400).json({ error: 'No estás vinculado a una pareja.' });
    }
    
    await pool.query(
      `INSERT INTO couple_extra_slots (couple_id, amount, year, month) 
       VALUES ($1, $2, EXTRACT(YEAR FROM CURRENT_DATE)::int, EXTRACT(MONTH FROM CURRENT_DATE)::int)`,
      [user.couple_id, addAmount]
    );
    
    const coupleRes = await pool.query(
      `SELECT 
         c.slots AS base_slots,
         COALESCE(
           (SELECT SUM(amount) FROM couple_extra_slots 
            WHERE couple_id = c.id 
              AND year = EXTRACT(YEAR FROM CURRENT_DATE)::int
              AND month = EXTRACT(MONTH FROM CURRENT_DATE)::int
           ), 0
         )::int AS extra_slots
       FROM couples c WHERE c.id = $1`,
      [user.couple_id]
    );
    
    const newMaxSlots = coupleRes.rows[0].base_slots + coupleRes.rows[0].extra_slots;
    res.json({ success: true, newMaxSlots });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar cupos.' });
  }
});

// Delete current user account (Derecho al Olvido)
app.delete('/api/users/me', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const userRes = await pool.query('SELECT id, email, couple_id FROM users WHERE id = $1', [userId]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    const user = userRes.rows[0];
    if (parseInt(user.id) === 1 || (user.email && user.email.toLowerCase() === 'jericesb5@gmail.com')) {
      return res.status(403).json({ error: 'Seguridad Ponytail: El Administrador Supremo es inborrable y está protegido permanentemente por el sistema.' });
    }
    const coupleId = user.couple_id;
    
    // 1. Eliminar únicamente a ESTE usuario que solicita el Derecho al Olvido
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);

    // 2. Verificar cuántos miembros quedan en la pareja
    if (coupleId) {
      const remainingRes = await pool.query('SELECT COUNT(*) FROM users WHERE couple_id = $1', [coupleId]);
      const remainingCount = parseInt(remainingRes.rows[0].count, 10);
      
      if (remainingCount === 0) {
        // No queda ningún miembro en la pareja: purgar todas las citas y la pareja de la base de datos
        await pool.query('DELETE FROM dates WHERE couple_id = $1', [coupleId]);
        await pool.query('DELETE FROM couples WHERE id = $1', [coupleId]);
      } else {
        // La pareja aún sigue en OurStory: conservar su bitácora intacta y limpiar solicitudes de desvinculación
        await pool.query('UPDATE couples SET unpair_requested_at = NULL, unpair_requested_by = NULL WHERE id = $1', [coupleId]);
      }
    }

    res.json({ success: true, message: 'Tu cuenta y datos personales han sido eliminados de forma permanente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la cuenta.' });
  }
});

// ── MercadoPago Payment Gateway Endpoints ──

// Create preference to buy extra slots
app.post('/api/payments/create-preference', authenticateToken, async (req, res) => {
  try {
    const { packageId } = req.body; // e.g. 'slots_2' or 'slots_10'
    const userRes = await pool.query('SELECT id, name, email, couple_id FROM users WHERE id = $1', [req.user.id]);
    const user = userRes.rows[0];
    if (!user || !user.couple_id) {
      return res.status(400).json({ error: 'Debes estar vinculado a una pareja para comprar cupos extras.' });
    }

    let title = 'OurStory - Bolsa Estrella (+10 Citas · 50% DCTO)';
    let unit_price = 4990;
    let slotsAmount = 10;

    if (packageId === 'slots_2') {
      title = 'OurStory - Bolsa de Apuro (+2 Citas)';
      unit_price = 1990;
      slotsAmount = 2;
    }

    const client = getMPClient();
    if (!client) {
      return res.status(503).json({ error: 'La pasarela de pagos no está configurada aún en el servidor (falta MP_ACCESS_TOKEN).' });
    }

    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: [
          {
            id: packageId || 'slots_5',
            title: title,
            quantity: 1,
            unit_price: Number(unit_price),
            currency_id: 'CLP'
          }
        ],
        payer: {
          name: user.name || 'Usuario OurStory',
          email: user.email || 'wearesamod@gmail.com'
        },
        external_reference: JSON.stringify({
          userId: user.id,
          coupleId: user.couple_id,
          slotsAmount: slotsAmount,
          streakRescue: !!req.body.streakRescue,
          timestamp: Date.now()
        }),
        back_urls: {
          success: 'https://ourstory.wearesamod.com/home?payment=success&tab=settings&slots=' + slotsAmount + (req.body.streakRescue ? '&rescued=true' : ''),
          failure: 'https://ourstory.wearesamod.com/home?payment=failure&tab=settings',
          pending: 'https://ourstory.wearesamod.com/home?payment=pending&tab=settings'
        },
        auto_return: 'approved'
      }
    });

    res.json({
      id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point
    });
  } catch (error) {
    console.error('❌ [MercadoPago Error] Error creando preferencia:', error);
    res.status(500).json({ error: 'Error al iniciar sesión de pago con MercadoPago.' });
  }
});

// MercadoPago Webhook handler for payment confirmation
app.post('/api/payments/webhook', async (req, res) => {
  try {
    const { type, topic, data } = req.body;
    const paymentId = data?.id || req.query?.id;
    const notificationType = type || topic;

    console.log(`🔔 [MercadoPago Webhook] Recibida notificación tipo: ${notificationType}, ID: ${paymentId}`);

    if ((notificationType === 'payment' || notificationType === 'merchant_order') && paymentId) {
      const client = getMPClient();
      if (client) {
        const payment = new Payment(client);
        const paymentData = await payment.get({ id: paymentId });

        console.log(`💵 [MercadoPago Pago] Estado: ${paymentData.status}, Ref: ${paymentData.external_reference}`);

        if (paymentData.status === 'approved' && paymentData.external_reference) {
          try {
            const checkRes = await pool.query('SELECT 1 FROM processed_payments WHERE payment_id = $1', [paymentId.toString()]);
            if (checkRes.rowCount === 0) {
              await pool.query('INSERT INTO processed_payments (payment_id) VALUES ($1)', [paymentId.toString()]);
              const refData = JSON.parse(paymentData.external_reference);
              const { coupleId, slotsAmount } = refData;

              if (coupleId && slotsAmount) {
                await pool.query(
                  `UPDATE couples SET permanent_slots = COALESCE(permanent_slots, 0) + $1 WHERE id = $2`,
                  [slotsAmount, coupleId]
                );
                if (refData.streakRescue) {
                  const todayStr = new Date().toLocaleDateString('sv-SE');
                  await pool.query(
                    `UPDATE couples SET 
                       streak_count = COALESCE(NULLIF(previous_streak, 0), streak_count, 0) + 1,
                       last_streak_date = $1,
                       previous_streak = 0
                     WHERE id = $2`,
                    [todayStr, coupleId]
                  );
                  console.log(`🚑🔥 [Rescate Racha] Racha restaurada para pareja ID ${coupleId}`);
                }
              }
            } else {
              console.log(`ℹ️ [MercadoPago Webhook] El pago ID ${paymentId} ya fue procesado anteriormente. Omitiendo duplicado.`);
            }
          } catch (parseErr) {
            console.error('Error parseando external_reference de MercadoPago o verificando duplicado:', parseErr.message);
          }
        }
      }
    }
    res.status(200).send('OK');
  } catch (error) {
    console.error('❌ [MercadoPago Webhook Error]:', error.message);
    res.status(500).send('Error procesando webhook');
  }
});

// Helper to update couple's love streak (called on daily trivia answers or adding a date)
const updateCoupleStreak = async (coupleId, localDateStr) => {
  if (!coupleId || !localDateStr) return;
  try {
    const coupleRes = await pool.query(
      'SELECT streak_count, last_streak_date::text AS last_streak_date, previous_streak FROM couples WHERE id = $1',
      [coupleId]
    );
    if (coupleRes.rows.length === 0) return;
    const couple = coupleRes.rows[0];
    const currentStreak = couple.streak_count || 0;
    const lastStreakDate = couple.last_streak_date;

    if (lastStreakDate === localDateStr) {
      // Already incremented streak today!
      return;
    }

    let newStreak = 1;
    let newPreviousStreak = couple.previous_streak || 0;

    if (lastStreakDate) {
      const today = new Date(localDateStr);
      const lastDate = new Date(lastStreakDate);
      const diffTime = today - lastDate;
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive day!
        newStreak = currentStreak + 1;
      } else if (diffDays > 1) {
        // Streak broken! Save previous if it was > 0
        if (currentStreak > 0) {
          newPreviousStreak = currentStreak;
        }
        newStreak = 1;
      } else if (diffDays < 0) {
        // Out of order or old date, don't update streak
        return;
      }
    } else {
      // First time ever
      newStreak = 1;
    }

    await pool.query(
      'UPDATE couples SET streak_count = $1, last_streak_date = $2, previous_streak = $3 WHERE id = $4',
      [newStreak, localDateStr, newPreviousStreak, coupleId]
    );

    // Piggy Bank reward: Every 7 days completed, add +1 unclaimed reward to the couple's savings pool if not yet rewarded for this milestone
    if (newStreak > 0 && newStreak % 7 === 0) {
      const cpCheck = await pool.query('SELECT COALESCE(last_rewarded_streak, 0) AS last_rewarded_streak FROM couples WHERE id = $1', [coupleId]);
      const lastRewarded = cpCheck.rows[0]?.last_rewarded_streak || 0;
      if (newStreak > lastRewarded) {
        await pool.query(
          `UPDATE couples SET unclaimed_streak_rewards = COALESCE(unclaimed_streak_rewards, 0) + 1, last_rewarded_streak = $1 WHERE id = $2`,
          [newStreak, coupleId]
        );
        console.log(`🎁 [Racha ${newStreak} días] +1 recompensa acumulada al ahorro de racha para pareja ID ${coupleId}`);
      }
    }
  } catch (err) {
    console.error('Error actualizando racha de la pareja:', err.message);
  }
};

// Claim streak reward from piggy bank
app.post('/api/profile/streak/claim', authenticateToken, async (req, res) => {
  try {
    const userRes = await pool.query('SELECT couple_id FROM users WHERE id = $1', [req.user.id]);
    const coupleId = userRes.rows[0]?.couple_id;
    if (!coupleId) return res.status(400).json({ error: 'No tienes una pareja vinculada.' });

    const cpRes = await pool.query('SELECT COALESCE(unclaimed_streak_rewards, 0) AS unclaimed_streak_rewards FROM couples WHERE id = $1', [coupleId]);
    const cp = cpRes.rows[0];
    if (!cp || cp.unclaimed_streak_rewards <= 0) {
      return res.status(400).json({ error: 'No tienes recompensas de racha pendientes por reclamar.' });
    }

    const now = new Date();
    await pool.query('UPDATE couples SET unclaimed_streak_rewards = unclaimed_streak_rewards - 1 WHERE id = $1', [coupleId]);
    await pool.query('INSERT INTO couple_extra_slots (couple_id, amount, year, month) VALUES ($1, 1, $2, $3)', [coupleId, now.getFullYear(), now.getMonth() + 1]);

    console.log(`🎉 [Racha Claim] +1 cupo reclamado a la bitácora por pareja ID ${coupleId}`);
    res.json({ success: true, message: '¡+1 Cupo de racha reclamado con éxito! Se ha sumado a tu bitácora del mes.' });
  } catch (error) {
    console.error('Error reclamando recompensa de racha:', error);
    res.status(500).json({ error: 'Error del servidor al reclamar recompensa.' });
  }
});

// Rescue streak using 10 accumulated rewards
app.post('/api/profile/streak/rescue-rewards', authenticateToken, async (req, res) => {
  try {
    const userRes = await pool.query('SELECT couple_id FROM users WHERE id = $1', [req.user.id]);
    const coupleId = userRes.rows[0]?.couple_id;
    if (!coupleId) return res.status(400).json({ error: 'No tienes una pareja vinculada.' });

    const cpRes = await pool.query('SELECT streak_count, previous_streak, COALESCE(unclaimed_streak_rewards, 0) AS unclaimed_streak_rewards FROM couples WHERE id = $1', [coupleId]);
    const cp = cpRes.rows[0];
    if (!cp) return res.status(404).json({ error: 'Pareja no encontrada.' });
    if (cp.streak_count > 0) return res.status(400).json({ error: 'Tu racha actual está activa, no necesitas recuperarla.' });
    if (cp.unclaimed_streak_rewards < 10) {
      return res.status(400).json({ error: 'Necesitas al menos 10 recompensas acumuladas para recuperar la racha gratis.' });
    }

    const restoredStreak = cp.previous_streak || 1;
    await pool.query(
      'UPDATE couples SET streak_count = $1, last_streak_date = CURRENT_DATE, unclaimed_streak_rewards = 0 WHERE id = $2',
      [restoredStreak, coupleId]
    );

    console.log(`🛡️ [Racha Rescatada con Ahorros] Racha de ${restoredStreak} días restaurada para pareja ID ${coupleId}`);
    res.json({ success: true, message: `¡Racha de ${restoredStreak} días restaurada con éxito usando tus recompensas acumuladas!` });
  } catch (error) {
    console.error('Error rescatando racha con recompensas:', error);
    res.status(500).json({ error: 'Error del servidor al recuperar racha.' });
  }
});

// Play daily trivia (enforces once per day per user, awards +1 expiring slot if both answer correctly)
app.post('/api/trivia/play', authenticateToken, async (req, res) => {
  const { correct, localDate } = req.body;
  
  // Validate localDate matches YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const validatedLocalDate = (localDate && dateRegex.test(localDate)) 
    ? localDate 
    : new Date().toLocaleDateString('sv-SE');

  const [year, month] = validatedLocalDate.split('-').map(Number);
  
  try {
    const userRes = await pool.query(
      'SELECT couple_id FROM users WHERE id = $1',
      [req.user.id]
    );
    const user = userRes.rows[0];
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' });
    if (!user.couple_id) return res.status(400).json({ error: 'Debes estar en una pareja para jugar.' });
    
    // Check if the user already played today using the new daily_trivia_answers table
    const alreadyPlayedRes = await pool.query(
      'SELECT id FROM daily_trivia_answers WHERE user_id = $1 AND date = $2',
      [req.user.id, validatedLocalDate]
    );
    
    if (alreadyPlayedRes.rows.length > 0) {
      return res.status(400).json({ error: 'Ya has jugado la trivia de hoy. ¡Vuelve mañana!' });
    }
    
    // Insert response into daily_trivia_answers
    await pool.query(
      'INSERT INTO daily_trivia_answers (user_id, couple_id, date, correct) VALUES ($1, $2, $3, $4)',
      [req.user.id, user.couple_id, validatedLocalDate, !!correct]
    );
    
    // Also update users.last_trivia_date for backward compatibility
    await pool.query(
      'UPDATE users SET last_trivia_date = $1 WHERE id = $2',
      [validatedLocalDate, req.user.id]
    );
    
    // Update love streak on trivia participation
    await updateCoupleStreak(user.couple_id, validatedLocalDate);
    
    let newMaxSlots = null;
    
    // Check if both partners have answered correctly today
    const answersRes = await pool.query(
      'SELECT user_id, correct FROM daily_trivia_answers WHERE couple_id = $1 AND date = $2',
      [user.couple_id, validatedLocalDate]
    );
    
    const answers = answersRes.rows;
    const allAnswered = answers.length === 2;
    const allCorrect = allAnswered && answers.every(a => a.correct);
    
    if (allCorrect) {
      // Award +1 slot to the couple for the local month and year
      await pool.query(
        `INSERT INTO couple_extra_slots (couple_id, amount, year, month) 
         VALUES ($1, 1, $2, $3)`,
        [user.couple_id, year, month]
      );
      
      const coupleRes = await pool.query(
        `SELECT 
           c.slots AS base_slots,
           COALESCE(
             (SELECT SUM(amount) FROM couple_extra_slots 
              WHERE couple_id = c.id 
                AND year = $2
                AND month = $3
             ), 0
           )::int AS extra_slots
         FROM couples c WHERE c.id = $1`,
        [user.couple_id, year, month]
      );
      newMaxSlots = coupleRes.rows[0].base_slots + coupleRes.rows[0].extra_slots;
    }
    
    res.json({ 
      success: true, 
      played: true, 
      correct: !!correct, 
      matchedDailySlots: allCorrect,
      newMaxSlots 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar la trivia.' });
  }
});

// Admin Verification Middleware
const requireAdmin = async (req, res, next) => {
  try {
    const adminCheck = await pool.query('SELECT id, email, is_admin FROM users WHERE id = $1', [req.user.id]);
    if (adminCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Acceso denegado. Usuario no encontrado.' });
    }
    const user = adminCheck.rows[0];
    const isTrueSupremeAdmin = user.is_admin && user.id === 1 && user.email && user.email.toLowerCase() === 'jericesb5@gmail.com';
    if (!isTrueSupremeAdmin) {
      return res.status(403).json({ error: 'Acceso denegado. Se requiere credencial de Administrador Supremo verificado (ID 1 / jericesb5@gmail.com).' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Error al verificar permisos de administrador.' });
  }
};

app.get('/api/debug/user-trivia', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await pool.query(
      'SELECT id, name, email, last_trivia_date::text AS last_trivia_date, CURRENT_DATE::text as server_current_date, NOW() as server_now FROM users ORDER BY id ASC'
    );
    const answers = await pool.query(
      'SELECT id, user_id, date, correct, created_at FROM daily_trivia_answers ORDER BY id DESC LIMIT 50'
    );
    
    let couplesError = null;
    let couplesCols = null;
    try {
      const couplesRes = await pool.query('SELECT * FROM couples LIMIT 1');
      couplesCols = Object.keys(couplesRes.rows[0] || {});
    } catch (err) {
      couplesError = err.message;
    }

    let profileError = null;
    try {
      const uRes = await pool.query(
        'SELECT id, name, email, couple_id, invite_code, last_trivia_date::text AS last_trivia_date, is_admin FROM users WHERE id = 1'
      );
      const user = uRes.rows[0];
      if (user && user.couple_id) {
        const partnerRes = await pool.query(
          'SELECT id, name FROM users WHERE couple_id = $1 AND id != $2 LIMIT 1',
          [user.couple_id, user.id]
        );
        const coupleRes = await pool.query(
          `SELECT 
             c.slots AS base_slots,
             c.unpair_requested_at,
             c.unpair_requested_by,
             COALESCE(
               (SELECT SUM(amount) FROM couple_extra_slots 
                WHERE couple_id = c.id 
                  AND year = EXTRACT(YEAR FROM CURRENT_DATE)::int
                  AND month = EXTRACT(MONTH FROM CURRENT_DATE)::int
               ), 0
             )::int AS extra_slots
           FROM couples c WHERE c.id = $1`,
          [user.couple_id]
        );
      }
    } catch (err) {
      profileError = err.message + '\nStack: ' + err.stack;
    }

    res.json({ 
      users: users.rows, 
      answers: answers.rows,
      couplesCols,
      couplesError,
      profileError
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/debug/reset-jota', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await pool.query("UPDATE users SET last_trivia_date = '2026-07-04' WHERE id = 1");
    await pool.query("UPDATE daily_trivia_answers SET date = '2026-07-04' WHERE user_id = 1 AND date = '2026-07-05'");
    res.json({ success: true, message: 'Jota reset successfully to July 4th!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ponytail: Debug endpoint to verify R2 connectivity and config in any environment
app.get('/api/debug/r2-status', authenticateToken, requireAdmin, async (req, res) => {
  const accountId = (process.env.R2_ACCOUNT_ID || '').trim();
  const accessKey = (process.env.R2_ACCESS_KEY_ID || '').trim();
  const secretKey = (process.env.R2_SECRET_ACCESS_KEY || '').trim();
  const bucketName = (process.env.R2_BUCKET_NAME || '').trim();
  const publicUrl = (process.env.R2_PUBLIC_URL || '').trim();

  const client = getS3Client();

  let testResult = 'Not attempted';
  let errorDetails = null;

  if (client && bucketName) {
    try {
      const testKey = `test_r2_status_${Date.now()}.txt`;
      await client.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: testKey,
        Body: 'R2 connectivity check'
      }));
      await client.send(new DeleteObjectCommand({
        Bucket: bucketName,
        Key: testKey
      }));
      testResult = 'SUCCESS (Write and Delete verified)';
    } catch (err) {
      testResult = 'FAILED';
      errorDetails = err.message;
    }
  }

  res.json({
    configured: !!client,
    hasAccountId: !!accountId,
    hasAccessKey: !!accessKey,
    hasSecretKey: !!secretKey,
    bucketName: bucketName || null,
    publicUrl: publicUrl || null,
    testUpload: testResult,
    error: errorDetails
  });
});

// Admin: Get all couples and members
app.get('/api/admin/couples', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const couplesRes = await pool.query(
      `SELECT 
         c.id, 
         c.slots AS base_slots, 
         c.created_at,
         COALESCE(
           JSON_AGG(
             JSON_BUILD_OBJECT('id', u.id, 'name', u.name, 'email', u.email)
           ) FILTER (WHERE u.id IS NOT NULL), '[]'::json
         ) AS members
       FROM couples c
       LEFT JOIN users u ON u.couple_id = c.id
       GROUP BY c.id
       ORDER BY c.created_at DESC`
    );
    res.json(couplesRes.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al listar parejas.' });
  }
});

// Admin: Update base slots of a couple
app.put('/api/admin/couples/:id/slots', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { slots } = req.body;
  const newSlots = parseInt(slots);
  
  if (isNaN(newSlots) || newSlots < 0) {
    return res.status(400).json({ error: 'La cantidad de cupos debe ser un número positivo.' });
  }
  
  try {
    const updateRes = await pool.query(
      'UPDATE couples SET slots = $1 WHERE id = $2 RETURNING *',
      [newSlots, id]
    );
    if (updateRes.rows.length === 0) {
      return res.status(404).json({ error: 'Pareja no encontrada.' });
    }
    res.json({ success: true, message: 'Cupos base actualizados con éxito.', couple: updateRes.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar cupos base.' });
  }
});

// Admin: Set streak & piggy bank rewards for testing
app.put('/api/admin/couples/:id/streak-test', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { streakCount = 7, unclaimedRewards = 1, previousStreak = 0 } = req.body;
  try {
    const todayStr = new Date().toLocaleDateString('sv-SE');
    const updateRes = await pool.query(
      `UPDATE couples SET 
         streak_count = $1, 
         unclaimed_streak_rewards = $2, 
         previous_streak = $3, 
         last_streak_date = $4,
         last_rewarded_streak = $1
       WHERE id = $5 RETURNING *`,
      [streakCount, unclaimedRewards, previousStreak, todayStr, id]
    );
    if (updateRes.rows.length === 0) return res.status(404).json({ error: 'Pareja no encontrada.' });
    res.json({ success: true, message: `Racha configurada a ${streakCount} días y ahorros a ${unclaimedRewards} recompensas.`, couple: updateRes.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar racha de prueba.' });
  }
});

// Admin: Delete a couple (also decouple users and delete their dates)
app.delete('/api/admin/couples/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const deleteRes = await pool.query('DELETE FROM couples WHERE id = $1 RETURNING *', [id]);
    if (deleteRes.rows.length === 0) {
      return res.status(404).json({ error: 'Pareja no encontrada.' });
    }
    res.json({ success: true, message: 'Pareja eliminada con éxito.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la pareja.' });
  }
});

// Admin: Delete a user
app.delete('/api/admin/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const targetCheck = await pool.query('SELECT id, email FROM users WHERE id = $1', [id]);
    if (targetCheck.rows.length > 0) {
      const target = targetCheck.rows[0];
      if (parseInt(target.id) === 1 || (target.email && target.email.toLowerCase() === 'jericesb5@gmail.com')) {
        return res.status(403).json({ error: 'Seguridad Ponytail: El Administrador Supremo (ID 1 / jericesb5@gmail.com) es inborrable y está protegido permanentemente por el sistema.' });
      }
    }
    const deleteRes = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    if (deleteRes.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    res.json({ success: true, message: 'Usuario eliminado con éxito.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el usuario.' });
  }
});

// Admin: Fetch reported dates for moderation
app.get('/api/admin/reported-dates', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const query = `
      SELECT d.id, d.location, d.city, d.description, d.photo_url, d.reports_count, d.reported_at, d.created_at,
             d.couple_id,
             COALESCE(u1.name, 'Usuario 1') AS author_1, COALESCE(u2.name, 'Usuario 2') AS author_2
      FROM dates d
      LEFT JOIN users u1 ON d.couple_id = u1.couple_id AND u1.id = (SELECT MIN(id) FROM users WHERE couple_id = d.couple_id)
      LEFT JOIN users u2 ON d.couple_id = u2.couple_id AND u2.id = (SELECT MAX(id) FROM users WHERE couple_id = d.couple_id AND id != u1.id)
      WHERE COALESCE(d.reports_count, 0) > 0
      ORDER BY d.reports_count DESC, d.reported_at DESC;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obteniendo citas reportadas.' });
  }
});

// Admin: Dismiss report on a date
app.post('/api/admin/reported-dates/:id/dismiss', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('UPDATE dates SET reports_count = 0, reported_at = NULL WHERE id = $1', [id]);
    res.json({ success: true, message: 'Reporte descartado.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al descartar el reporte.' });
  }
});

// Admin: Delete a reported date
app.delete('/api/admin/reported-dates/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM dates WHERE id = $1', [id]);
    res.json({ success: true, message: 'Cita reportada eliminada permanentemente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la cita reportada.' });
  }
});

// ── Dates (Bitácora) Endpoints ──

// Fetch all dates for exploration (anonymous display with likes)
app.get('/api/dates/explore', authenticateToken, async (req, res) => {
  try {
    const datesRes = await pool.query(
      `SELECT 
         d.id, d.location, d.city, d.date_time, d.description, 
         d.rating_user_1, d.rating_user_2, d.photo_url, d.tags, d.created_at,
         COUNT(l.id)::int AS likes_count,
         EXISTS(SELECT 1 FROM date_likes WHERE date_id = d.id AND user_id = $1) AS user_liked
       FROM dates d
       LEFT JOIN date_likes l ON l.date_id = d.id
       GROUP BY d.id
       ORDER BY d.created_at DESC`,
      [req.user.id]
    );
    res.json(datesRes.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cargar exploración.' });
  }
});

// Toggle Like on a date
app.post('/api/dates/:id/like', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const checkRes = await pool.query(
      'SELECT id FROM date_likes WHERE date_id = $1 AND user_id = $2',
      [id, userId]
    );

    if (checkRes.rows.length > 0) {
      await pool.query(
        'DELETE FROM date_likes WHERE date_id = $1 AND user_id = $2',
        [id, userId]
      );
      res.json({ liked: false });
    } else {
      await pool.query(
        'INSERT INTO date_likes (date_id, user_id) VALUES ($1, $2)',
        [id, userId]
      );
      res.json({ liked: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar el like.' });
  }
});

// Report date for moderation (Kanban 1.4)
app.post('/api/dates/:id/report', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('UPDATE dates SET reports_count = COALESCE(reports_count, 0) + 1, reported_at = NOW() WHERE id = $1', [id]);
    console.log(`Report received and stored for date ID ${id} by user ID ${req.user.id}`);
    res.json({ success: true, message: 'Cita reportada a moderación.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al reportar la cita.' });
  }
});

// Generate PDF Scrapbook of all dates for the couple
app.get('/api/dates/pdf', authenticateToken, async (req, res) => {
  try {
    // 1. Get user profile and couple_id
    const userRes = await pool.query(
      'SELECT couple_id, name FROM users WHERE id = $1',
      [req.user.id]
    );
    const user = userRes.rows[0];
    if (!user || !user.couple_id) {
      return res.status(400).json({ error: 'No estás vinculado a una pareja.' });
    }

    // Get partner name
    const partnerRes = await pool.query(
      'SELECT name FROM users WHERE couple_id = $1 AND id != $2 LIMIT 1',
      [user.couple_id, req.user.id]
    );
    const partnerName = partnerRes.rows[0]?.name || 'Pareja';

    // 2. Fetch all dates for the couple ordered by date_time
    const datesRes = await pool.query(
      'SELECT location, city, date_time, description, rating_user_1, rating_user_2, photo_url, tags FROM dates WHERE couple_id = $1 ORDER BY date_time ASC',
      [user.couple_id]
    );
    const dates = datesRes.rows;

    // Helper to strip emojis and unsupported unicode symbols (keeps Spanish accents/ñ/Ñ/etc.)
    const cleanText = (str) => {
      if (!str) return '';
      return str.replace(/[^\x00-\x7F\u00C0-\u017F]/g, '');
    };

    // 3. Initialize PDFKit document with buffered pages
    const doc = new PDFDocument({
      size: 'LETTER',
      bufferPages: true,
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });

    // Stream PDF to HTTP response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="our_story_scrapbook.pdf"`);
    doc.pipe(res);

    // --- Cover Page ---
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#fffafb'); // Cozy light pink background
    
    // Draw a vector heart on cover page
    doc.save()
       .translate(doc.page.width / 2 - 25, 120)
       .path('M25,12 C25,12 18,3 8,3 C-2,3 -4,15 8,24 C16,30 25,38 25,38 C25,38 34,30 42,24 C54,15 52,3 42,3 C32,3 25,12 25,12 Z')
       .fill('#ff375f')
       .restore();
    
    doc.moveDown(8);
    
    doc.fillColor('#2c3e50')
       .fontSize(36)
       .font('Helvetica-Bold')
       .text('Our Story', { align: 'center' });
       
    doc.fontSize(16)
       .font('Helvetica')
       .fillColor('#7f8c8d')
       .text('Nuestro Álbum de Recuerdos', { align: 'center' })
       .moveDown(2);
       
    doc.fontSize(22)
       .font('Helvetica-Bold')
       .fillColor('#ff375f')
       .text(`${cleanText(user.name)} & ${cleanText(partnerName)}`, { align: 'center' })
       .moveDown(3);
       
    doc.fontSize(12)
       .font('Helvetica-Oblique')
       .fillColor('#95a5a6')
       .text('Generado con amor', { align: 'center' });

    // --- Date Pages ---
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      doc.addPage({ size: 'LETTER', margins: { top: 50, bottom: 50, left: 50, right: 50 } });
      
      // Page background
      doc.rect(0, 0, doc.page.width, doc.page.height).fill('#ffffff');

      // Top header band
      doc.rect(50, 45, 512, 3).fill('#ff375f');

      // Title/Location
      doc.fillColor('#2c3e50')
         .fontSize(20)
         .font('Helvetica-Bold')
         .text(cleanText(date.location), 50, 65)
         .fontSize(12)
         .font('Helvetica')
         .fillColor('#7f8c8d')
         .text(`${cleanText(date.city)} • ${new Date(date.date_time).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}`)
         .moveDown(1);

      // Ratings
      const avgRating = ((parseFloat(date.rating_user_1) + parseFloat(date.rating_user_2)) / 2).toFixed(1);
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .fillColor('#e67e22')
         .text(`Valoración Promedio: ${avgRating} / 5.0  (${cleanText(user.name)}: ${date.rating_user_1} • ${cleanText(partnerName)}: ${date.rating_user_2})`)
         .moveDown(0.5);

      // Tags
      if (date.tags && date.tags.length > 0) {
        doc.fontSize(10)
           .font('Helvetica-Oblique')
           .fillColor('#9b59b6')
           .text(`Tags: ${cleanText(date.tags.join(', '))}`)
           .moveDown(1);
      }

      // Description / Recuerdo
      if (date.description) {
        doc.fillColor('#34495e')
           .fontSize(12)
           .font('Helvetica')
           .text(cleanText(date.description), { width: 512, align: 'justify' })
           .moveDown(1.5);
      }

      // Photo
      if (date.photo_url) {
        try {
          const photoStr = date.photo_url;
          let imgBuffer = null;
          if (photoStr.includes('base64,')) {
            const base64Data = photoStr.split('base64,')[1];
            imgBuffer = Buffer.from(base64Data, 'base64');
          } else if (photoStr.startsWith('http')) {
            const imgRes = await fetch(photoStr);
            if (imgRes.ok) {
              const arrayBuffer = await imgRes.arrayBuffer();
              imgBuffer = Buffer.from(arrayBuffer);
            }
          }
          if (imgBuffer) {
            // Fit image beautifully with a max height of 200 to prevent unnecessary page overflows
            doc.image(imgBuffer, {
              fit: [512, 200],
              align: 'center',
              valign: 'center'
            });
          }
        } catch (imgError) {
          console.error('Error drawing image in PDF:', imgError.message);
        }
      }
    }

    // --- Dynamic Page Numbering ---
    const range = doc.bufferedPageRange();
    for (let i = 0; i < range.count; i++) {
      doc.switchToPage(i);
      
      // Temporarily disable auto page breaks by setting bottom margin to 0
      const oldBottomMargin = doc.page.margins.bottom;
      doc.page.margins.bottom = 0;
      
      // Skip cover page
      if (i > 0) {
        doc.fontSize(9)
           .fillColor('#bdc3c7')
           .font('Helvetica')
           .text(`Página ${i + 1} de ${range.count}`, 50, doc.page.height - 35, { align: 'center' });
      }
      
      // Restore bottom margin
      doc.page.margins.bottom = oldBottomMargin;
    }

    doc.end();

  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Error al generar el PDF.' });
    }
  }
});

// Fetch dates
app.get('/api/dates', authenticateToken, async (req, res) => {
  try {
    const userRes = await pool.query('SELECT couple_id FROM users WHERE id = $1', [req.user.id]);
    const user = userRes.rows[0];
    if (!user.couple_id) {
      return res.status(400).json({ error: 'Debes estar vinculado a una pareja para ver las citas.' });
    }

    const datesRes = await pool.query(
      'SELECT id, location, city, date_time, description, rating_user_1, rating_user_2, photo_url, tags, created_at FROM dates WHERE couple_id = $1 ORDER BY date_time DESC, created_at DESC',
      [user.couple_id]
    );

    res.json(datesRes.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cargar las citas.' });
  }
});

// Create date
app.post('/api/dates', authenticateToken, async (req, res) => {
  const { location, city, date_time, description, rating_user_1, rating_user_2, tags, photo_url } = req.body;
  if (!location || !location.trim() || !city || !city.trim() || !date_time || !description || !description.trim()) {
    return res.status(400).json({ error: 'Ubicación/Título, ciudad, fecha y descripción de la cita son obligatorios.' });
  }

  try {
    const userRes = await pool.query('SELECT couple_id FROM users WHERE id = $1', [req.user.id]);
    const user = userRes.rows[0];
    if (!user.couple_id) {
      return res.status(400).json({ error: 'Debes estar vinculado a una pareja para crear citas.' });
    }

    // Check monthly slots limit: base_slots + current month extra slots
    const limitRes = await pool.query(
      `SELECT 
         c.slots AS base_slots,
         COALESCE(
           (SELECT SUM(amount) FROM couple_extra_slots 
            WHERE couple_id = c.id 
              AND year = EXTRACT(YEAR FROM CURRENT_DATE)::int
              AND month = EXTRACT(MONTH FROM CURRENT_DATE)::int
           ), 0
         )::int AS extra_slots,
         COALESCE(c.permanent_slots, 0) AS permanent_slots,
         (SELECT COUNT(id) FROM dates 
          WHERE couple_id = c.id 
            AND created_at >= DATE_TRUNC('month', CURRENT_DATE)
            AND created_at < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
         )::int AS dates_this_month
       FROM couples c
       WHERE c.id = $1`,
      [user.couple_id]
    );

    if (limitRes.rows.length > 0) {
      const { base_slots, extra_slots, permanent_slots, dates_this_month } = limitRes.rows[0];
      const monthlyFreeSlots = base_slots + extra_slots;
      const totalAvailableSlots = monthlyFreeSlots + permanent_slots;

      if (dates_this_month >= totalAvailableSlots) {
        return res.status(400).json({
          error: `Límite de citas alcanzado. Has registrado ${dates_this_month}/${totalAvailableSlots} citas este mes. Juega la Trivia o adquiere más cupos permanentes en la Tienda para continuar.`
        });
      }

      // Si ya consumieron toda la cuota mensual gratis (base + trivia), consumimos 1 de sus cupos permanentes
      if (dates_this_month >= monthlyFreeSlots && permanent_slots > 0) {
        await pool.query('UPDATE couples SET permanent_slots = GREATEST(0, permanent_slots - 1) WHERE id = $1', [user.couple_id]);
        console.log(`🪙 [Gasto de Cupo Permanente] Pareja ID ${user.couple_id} consumió 1 cupo permanente en nueva cita.`);
      }
    }

    const finalPhotoUrl = await uploadToR2IfBase64(
      photo_url || 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80',
      user.couple_id
    );

    const result = await pool.query(
      'INSERT INTO dates (couple_id, location, city, date_time, description, rating_user_1, rating_user_2, tags, photo_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [
        user.couple_id,
        location,
        city,
        date_time,
        description,
        rating_user_1 || 5.0,
        rating_user_2 || 5.0,
        tags || [],
        finalPhotoUrl
      ]
    );

    // Broadcast new date creation to the couple room via socket
    io.to(`couple_${user.couple_id}`).emit('date_created', result.rows[0]);

    // Update love streak when creating a date
    const localDateStr = new Date().toLocaleDateString('sv-SE');
    await updateCoupleStreak(user.couple_id, localDateStr);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar la cita.' });
  }
});

// Edit date (PUT /api/dates/:id) - Enforces 5-day window
app.put('/api/dates/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { location, city, date_time, description, rating_user_1, rating_user_2, tags, photo_url } = req.body;
  
  if (!location || !location.trim() || !city || !city.trim() || !date_time || !description || !description.trim()) {
    return res.status(400).json({ error: 'Ubicación/Título, ciudad, fecha y descripción de la cita son obligatorios.' });
  }
  
  try {
    const userRes = await pool.query('SELECT couple_id FROM users WHERE id = $1', [req.user.id]);
    const user = userRes.rows[0];
    if (!user.couple_id) {
      return res.status(400).json({ error: 'Debes estar vinculado a una pareja.' });
    }
    
    const dateRes = await pool.query('SELECT couple_id, created_at FROM dates WHERE id = $1', [id]);
    if (dateRes.rows.length === 0) {
      return res.status(404).json({ error: 'Cita no encontrada.' });
    }
    
    const date = dateRes.rows[0];
    if (date.couple_id !== user.couple_id) {
      return res.status(403).json({ error: 'No tienes permiso para modificar esta cita.' });
    }
    
    const createdAt = new Date(date.created_at);
    const fiveDaysInMs = 5 * 24 * 60 * 60 * 1000;
    if (Date.now() - createdAt.getTime() > fiveDaysInMs) {
      return res.status(400).json({ error: 'El plazo de 5 días para editar esta cita ha vencido.' });
    }
    
    const finalPhotoUrl = await uploadToR2IfBase64(photo_url, user.couple_id);

    const updateRes = await pool.query(
      'UPDATE dates SET location = $1, city = $2, date_time = $3, description = $4, rating_user_1 = $5, rating_user_2 = $6, tags = $7, photo_url = $8 WHERE id = $9 RETURNING *',
      [location, city, date_time, description, rating_user_1, rating_user_2, tags || [], finalPhotoUrl, id]
    );
    
    io.to(`couple_${user.couple_id}`).emit('date_updated', updateRes.rows[0]);
    
    res.json(updateRes.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la cita.' });
  }
});

// Delete date (DELETE /api/dates/:id) - Enforces 5-day window
app.delete('/api/dates/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  
  try {
    const userRes = await pool.query('SELECT id, email, couple_id, is_admin FROM users WHERE id = $1', [req.user.id]);
    const user = userRes.rows[0];
    const isSupremeAdmin = user && user.is_admin && user.id === 1 && user.email && user.email.toLowerCase() === 'jericesb5@gmail.com';
    
    const dateRes = await pool.query('SELECT couple_id, created_at FROM dates WHERE id = $1', [id]);
    if (dateRes.rows.length === 0) {
      return res.status(404).json({ error: 'Cita no encontrada.' });
    }
    
    const date = dateRes.rows[0];
    if (!isSupremeAdmin) {
      if (!user.couple_id) {
        return res.status(400).json({ error: 'Debes estar vinculado a una pareja.' });
      }
      if (date.couple_id !== user.couple_id) {
        return res.status(403).json({ error: 'No tienes permiso para eliminar esta cita.' });
      }
      const createdAt = new Date(date.created_at);
      const fiveDaysInMs = 5 * 24 * 60 * 60 * 1000;
      if (Date.now() - createdAt.getTime() > fiveDaysInMs) {
        return res.status(400).json({ error: 'El plazo de 5 días para eliminar esta cita ha vencido.' });
      }
    }
    
    await pool.query('DELETE FROM dates WHERE id = $1', [id]);
    
    if (date.couple_id) {
      io.to(`couple_${date.couple_id}`).emit('date_deleted', { id: parseInt(id) });
    }
    io.emit('explore_date_deleted', { id: parseInt(id) });
    
    res.json({ message: 'Cita eliminada con éxito.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la cita.' });
  }
});

// ── WebSockets (Socket.io) double lock click syncing ──
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join_couple', (data) => {
    const rawCoupleId = typeof data === 'object' ? data.coupleId : data;
    const userId = typeof data === 'object' ? data.userId : null;
    
    if (!rawCoupleId) return;
    const coupleId = Number(rawCoupleId);
    
    socket.coupleId = coupleId;
    if (userId) socket.userId = userId;
    
    socket.join(`couple_${coupleId}`);
    console.log(`Socket ${socket.id} joined room couple_${coupleId}`);
    
    const waitingUser = pendingLocks.get(coupleId);
    if (waitingUser) {
      socket.emit('partner_lock_event', { userId: waitingUser });
    }
  });

  socket.on('partner_lock', (data) => {
    const { coupleId: rawCoupleId, userId } = data;
    if (rawCoupleId) {
      const coupleId = Number(rawCoupleId);
      socket.coupleId = coupleId;
      socket.userId = userId;
      
      const existingLock = pendingLocks.get(coupleId);
      if (existingLock && existingLock !== userId) {
        // Both clicked (Match). Clear lock immediately
        pendingLocks.delete(coupleId);
        socket.to(`couple_${coupleId}`).emit('partner_lock_event', { userId });
      } else {
        // First lock
        pendingLocks.set(coupleId, userId);
        socket.to(`couple_${coupleId}`).emit('partner_lock_event', { userId });
        setTimeout(() => {
          if (pendingLocks.get(coupleId) === userId) {
            pendingLocks.delete(coupleId);
            socket.to(`couple_${coupleId}`).emit('partner_lock_event', { userId: null });
          }
        }, 600000);
      }
    }
  });

  socket.on('clear_lock', (rawCoupleId) => {
    if (rawCoupleId) {
      const coupleId = Number(rawCoupleId);
      pendingLocks.delete(coupleId);
      socket.to(`couple_${coupleId}`).emit('partner_lock_event', { userId: null });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    if (socket.coupleId && socket.userId) {
      const coupleId = Number(socket.coupleId);
      const waitingUser = pendingLocks.get(coupleId);
      if (waitingUser === socket.userId) {
        pendingLocks.delete(coupleId);
        socket.to(`couple_${coupleId}`).emit('partner_lock_event', { userId: null });
      }
    }
  });
});

// Start Server and Initialize Database
httpServer.listen(PORT, async () => {
  console.log(`LoveSync backend running on port ${PORT}`);
  await initDatabase();
});
