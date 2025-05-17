const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",         // replace with your MySQL username
  password: "",         // replace with your MySQL password
  database: "student_db",
});

db.connect((err) => {
  if (err) throw err;
  console.log("✅ Connected to MySQL student_db");
});

// Add new student
app.post("/register", (req, res) => {
  const { name, roll_no, branch, email } = req.body;
  const sql = "INSERT INTO students (name, roll_no, branch, email) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, roll_no, branch, email], (err) => {
    if (err) return res.status(500).send("❌ Error saving student data");
    res.send("✅ Student registered successfully!");
  });
});

// Get all students
app.get("/students", (req, res) => {
  db.query("SELECT * FROM students", (err, rows) => {
    if (err) return res.status(500).send("❌ Error fetching students");
    res.json(rows);
  });
});

// Get single student by roll number
app.get("/students/:roll_no", (req, res) => {
  const { roll_no } = req.params;
  db.query("SELECT * FROM students WHERE roll_no = ?", [roll_no], (err, rows) => {
    if (err) return res.status(500).send("❌ Error fetching student");
    if (rows.length === 0) return res.status(404).send("Student not found");
    res.json(rows[0]);
  });
});

// Update student by roll number
app.put("/students/:roll_no", (req, res) => {
  const { name, branch, email } = req.body;
  const { roll_no } = req.params;
  const sql = "UPDATE students SET name = ?, branch = ?, email = ? WHERE roll_no = ?";
  db.query(sql, [name, branch, email, roll_no], (err) => {
    if (err) return res.status(500).send("❌ Error updating student");
    res.send("✅ Student updated successfully!");
  });
});

// Delete student by roll number
app.delete("/students/:roll_no", (req, res) => {
  const { roll_no } = req.params;
  db.query("DELETE FROM students WHERE roll_no = ?", [roll_no], (err) => {
    if (err) return res.status(500).send("❌ Error deleting student");
    res.send("✅ Student deleted successfully!");
  });
});

// Start server
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
