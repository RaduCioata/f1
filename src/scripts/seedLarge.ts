import { faker } from '@faker-js/faker';
import { AppDataSource } from '../config/database';
import { Team } from '../entities/Team';
import { Driver } from '../entities/Driver';

const TEAM_COUNT = 100000;
const DRIVER_COUNT = 100000;
const BATCH_SIZE = 500;

async function seed() {
  await AppDataSource.initialize();
  console.log('Database initialized. Seeding teams...');

  // Insert Teams in batches
  const teams: Team[] = [];
  for (let i = 0; i < TEAM_COUNT; i++) {
    const team = new Team();
    team.name = faker.company.name();
    team.teamConstructor = faker.company.name();
    team.baseLocation = faker.location.city();
    team.foundedYear = faker.number.int({ min: 1950, max: 2024 });
    teams.push(team);
    if (teams.length === BATCH_SIZE || i === TEAM_COUNT - 1) {
      await AppDataSource.manager.save(teams);
      console.log(`Inserted ${i + 1} teams...`);
      teams.length = 0;
    }
  }

  // Fetch all teams for driver assignment
  const allTeams = await AppDataSource.getRepository(Team).find({ select: ["id"] });
  console.log('Teams seeded. Seeding drivers...');

  // Insert Drivers in batches, round-robin assignment
  const drivers: Driver[] = [];
  for (let i = 0; i < DRIVER_COUNT; i++) {
    const driver = new Driver();
    driver.firstName = faker.person.firstName();
    driver.lastName = faker.person.lastName();
    driver.nationality = faker.location.country();
    driver.dateOfBirth = faker.date.birthdate();
    driver.driverNumber = faker.number.int({ min: 1, max: 99 });
    // Assign to a team in round-robin fashion
    const assignedTeam = allTeams[i % allTeams.length];
    driver.team = assignedTeam as any;
    drivers.push(driver);
    if (drivers.length === BATCH_SIZE || i === DRIVER_COUNT - 1) {
      await AppDataSource.manager.save(drivers);
      console.log(`Inserted ${i + 1} drivers...`);
      drivers.length = 0;
    }
  }

  console.log('Seeding complete!');
  process.exit(0);
}

seed(); 