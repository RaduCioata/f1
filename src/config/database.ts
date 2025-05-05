import { DataSource } from "typeorm";
import { Team } from "../entities/Team";
import { Driver } from "../entities/Driver";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "", // default XAMPP password is empty
    database: "formulaone",
    synchronize: true, // set to false in production
    logging: true,
    entities: [Team, Driver],
    migrations: [],
    subscribers: [],
}); 