const createApp = require("../src/app");

async function main() {
  const app = await createApp();

  process.on("uncaughtException", (error) => {
    console.log(`uncaughtException: ${error}`);
  });

  for (const signal of ["SIGTERM", "SIGHUP", "SIGINT", "SIGUSR2"]) {
    process.on(signal, async () => {
      if (!app.isShuttingDown) {
        console.log(`### system signal: ${signal}. graceful shutdown 시작`);
        await app.stop();
        console.log("### graceful shutdown 완료");
        process.exit(0);
      }
    });
  }

  app.start();
}

main();
