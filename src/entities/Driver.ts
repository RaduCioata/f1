import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Team } from "./Team";

@Entity()
export class Driver {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column()
    nationality!: string;

    @Column()
    dateOfBirth!: Date;

    @Column()
    driverNumber!: number;

    @ManyToOne(() => Team, team => team.drivers)
    @JoinColumn()
    team!: Team;
} 