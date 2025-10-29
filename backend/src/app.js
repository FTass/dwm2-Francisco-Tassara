// backend/app.js
require('dotenv').config();
const Server = require('./server');

(async () => {
  try {
    const server = new Server();
    await server.listen(); // <-- espera DB + luego levanta HTTP
  } catch (err) {
    console.error('Fallo al iniciar la app:', err);
    process.exit(1);
  }
})();
