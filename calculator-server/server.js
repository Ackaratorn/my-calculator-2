require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "121251", // เปลี่ยนเป็นรหัสจริงของมึง
  database: "calculator_db",
  port: 3306
});

connection.connect(err => {
  if (err) console.error("MySQL Connect Error:", err);
  else console.log("MySQL connected ✅");
});

// POST /calculate
app.post("/calculate", (req, res) => {
  const { expression, result } = req.body;

  if (!expression || !result) return res.status(400).json({ error: "Missing data" });

  const sql = "INSERT INTO history (expression, result) VALUES (?, ?)";
  connection.query(sql, [expression, result], (err) => {
    if (err) {
      console.error("MySQL INSERT Error:", err);
      return res.status(500).json({ error: err });
    }
    console.log("Saved to DB:", expression, result);
    res.json({ status: "saved" });
  });
});

// GET /history
app.get("/history", (req, res) => {
  connection.query("SELECT * FROM history ORDER BY id DESC", (err, data) => {
    if (err) return res.status(500).json({ error: err });
    res.json(data);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
