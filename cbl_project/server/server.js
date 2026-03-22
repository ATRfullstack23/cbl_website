import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const PORT = Number(process.env.PORT) || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('Set MONGO_URI in .env (see .env.example)');
  process.exit(1);
}

const team_schema = new mongoose.Schema({
  name: { type: String, required: true },
  mp: { type: Number, default: 0 },
  w: { type: Number, default: 0 },
  l: { type: Number, default: 0 },
  tp: { type: Number, default: 0 },
});

const Team = mongoose.model('Team', team_schema);

const default_teams = [
  { name: 'Smash Masters', mp: 18, w: 13, l: 5, tp: 26 },
  { name: 'Thunder Boys', mp: 18, w: 13, l: 5, tp: 26 },
  { name: 'Smart Boys', mp: 18, w: 1, l: 17, tp: 2 },
];

async function seed_if_empty() {
  var n = await Team.countDocuments();
  if (n === 0) {
    await Team.insertMany(default_teams);
    console.log('Seeded default teams');
  }
}

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || true }));
app.use(express.json());

app.get('/api/health', function (req, res) {
  res.json({ ok: true });
});

/** Sorted by tp desc; rank computed */
app.get('/api/teams', async function (req, res) {
  try {
    var teams = await Team.find().lean();
    var sorted = teams.slice().sort(function (a, b) {
      return b.tp - a.tp;
    });
    var rows = sorted.map(function (t, i) {
      return {
        _id: t._id,
        rank: i + 1,
        team: t.name,
        mp: t.mp,
        w: t.w,
        l: t.l,
        tp: t.tp,
      };
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: String(err && err.message ? err.message : err) });
  }
});

app.put('/api/teams/:id', async function (req, res) {
  try {
    var patch = req.body && typeof req.body === 'object' ? { ...req.body } : {};
    if (patch.team != null && patch.name == null) {
      patch.name = patch.team;
    }
    delete patch.team;
    delete patch.rank;
    delete patch._id;
    delete patch.__v;
    var updated = await Team.findByIdAndUpdate(req.params.id, { $set: patch }, { new: true, runValidators: true });
    if (!updated) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: String(err && err.message ? err.message : err) });
  }
});

async function start() {
  await mongoose.connect(MONGO_URI);
  console.log('MongoDB connected');
  await seed_if_empty();
  app.listen(PORT, function () {
    console.log('API http://localhost:' + PORT);
  });
}

start().catch(function (err) {
  console.error(err);
  process.exit(1);
});
