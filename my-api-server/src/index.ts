import express, { Request, Response } from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';

// Initialize the Express application
const app = express();
const PORT = 3001; // We choose a port for our server to listen on

// Connect to (or create) the SQLite database
const db = new sqlite3.Database('./app.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Define the Schema
db.serialize(() => {
  // Our existing 'languages' table
  db.run(`
    CREATE TABLE IF NOT EXISTS languages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      coolness INTEGER
    )
  `);

  // The new 'users' table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      console.log('Table "users" is ready.');
    }
  });
});

// Add Middleware
app.use(cors());
app.use(express.json());

// This is our first route handler.
// It listens for GET requests at the path '/api/greeting'.
app.get('/api/greeting', (req: Request, res: Response) => {
  res.json({ text: "Hello from the Al-Khwarizmi/Ellis/Codd collaborative server!", timestamp: new Date().toISOString() });
});

// --- Step 3: Create /register Endpoint ---
app.post('/api/register', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  try {
    // We must "probabilistically" hash the password.
    // '10' is the "salt round" - a measure of hashing complexity.
    const passwordHash = await bcrypt.hash(password, 10);

    // Now we store the hash, NOT the password.
    const sql = "INSERT INTO users (username, password_hash) VALUES (?, ?)";
    
    // We use .run() and a callback to handle potential UNIQUE constraint errors
    db.run(sql, [username, passwordHash], function(err) {
      if (err) {
        if (err.message.includes("UNIQUE constraint failed")) {
          return res.status(400).json({ error: "Username already taken." });
        }
        return res.status(500).json({ error: err.message });
      }
      // Send back the new user's ID
      res.status(201).json({ id: this.lastID, username });
    });

  } catch (err) {
    res.status(500).json({ error: "Server error during registration." });
  }
});

// GET all languages
app.get('/api/languages', (req: Request, res: Response) => {
  const sql = "SELECT * FROM languages ORDER BY coolness DESC";
  
  // db.all() fetches all matching rows
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    // Send the rows (our data) as JSON
    res.json({ data: rows });
  });
});

// POST a new language
app.post('/api/languages', (req: Request, res: Response) => {
  // We get the data from the request body
  const { name, coolness } = req.body;

  // Basic validation
  if (!name || coolness === undefined) {
    return res.status(400).json({ error: "Missing required fields: name and coolness." });
  }

  const sql = "INSERT INTO languages (name, coolness) VALUES (?, ?)";
  
  // db.run() executes a query.
  // We use placeholders (?) to prevent SQL Injection attacks.
  // 'this' context inside the callback refers to the query result
  db.run(sql, [name, coolness], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    // Send back the newly created row's ID
    res.status(201).json({ id: this.lastID, name, coolness });
  });
});

// Start the server and make it listen for incoming connections on our chosen port.
app.listen(PORT, () => {
  console.log(`🚀 Server is collaborating on http://localhost:${PORT}`);
});
