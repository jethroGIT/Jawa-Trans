const app = require('./src/app');
const http = require('http');
const { Server } = require('socket.io');

const PORT = 8000;

// Buat HTTP server manual agar bisa dipasang socket.io
const server = http.createServer(app);

// Pasang socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Simpan instance io ke express app (biar bisa diakses dari controller)
app.set("io", io);

// Test jika client nyambung
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
});

// Jalankan server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
