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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    let partnerName = null;
    let partnerId = null;
    let maxSlots = 10;

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

      // Get couple slots (base_slots + sum of extra_slots for the current month)
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
      if (coupleRes.rows.length > 0) {
        const couple = coupleRes.rows[0];
        maxSlots = couple.base_slots + couple.extra_slots;

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
      unpairState,
      unpairRequestedBy,
      unpairDaysLeft
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor al obtener perfil.' });
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
    if (partner.couple_id) {
      return res.status(400).json({ error: 'Esta pareja ya está vinculada con otra cuenta.' });
    }

    // 3. Create a couple record
    const coupleRes = await pool.query('INSERT INTO couples (slots) VALUES (10) RETURNING id');
    const coupleId = coupleRes.rows[0].id;

    // 4. Update both users with the new couple_id
    await pool.query('UPDATE users SET couple_id = $1 WHERE id = $2 OR id = $3', [coupleId, user.id, partner.id]);

    res.json({ message: 'Vinculación completada con éxito.', coupleId });
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

app.get('/api/debug/user-trivia', async (req, res) => {
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

    res.json({ 
      users: users.rows, 
      answers: answers.rows,
      couplesCols,
      couplesError
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/debug/reset-jota', async (req, res) => {
  try {
    await pool.query("UPDATE users SET last_trivia_date = '2026-07-04' WHERE id = 1");
    await pool.query("UPDATE daily_trivia_answers SET date = '2026-07-04' WHERE user_id = 1 AND date = '2026-07-05'");
    res.json({ success: true, message: 'Jota reset successfully to July 4th!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Verification Middleware
const requireAdmin = async (req, res, next) => {
  try {
    const adminCheck = await pool.query('SELECT is_admin FROM users WHERE id = $1', [req.user.id]);
    if (adminCheck.rows.length === 0 || !adminCheck.rows[0].is_admin) {
      return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de Administrador.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Error al verificar permisos de administrador.' });
  }
};

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

    // 3. Initialize PDFKit document
    const doc = new PDFDocument({
      size: 'LETTER',
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });

    // Stream PDF to HTTP response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="our_story_scrapbook.pdf"`);
    doc.pipe(res);

    // --- Cover Page ---
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#fffafb'); // Cozy light pink background
    doc.fillColor('#ff375f');
    
    // Draw decorative hearts
    doc.fontSize(60).text('♡', { align: 'center', dy: 100 });
    doc.moveDown(1);
    
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
       .text(`${user.name} & ${partnerName}`, { align: 'center' })
       .moveDown(3);
       
    doc.fontSize(12)
       .font('Helvetica-Oblique')
       .fillColor('#95a5a6')
       .text('Generado con amor ♡', { align: 'center' });

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
         .text(date.location, 50, 65)
         .fontSize(12)
         .font('Helvetica')
         .fillColor('#7f8c8d')
         .text(`${date.city} • ${new Date(date.date_time).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}`)
         .moveDown(1);

      // Ratings
      const avgRating = ((parseFloat(date.rating_user_1) + parseFloat(date.rating_user_2)) / 2).toFixed(1);
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .fillColor('#e67e22')
         .text(`Valoración: ⭐ ${avgRating} / 5.0  (${user.name}: ${date.rating_user_1} • ${partnerName}: ${date.rating_user_2})`)
         .moveDown(0.5);

      // Tags
      if (date.tags && date.tags.length > 0) {
        doc.fontSize(10)
           .font('Helvetica-Oblique')
           .fillColor('#9b59b6')
           .text(`Tags: ${date.tags.join(', ')}`)
           .moveDown(1);
      }

      // Description / Recuerdo
      if (date.description) {
        doc.fillColor('#34495e')
           .fontSize(12)
           .font('Helvetica')
           .text(date.description, { width: 512, align: 'justify' })
           .moveDown(1.5);
      }

      // Photo
      if (date.photo_url) {
        try {
          const photoStr = date.photo_url;
          if (photoStr.includes('base64,')) {
            const base64Data = photoStr.split('base64,')[1];
            const imgBuffer = Buffer.from(base64Data, 'base64');
            // Fit image beautifully
            doc.image(imgBuffer, {
              fit: [512, 280],
              align: 'center',
              valign: 'center'
            });
          }
        } catch (imgError) {
          console.error('Error drawing image in PDF:', imgError.message);
          doc.fontSize(10)
             .fillColor('#e74c3c')
             .font('Helvetica-Oblique')
             .text('[Error al cargar la foto de esta cita]');
        }
      }
      
      // Page number
      doc.fontSize(9)
         .fillColor('#bdc3c7')
         .font('Helvetica')
         .text(`Página ${i + 2}`, 50, doc.page.height - 35, { align: 'center' });
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
  if (!location || !city || !date_time) {
    return res.status(400).json({ error: 'Ubicación, ciudad y fecha son requeridas.' });
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
      const { base_slots, extra_slots, dates_this_month } = limitRes.rows[0];
      const maxSlots = base_slots + extra_slots;
      if (dates_this_month >= maxSlots) {
        return res.status(400).json({
          error: `Límite de citas alcanzado. Has registrado ${dates_this_month}/${maxSlots} citas este mes. Juega la Trivia o adquiere más cupos para continuar.`
        });
      }
    }

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
        photo_url || 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80'
      ]
    );

    // Broadcast new date creation to the couple room via socket
    io.to(`couple_${user.couple_id}`).emit('date_created', result.rows[0]);

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
  
  if (!location || !city || !date_time) {
    return res.status(400).json({ error: 'Ubicación, ciudad y fecha son requeridas.' });
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
    
    const updateRes = await pool.query(
      'UPDATE dates SET location = $1, city = $2, date_time = $3, description = $4, rating_user_1 = $5, rating_user_2 = $6, tags = $7, photo_url = $8 WHERE id = $9 RETURNING *',
      [location, city, date_time, description, rating_user_1, rating_user_2, tags || [], photo_url, id]
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
      return res.status(403).json({ error: 'No tienes permiso para eliminar esta cita.' });
    }
    
    const createdAt = new Date(date.created_at);
    const fiveDaysInMs = 5 * 24 * 60 * 60 * 1000;
    if (Date.now() - createdAt.getTime() > fiveDaysInMs) {
      return res.status(400).json({ error: 'El plazo de 5 días para eliminar esta cita ha vencido.' });
    }
    
    await pool.query('DELETE FROM dates WHERE id = $1', [id]);
    
    io.to(`couple_${user.couple_id}`).emit('date_deleted', { id: parseInt(id) });
    
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
