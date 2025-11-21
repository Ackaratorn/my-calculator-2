const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// DB
const db = new sqlite3.Database("./calculator.db", err => {
  if (err) console.error(err.message);
  else console.log("Connected to SQLite DB ✅");
});

// สร้างตาราง history
db.run(`CREATE TABLE IF NOT EXISTS history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  expression TEXT NOT NULL,
  result TEXT NOT NULL
)`);

// POST /calculate
app.post("/api/calculate", (req, res) => {
  const { expression } = req.body;
  try {
    if (!/^[0-9+\-*/.() ]+$/.test(expression)) throw new Error("Invalid characters");
    const result = eval(expression);
    
    db.run(
      "INSERT INTO history (expression, result) VALUES (?, ?)",
      [expression, result],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ result });
      }
    );
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /history
app.get("/api/history", (req, res) => {
  db.all("SELECT * FROM history ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

const PORT = parseInt(process.env.PORT, 10) || 3001;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
