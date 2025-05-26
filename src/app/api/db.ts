import { DataSource } from "typeorm";
import { Team } from "../../entities/Team";
import { Driver } from "../../entities/Driver";

const isDevelopment = process.env.NODE_ENV === 'development';

let datasource: DataSource | null = null;

export async function getDataSource() {
    if (!datasource) {
        datasource = new DataSource({
            type: "mysql",
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || "3306"),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            synchronize: isDevelopment, // Only true in development
            logging: isDevelopment,
            entities: [Team, Driver],
            ssl: process.env.NODE_ENV === 'production' ? {
                rejectUnauthorized: false
            } : false,
            extra: {
                connectionLimit: 1
            }
        });
    }

    if (!datasource.isInitialized) {
        try {
            await datasource.initialize();
            console.log("Data Source has been initialized!");
        } catch (error) {
            console.error("Error during Data Source initialization:", error);
            datasource = null;
            throw error;
        }
    }

    return datasource;
} 