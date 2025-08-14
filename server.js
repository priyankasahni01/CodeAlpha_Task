// server.js (minimal)
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { nanoid } = require('nanoid');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/songs', express.static(path.join(__dirname, 'uploads')));

// multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g,'_'))
});
const upload = multer({ storage, fileFilter: (req, file, cb) => {
  cb(null, file.mimetype.startsWith('audio/'));
}});

// simple JSON db helpers
const DB = path.join(__dirname, 'db.json');
function readDB(){ return JSON.parse(fs.readFileSync(DB, 'utf8') || '{"tracks":[],"playlists":[]}'); }
function writeDB(d){ fs.writeFileSync(DB, JSON.stringify(d, null, 2)); }

// upload route
app.post('/upload', upload.array('songs'), (req, res) => {
  const db = readDB();
  const added = (req.files || []).map(f => {
    const track = { id: nanoid(), title: f.originalname, artist:'Unknown', genre:'Unknown', srcType:'file', url:`/songs/${f.filename}` };
    db.tracks.push(track);
    return track;
  });
  writeDB(db);
  res.json({ success: true, files: added });
});

// basic track listing
app.get('/api/tracks', (req,res)=>{
  const db = readDB();
  res.json(db.tracks);
});

app.listen(PORT, ()=>console.log(`Server running at http://localhost:${PORT}`));
