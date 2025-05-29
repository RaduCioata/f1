import express from "express";
import cors from "cors";
import prisma from "../lib/prisma";

const app = express();
const PORT = process.env.PORT || 4000;

// Configure CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Get all teams (for dropdown)
app.get("/teams", async (req, res) => {
  try {
    const teams = await prisma.team.findMany();
    res.json(teams);
  } catch (err) {
    console.error("Error in /teams endpoint:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all drivers (with team info)
app.get("/drivers", async (req, res) => {
  try {
    const drivers = await prisma.driver.findMany({
      include: {
        team: true
      }
    });
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get a single driver
app.get("/drivers/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const driver = await prisma.driver.findUnique({
      where: { id },
      include: { team: true }
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
    const { firstName, lastName, nationality, dateOfBirth, driverNumber, teamId } = req.body;
    if (!firstName || !lastName || !nationality || !dateOfBirth || !driverNumber || !teamId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) return res.status(400).json({ error: "Team not found" });

    const driver = await prisma.driver.create({
      data: {
        firstName,
        lastName,
        nationality,
        dateOfBirth: new Date(dateOfBirth),
        driverNumber,
        teamId
      },
      include: {
        team: true
      }
    });

    res.status(201).json(driver);
  } catch (err) {
    console.error("Error creating driver:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a driver
app.delete("/drivers/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.driver.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (err) {
    if ((err as any).code === 'P2025') {
      return res.status(404).json({ error: "Driver not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a driver
app.put("/drivers/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { firstName, lastName, nationality, dateOfBirth, driverNumber, teamId } = req.body;
    if (!firstName || !lastName || !nationality || !dateOfBirth || !driverNumber || !teamId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) return res.status(400).json({ error: "Team not found" });

    const driver = await prisma.driver.update({
      where: { id },
      data: {
        firstName,
        lastName,
        nationality,
        dateOfBirth: new Date(dateOfBirth),
        driverNumber,
        teamId
      },
      include: {
        team: true
      }
    });

    res.json(driver);
  } catch (err) {
    if ((err as any).code === 'P2025') {
      return res.status(404).json({ error: "Driver not found" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
}); 