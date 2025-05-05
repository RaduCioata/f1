import { Repository, FindOptionsWhere, Like, Between } from "typeorm";
import { AppDataSource } from "../config/database";
import { Team } from "../entities/Team";

export class TeamRepository {
    private repository: Repository<Team>;

    constructor() {
        this.repository = AppDataSource.getRepository(Team);
    }

    async create(teamData: Partial<Team>): Promise<Team> {
        const team = this.repository.create(teamData);
        return await this.repository.save(team);
    }

    async findById(id: number): Promise<Team | null> {
        return await this.repository.findOne({
            where: { id },
            relations: ["drivers"]
        });
    }

    async findAll(
        filters?: {
            name?: string;
            teamConstructor?: string;
            baseLocation?: string;
            foundedYear?: number;
            foundedYearRange?: { start: number; end: number };
        },
        sort?: {
            field: keyof Team;
            order: "ASC" | "DESC";
        }
    ): Promise<Team[]> {
        const where: FindOptionsWhere<Team> = {};

        if (filters) {
            if (filters.name) where.name = Like(`%${filters.name}%`);
            if (filters.teamConstructor) where.teamConstructor = Like(`%${filters.teamConstructor}%`);
            if (filters.baseLocation) where.baseLocation = Like(`%${filters.baseLocation}%`);
            if (filters.foundedYear) where.foundedYear = filters.foundedYear;
            if (filters.foundedYearRange) {
                where.foundedYear = Between(
                    filters.foundedYearRange.start,
                    filters.foundedYearRange.end
                );
            }
        }

        const queryBuilder = this.repository.createQueryBuilder("team")
            .leftJoinAndSelect("team.drivers", "driver")
            .where(where);

        if (sort) {
            queryBuilder.orderBy(`team.${sort.field}`, sort.order);
        }

        return await queryBuilder.getMany();
    }

    async update(id: number, teamData: Partial<Team>): Promise<Team | null> {
        await this.repository.update(id, teamData);
        return await this.findById(id);
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.repository.delete(id);
        return result.affected !== undefined && result.affected > 0;
    }
} 