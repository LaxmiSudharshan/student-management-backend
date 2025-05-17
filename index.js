require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MySQL connection (from .env)
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL");
});

// Create student
app.post("/register", (req, res) => {
  const { name, roll_no, branch, email } = req.body;
  const query = "INSERT INTO students (name, roll_no, branch, email) VALUES (?, ?, ?, ?)";
  db.query(query, [name, roll_no, branch, email], (err) => {
    if (err) return res.status(500).send("Error inserting student");
    res.send("Student registered");
  });
});

// Get all students
app.get("/students", (req, res) => {
  db.query("SELECT * FROM students", (err, rows) => {
    if (err) return res.status(500).send("Error fetching students");
    res.json(rows);
  });
});

// Get single student by roll_no
app.get("/students/:roll_no", (req, res) => {
  db.query("SELECT * FROM students WHERE roll_no = ?", [req.params.roll_no], (err, rows) => {
    if (err) return res.status(500).send("Error finding student");
    if (rows.length === 0) return res.status(404).send("Student not found");
    res.json(rows[0]);
  });
});

// Update student
app.put("/students/:roll_no", (req, res) => {
  const { name, branch, email } = req.body;
  db.query("UPDATE students SET name=?, branch=?, email=? WHERE roll_no=?", 
    [name, branch, email, req.params.roll_no],
    (err) => {
      if (err) return res.status(500).send("Error updating student");
      res.send("Student updated");
    });
});

// Delete student
app.delete("/students/:roll_no", (req, res) => {
  db.query("DELETE FROM students WHERE roll_no=?", [req.params.roll_no], (err) => {
    if (err) return res.status(500).send("Error deleting student");
    res.send("Student deleted");
  });
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
