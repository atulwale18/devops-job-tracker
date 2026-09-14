const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "job_tracker",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "UP",
    message: "Job Tracker API is running"
  });
});

// Get all jobs
app.get("/api/jobs", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM jobs ORDER BY id DESC"
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch jobs"
    });
  }
});

// Add new job
app.post("/api/jobs", async (req, res) => {
  try {
    const {
      company,
      position,
      location,
      status,
      applied_date,
      job_url,
      notes
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO jobs
      (company, position, location, status, applied_date, job_url, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        company,
        position,
        location,
        status,
        applied_date,
        job_url,
        notes
      ]
    );

    res.status(201).json({
      message: "Job application added successfully",
      id: result.insertId
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to add job"
    });
  }
});

// Update job
app.put("/api/jobs/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      company,
      position,
      location,
      status,
      applied_date,
      job_url,
      notes
    } = req.body;

    await db.query(
      `UPDATE jobs SET
      company = ?,
      position = ?,
      location = ?,
      status = ?,
      applied_date = ?,
      job_url = ?,
      notes = ?
      WHERE id = ?`,
      [
        company,
        position,
        location,
        status,
        applied_date,
        job_url,
        notes,
        id
      ]
    );

    res.json({
      message: "Job application updated successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to update job"
    });
  }
});

// Delete job
app.delete("/api/jobs/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      "DELETE FROM jobs WHERE id = ?",
      [id]
    );

    res.json({
      message: "Job application deleted successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to delete job"
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Job Tracker API running on port ${PORT}`);
});
