const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 8080;
const hostname = '127.0.0.1'; 

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'Frontend')));

const dbFile = path.join(__dirname, 'MyDatabase.db');
const dbExists = fs.existsSync(dbFile);
console.log(`Database file ${dbFile} exists: ${dbExists}`);

const db = new sqlite3.Database(dbFile, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Nicht Conncected', err);
  } else {
    console.log('Connected');
  }
});

db.serialize(() => {
  console.log('Creating table if not exists...');
  db.run(`CREATE TABLE IF NOT EXISTS measurements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    datum TEXT NOT NULL,
    groesse Text NOT NULL,
    left INTEGER DEFAULT 0,
    top INTEGER DEFAULT 0
  )`, [], (err) => {
    if (err) {
      console.error('Error Tabelle:', err.message);
    } else {
      console.log('Tabelle exiestiert schon');
    }
  });
});

app.get('/measurements', (req, res) => {
  console.log('GET /Measurement Wert erhalten');
  db.all('SELECT * FROM measurements', [], (err, rows) => {
    if (err) {
      console.error('Error fetching data:', err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post('/measurements', (req, res) => {
  const { name, datum, groesse } = req.body;

  if (!name || !datum || !groesse) {
    return res.status(400).json({ error: 'Alle Felder ausfüllen!' });
  }

  const sql = 'INSERT INTO measurements (name, datum, groesse) VALUES (?, ?, ?)';
  const values = [name, datum, groesse];

  db.run(sql, values, function(err) {
    if (err) {
      console.error('Error data:', err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log('Inserted data:', { id: this.lastID, name, datum, groesse });
    res.status(201).json({ id: this.lastID });
  });
});

app.delete('/measurements/:id', (req, res) => {
  console.log('DELETE /measurements/:id request received');
  const { id } = req.params;
  db.run('DELETE FROM measurements WHERE id = ?', id, function(err) {
    if (err) {
      console.error('Error deleting data:', err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    console.log('Deleted data with id:', id);
    res.json({ message: 'Deleted successfully' });
  });
});

app.patch('/measurements/:id', (req, res) => {
  const { id } = req.params;
  const { left, top } = req.body;

  if (left == null || top == null) {
    return res.status(400).json({ error: 'Left and Top' });
  }

  const sql = 'UPDATE measurements SET left = ?, top = ? WHERE id = ?';
  const values = [left, top, id];

  db.run(sql, values, function(err) {
    if (err) {
      console.error('Error updating:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Updated' });
  });
});

app.get('/', (req, res) => {
  console.log('GET / request received');
  res.sendFile(path.join(__dirname, '..', 'Frontend', 'Startseite.html'));
});

app.listen(port, hostname, () => {
  console.log(`MeasureWallKids server is running on http://${hostname}:${port}/`);
});
