import { AppDataSource } from "./database";

export async function initializeDatabase() {
    try {
        await AppDataSource.initialize();
        console.log("Database connection established successfully");
    } catch (error) {
        console.error("Error during database initialization:", error);
        throw error;
    }
} 