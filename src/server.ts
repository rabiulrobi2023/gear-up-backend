import app from "./app";
import config from "./app/config";
import { prisma } from "./app/lib/prisma";

async function main() {
  try {
    const port = config.PORT;
    await prisma.$connect();
    console.log("Postgres database connected successfully");
    app.listen(port, () =>
      console.log(`Gear up server is running on port ${port}`),
    );
  } catch (error) {
    console.error("Error starting the server", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
