import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "../config/database";
import { Team } from "../entities/Team";
import { Driver } from "../entities/Driver";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Get all teams (for dropdown)
app.get("/teams", async (req, res) => {
  try {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    const teams = await AppDataSource.getRepository(Team).find();
    res.json(teams);
  } catch (err) {
    console.error("Error in /teams endpoint:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all drivers (with team info)
app.get("/drivers", async (req, res) => {
  try {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    const drivers = await AppDataSource.getRepository(Driver).find({ relations: ["team"] });
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add a GET endpoint for a single driver
app.get("/drivers/:id", async (req, res) => {
  try {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    const id = Number(req.params.id);
    const driver = await AppDataSource.getRepository(Driver).findOne({
      where: { id },
      relations: ["team"]
    });
    if (!driver) return res.status(404).json({ error: "Driver not found" });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add a driver
app.post("/drivers", async (req, res) => {
  try {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    const { firstName, lastName, nationality, dateOfBirth, driverNumber, teamId } = req.body;
    if (!firstName || !lastName || !nationality || !dateOfBirth || !driverNumber || !teamId) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const team = await AppDataSource.getRepository(Team).findOneBy({ id: teamId });
    if (!team) return res.status(400).json({ error: "Team not found" });

    const driver = new Driver();
    driver.firstName = firstName;
    driver.lastName = lastName;
    driver.nationality = nationality;
    driver.dateOfBirth = new Date(dateOfBirth);
    driver.driverNumber = driverNumber;
    driver.team = team;

    await AppDataSource.getRepository(Driver).save(driver);
    res.status(201).json(driver);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add a DELETE endpoint for drivers
app.delete("/drivers/:id", async (req, res) => {
  try {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    const id = Number(req.params.id);
    const result = await AppDataSource.getRepository(Driver).delete(id);
    if (result.affected === 0) {
      return res.status(404).json({ error: "Driver not found" });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add a PUT endpoint for updating a driver
app.put("/drivers/:id", async (req, res) => {
  try {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    const id = Number(req.params.id);
    const { firstName, lastName, nationality, dateOfBirth, driverNumber, teamId } = req.body;
    if (!firstName || !lastName || !nationality || !dateOfBirth || !driverNumber || !teamId) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const driverRepo = AppDataSource.getRepository(Driver);
    const driver = await driverRepo.findOneBy({ id });
    if (!driver) return res.status(404).json({ error: "Driver not found" });
    const team = await AppDataSource.getRepository(Team).findOneBy({ id: teamId });
    if (!team) return res.status(400).json({ error: "Team not found" });
    driver.firstName = firstName;
    driver.lastName = lastName;
    driver.nationality = nationality;
    driver.dateOfBirth = new Date(dateOfBirth);
    driver.driverNumber = driverNumber;
    driver.team = team;
    await driverRepo.save(driver);
    res.json(driver);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
}); 