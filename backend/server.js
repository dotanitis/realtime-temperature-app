const express = require('express');
const { Server } = require ('ws');
const {Pool} = require('pg');

const app = express();
const PORT = 5000;
const WS_PORT = 5001;

// PostgreSQL connection
const pool = new Pool({
  host : 'db',
  user : 'user',
  password : 'password',
  database : 'temperatures',
  port : 5432
});

app.get('/', (req, res) =>{
  res.send('Temperature Backend Running');
});

const wsServer = new Server({port : WS_PORT});

wsServer.on('listening', () => {
  console.log(`Websocket server start on port ${WS_PORT}`);
});

wsServer.on('connection', (socket) => {
  console.log('Client connected');
});

//simulate temperature and send every second

setInterval(async() => {
  const temperature = 30 + Math.random() * 20;
  const timestamp = new Date();


  //Insert into DB
  await pool.query('INSERT INTO temperature_data (temperature, created_at) VALUES ($1, $2)', [temperature, timestamp]);

  wsServer.clients.forEach((client) => {
    if (client.readyState === 1){
      client.send(JSON.stringify({ temperature, timestamp}));
    }
  });
}, 1000);

app.listen(PORT, ()=> console.log(`HTTP Server on port ${PORT}`));
