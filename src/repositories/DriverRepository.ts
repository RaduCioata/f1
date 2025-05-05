import { Repository, FindOptionsWhere, Like, Between } from "typeorm";
import { AppDataSource } from "../config/database";
import { Driver } from "../entities/Driver";

export class DriverRepository {
    private repository: Repository<Driver>;

    constructor() {
        this.repository = AppDataSource.getRepository(Driver);
    }

    async create(driverData: Partial<Driver>): Promise<Driver> {
        const driver = this.repository.create(driverData);
        return await this.repository.save(driver);
    }

    async findById(id: number): Promise<Driver | null> {
        return await this.repository.findOne({
            where: { id },
            relations: ["team"]
        });
    }

    async findAll(
        filters?: {
            firstName?: string;
            lastName?: string;
            nationality?: string;
            driverNumber?: number;
            teamId?: number;
            dateOfBirthRange?: { start: Date; end: Date };
        },
        sort?: {
            field: keyof Driver;
            order: "ASC" | "DESC";
        }
    ): Promise<Driver[]> {
        const where: FindOptionsWhere<Driver> = {};

        if (filters) {
            if (filters.firstName) where.firstName = Like(`%${filters.firstName}%`);
            if (filters.lastName) where.lastName = Like(`%${filters.lastName}%`);
            if (filters.nationality) where.nationality = Like(`%${filters.nationality}%`);
            if (filters.driverNumber) where.driverNumber = filters.driverNumber;
            if (filters.teamId) where.team = { id: filters.teamId };
            if (filters.dateOfBirthRange) {
                where.dateOfBirth = Between(
                    filters.dateOfBirthRange.start,
                    filters.dateOfBirthRange.end
                );
            }
        }

        const queryBuilder = this.repository.createQueryBuilder("driver")
            .leftJoinAndSelect("driver.team", "team")
            .where(where);

        if (sort) {
            queryBuilder.orderBy(`driver.${sort.field}`, sort.order);
        }

        return await queryBuilder.getMany();
    }

    async update(id: number, driverData: Partial<Driver>): Promise<Driver | null> {
        await this.repository.update(id, driverData);
        return await this.findById(id);
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.repository.delete(id);
        return result.affected !== undefined && result.affected > 0;
    }
} 