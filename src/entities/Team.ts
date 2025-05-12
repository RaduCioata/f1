import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from "typeorm";
import { Driver } from "./Driver";

@Entity()
export class Team {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    @Index()
    teamConstructor!: string;

    @Column()
    baseLocation!: string;

    @Column()
    foundedYear!: number;

    @OneToMany(() => Driver, driver => driver.team)
    drivers!: Driver[];
} 