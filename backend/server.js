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
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'lovesync-super-secret-key-123';
const PORT = process.env.PORT || 3000;

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
      'SELECT id, name, email, couple_id, invite_code FROM users WHERE id = $1',
      [req.user.id]
    );
    if (userRes.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado.' });
    
    const user = userRes.rows[0];
    let partnerName = null;
    let maxSlots = 10;

    if (user.couple_id) {
      // Get partner info
      const partnerRes = await pool.query(
        'SELECT name FROM users WHERE couple_id = $1 AND id != $2 LIMIT 1',
        [user.couple_id, user.id]
      );
      if (partnerRes.rows.length > 0) {
        partnerName = partnerRes.rows[0].name;
      }

      // Get couple slots
      const coupleRes = await pool.query('SELECT slots FROM couples WHERE id = $1', [user.couple_id]);
      if (coupleRes.rows.length > 0) {
        maxSlots = coupleRes.rows[0].slots;
      }
    }

    res.json({
      user,
      partnerName,
      maxSlots
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

// Unpair / Desvincularse (Decouples both partners but keeps the dates in DB)
app.post('/api/profile/unpair', authenticateToken, async (req, res) => {
  try {
    const userRes = await pool.query('SELECT couple_id FROM users WHERE id = $1', [req.user.id]);
    const coupleId = userRes.rows[0]?.couple_id;
    
    if (coupleId) {
      await pool.query('UPDATE users SET couple_id = NULL WHERE couple_id = $1', [coupleId]);
    }
    
    res.json({ message: 'Te has desvinculado con éxito.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al desvincular.' });
  }
});

// ── Dates (Bitácora) Endpoints ──

// Fetch all dates for exploration (anonymous display)
app.get('/api/dates/explore', authenticateToken, async (req, res) => {
  try {
    const datesRes = await pool.query(
      'SELECT id, location, city, date_time, description, rating_user_1, rating_user_2, photo_url, tags, created_at FROM dates ORDER BY created_at DESC'
    );
    res.json(datesRes.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cargar exploración.' });
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
      'SELECT id, location, city, date_time, description, rating_user_1, rating_user_2, photo_url, tags FROM dates WHERE couple_id = $1 ORDER BY date_time DESC',
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

// ── WebSockets (Socket.io) double lock click syncing ──
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join_couple', (coupleId) => {
    socket.join(`couple_${coupleId}`);
    console.log(`Socket ${socket.id} joined room couple_${coupleId}`);
  });

  socket.on('partner_lock', (data) => {
    const { coupleId, userId } = data;
    if (coupleId) {
      // Broadcast partner click to other users in the couple room
      socket.to(`couple_${coupleId}`).emit('partner_lock_event', { userId });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start Server and Initialize Database
httpServer.listen(PORT, async () => {
  console.log(`LoveSync backend running on port ${PORT}`);
  await initDatabase();
});
