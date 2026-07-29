require("dotenv").config();

const app = require("./app");
const connectDatabase = require("./config/database");

const PORT = process.env.PORT || 5003;

async function startServer() {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    await connectDatabase();

    app.listen(PORT, "127.0.0.1", () => {
      console.log(`Server running at http://127.0.0.1:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
}

startServer();
