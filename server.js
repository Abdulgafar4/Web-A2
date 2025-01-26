/********************************************************************************
 *  WEB322 – Assignment 02
 *
 *  I declare that this assignment is my own work in accordance with Seneca's
 *  Academic Integrity Policy:
 *
 *  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 *
 *  Name: Abdulgafar Tajudeen
 *  Student ID: 145039228
 *  Date: 2025-01-26
 *
 ********************************************************************************/

const express = require("express");
const projectData = require("./modules/projects");
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Assignment 2: Abdulgafar Tajudeen - 145039228");
});

app.get("/solutions/projects", async (req, res) => {
  try {
    const projects = await projectData.getAllProjects();
    res.json({
      studentName: "Abdulgafar Tajudeen",
      studentId: "145039228",
      timestamp: new Date(),
      projects,
    });
  } catch (err) {
    res.status(500).send("Error retrieving projects");
  }
});

app.get("/solutions/projects/id-demo", async (req, res) => {
  try {
    const project = await projectData.getProjectById(18);
    res.json({
      studentName: "Abdulgafar Tajudeen",
      studentId: "145039228",
      timestamp: new Date(),
      project,
    });
  } catch (err) {
    res.status(404).send(err);
  }
});

app.get("/solutions/projects/sector-demo", async (req, res) => {
  try {
    const projects = await projectData.getProjectsBySector("agriculture");
    res.json({
      studentName: "Abdulgafar Tajudeen",
      studentId: "145039228",
      timestamp: new Date(),
      projects,
    });
  } catch (err) {
    res.status(404).send(err);
  }
});

projectData
  .initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize project data:", err);
  });
