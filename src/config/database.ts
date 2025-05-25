import { DataSource } from "typeorm";
import { Team } from "../entities/Team";
import { Driver } from "../entities/Driver";

const isDevelopment = process.env.NODE_ENV === 'development';

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "", // default XAMPP password is empty
    database: process.env.DB_NAME || "formulaone",
    synchronize: isDevelopment, // set to false in production
    logging: isDevelopment,
    entities: [Team, Driver],
    migrations: [],
    subscribers: [],
    ssl: !isDevelopment ? {
        rejectUnauthorized: false // Required for some cloud providers
    } : false
}); 