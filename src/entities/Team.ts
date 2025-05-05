import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Driver } from "./Driver";

@Entity()
export class Team {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    teamConstructor!: string;

    @Column()
    baseLocation!: string;

    @Column()
    foundedYear!: number;

    @OneToMany(() => Driver, driver => driver.team)
    drivers!: Driver[];
} 