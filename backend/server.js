const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3001;

const app = express();
// 1. Middleware CORS globale
app.use(cors());

// 2. Gestione richieste OPTIONS
app.options('*', cors());

app.use(express.json());
app.use(bodyParser.json());


const STORAGE_PATH = path.join(process.cwd(), process.env.STORAGE || 'storage');
const DATA_FILE = 'data.json'

const SECRET = 'supersegreto';
const USERS_FILE = 'users.json';

// Funzione per creare la directory se non esiste
function ensureDirectoryExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true }); // Crea tutte le cartelle mancanti
  }
}

function getUsers() {
  const usersPath = path.join(STORAGE_PATH, USERS_FILE);
  console.log(usersPath)
  // Crea la directory se manca
  ensureDirectoryExists(usersPath);

  if (!fs.existsSync(path.join(STORAGE_PATH, USERS_FILE))) {
    try {
      fs.writeFileSync(usersPath, JSON.stringify([], null, 2), 'utf8');
      console.log('File creato con successo!');
    } catch (err) {
      console.error('Errore durante la creazione del file:', err);
    }
    return [];
  }
  return JSON.parse(fs.readFileSync(usersPath));
}

function saveUsers(users) {
  const usersPath = path.join(STORAGE_PATH, USERS_FILE);
  console.log(usersPath)
  // Crea la directory se manca
  ensureDirectoryExists(usersPath);
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), 'utf-8');
}

app.post('/api/register', async (req, res) => {
  console.log("Called GET /api/register");
  const { email, password, nickname } = req.body;
  const users = getUsers();

  if (users.find(u => u.email === email)) {
    return res.status(400).send('Email già esistente');
  }

  if (users.find(u => u.nickname === nickname)) {
    return res.status(400).send('Nickname già esistente');
  }

  const hashed = await bcrypt.hash(password, 10);
  users.push({ email, password: hashed, nickname });
  try {
    saveUsers(users);
    console.log("New user registered: ")
    console.log({ email, password: hashed, nickname })
    res.send('Registrazione avvenuta con successo');
  } catch(err) {
    console.error('Errore in /api/register:', err); // Identifica l'errore
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  console.log("Called GET /api/login");
  const { email, password } = req.body;
  const users = getUsers();
  const user = users.find(u => u.email === email);

  console.log(req.body);
  console.log(users);

  if (!user || !await bcrypt.compare(password, user.password)) {
    console.log("Login failed -> sending status 401");
    return res.status(401).send('Credenziali errate');
  }

  const nickname = user.nickname;

  console.log("User login: ")
  console.log({ email, nickname })

  const token = jwt.sign({ email }, SECRET, { expiresIn: '1h' });
  res.json({ nickname, token });
});

function authenticate(req, res, next) {
  console.log("Called authentication");
  console.log(req.headers.authorization);

  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.sendStatus(401);

  const token = auth.split(' ')[1];
  try {
    req.user = jwt.verify(token, SECRET);
    console.log("Authentication successful -> " + req.user)
    next();
  } catch {
    console.log("Authentication failed -> sending status 403");
    res.sendStatus(403);
  }
}

// Endpoint to get data
app.get('/api/data/:date', authenticate, (req, res) => {
  console.log("Called GET /api/data/" + req.params.date);

  const date = req.params.date;

  const dataPath = path.join(STORAGE_PATH, DATA_FILE);
  ensureDirectoryExists(dataPath)
  if (!fs.existsSync(dataPath)) {
    try {
      fs.writeFileSync(dataPath, JSON.stringify([], null, 2), 'utf8');
      console.log('File creato con successo!');
    } catch (err) {
      console.error('Errore durante la creazione del file:', err);
    }
  }

  let fileData = {}
  try {
    fileData = fs.readFileSync(dataPath, 'utf8');
    fileData = JSON.parse(fileData);

    if (fileData[date] === undefined) {
      fileData[date] = {};
    }

    res.send(fileData[date]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }  
});

app.get('/api/data/:date/:user', authenticate, (req, res) => {
  console.log("Called GET /api/data/" + req.params.date + "/" + req.params.user);

  const date = req.params.date;
  const user = req.params.user;

  const dataPath = path.join(STORAGE_PATH, DATA_FILE);
  ensureDirectoryExists(dataPath)
  if (!fs.existsSync(dataPath)) {
    try {
      fs.writeFileSync(dataPath, JSON.stringify([], null, 2), 'utf8');
      console.log('File creato con successo!');
    } catch (err) {
      console.error('Errore durante la creazione del file:', err);
    }
  }

  try {
    let fileData = fs.readFileSync(dataPath, 'utf8');
    fileData = JSON.parse(fileData);

    if (fileData[date] === undefined) {
      fileData[date] = { [user]: 0 };
    }
    if(fileData[date][user] === undefined) {
      fileData[date][user] = 0;
    }

    res.json({ count: fileData[date][user] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to update data
app.put('/api/data/:date/:user', authenticate, (req, res) => {
  console.log("Called PUT /api/data/" + req.params.date + "/" + req.params.user);

  const date = req.params.date;
  const user = req.params.user;

  const dataPath = path.join(STORAGE_PATH, DATA_FILE);
  ensureDirectoryExists(dataPath)
  if (!fs.existsSync(dataPath)) {
    try {
      fs.writeFileSync(dataPath, JSON.stringify([], null, 2), 'utf8');
      console.log('File creato con successo!');
    } catch (err) {
      console.error('Errore durante la creazione del file:', err);
    }
  }

  // Ensure fileData is an object if it wasn't initialized within the catch block above.
  let fileData = {};

  try {
    // Attempt to read the file. If it doesn't exist or an error occurs, catch block will handle it.
    fileData = fs.readFileSync(dataPath, 'utf8');

    // Parse the JSON data from the file
    fileData = JSON.parse(fileData);
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal Server Error');
  }

  if (fileData[date] === undefined) {
    fileData[date] = { [user]: 0 };
  }

  // Update data based on request body
  fileData[date][user] = req.body.count

  // Write the updated data back to the JSON file
  fs.writeFileSync(dataPath, JSON.stringify(fileData, null, 2));

  res.status(200).send('Data updated successfully');
});

// Endpoint di health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Keep-alive interno
const keepAlive = () => {
  const url = process.env.RENDER_EXTERNAL_URL || `http://localhost:${process.env.PORT}`;
  
  setInterval(async () => {
    try {
      const response = await fetch(`${url}/health`);
      console.log(`Keep-alive ping: ${response.status} at ${new Date().toISOString()}`);
    } catch (error) {
      console.log('Keep-alive failed:', error.message);
    }
  }, 1 * 60 * 1000); // Ogni 14 minuti (Render va in sleep dopo 15 min)
};

keepAlive()


const server = app.listen(PORT, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Server running at http://' + host + ':' + port)
});