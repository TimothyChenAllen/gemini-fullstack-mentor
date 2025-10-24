import express, { Request, Response } from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';

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
  db.run(`
    CREATE TABLE IF NOT EXISTS languages (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       name TEXT NOT NULL,
       coolness INTEGER
    )
    `, (err) => {
       if (err) {
          console.error('Error creating table:', err.message);
       } else {
          console.log('Table "languages" is ready.');
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
