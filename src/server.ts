import { Server } from "http";
import app from "./app";
import config from "./config";

async function main() {
  const server: Server = app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });

  const existHandler = () => {
    if (server) {
      server.close(() => {
        console.info("Server closed");
      });
    }
  };

  process.on("uncaughtException", (err) => {
    console.log(err);
    existHandler();
  });
  process.on("unhandledRejection", (err) => {
    console.log(err);
    existHandler();
  });
}

main();
