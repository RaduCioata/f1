require("reflect-metadata");
const { initializeDatabase } = require("./config/initDatabase");

async function main() {
    await initializeDatabase();
    // You can add more logic here, e.g., start a server or run scripts
}

main(); 