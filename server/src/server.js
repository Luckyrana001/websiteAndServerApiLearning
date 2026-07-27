require("dotenv").config();

const app = require("./app");

const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || "localhost";

const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Server started on http://${HOST}:${PORT}`);
});

server.on("error", (error) => {
  console.error("❌ Server failed to start:", error.message);
  process.exitCode = 1;
});
