const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// สร้างฐานข้อมูล SQLite
const db = new sqlite3.Database("./calculator.db", (err) => {
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
  let result;
  try {
    // คำนวณ expression แบบปลอดภัย (เลข + - * / .)
    if (!/^[0-9+\-*/.() ]+$/.test(expression)) {
      throw new Error("Invalid characters");
    }
    result = eval(expression); // ระวัง eval ใช้เฉพาะ trusted input
    // บันทึกลง history
    db.run(
      "INSERT INTO history (expression, result) VALUES (?, ?)",
      [expression, result],
      (err) => {
        if (err) console.error(err.message);
      }
    );
    res.json({ result });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ error: "Invalid expression" });
  }
});

// GET /history
app.get("/api/history", (req, res) => {
  db.all("SELECT * FROM history ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.listen(3001, '0.0.0.0', () => console.log("Server running on port 3001"));
