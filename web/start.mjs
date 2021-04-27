import Server from "./server.mjs";
import DBProvider from "db/loader.mjs";
import logger from "logger/index.mjs";

const server = new Server(3000);
const db = new DBProvider(
  "postgres://postgres:postgres@localhost:5432/telegramBotDB"
);

(async () => {
  try {
    await server.start();
    await db.connectToDB();
  } catch (err) {
    logger.error(err);
  }
})();

const shutdown = async () => {
  try {
    await server.stop();
    await db.closeConnection();
  } catch (err) {
    logger.error(err);
  }
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
