/********************************************************************************
 *  WEB322 – Assignment 03
 *
 *  I declare that this assignment is my own work in accordance with Seneca's
 *  Academic Integrity Policy:
 *
 *  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 *
 *  Name: Abdulgafar Tajudeen
 *  Student ID: 145039228
 *  Date: 2025-02-16
 *
 ********************************************************************************/

const express = require("express");
const projectData = require("./modules/projects.cjs");
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static('public'));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/home.html");
});

app.get("/about", (req, res) => {
  res.sendFile(__dirname + "/views/about.html");
});

app.get("/solutions/projects", async (req, res) => {
    try {
        let projects;
        if (req.query.sector) {
            projects = await projectData.getProjectsBySector(req.query.sector);
        } else {
            projects = await projectData.getAllProjects();
        }
        res.json({
            studentName: "Abdulgafar Tajudeen",
            studentId: "145039228",
            timestamp: new Date(),
            projects,
        });
    } catch (err) {
        res.status(404).json({
            message: err,
            studentName: "Abdulgafar Tajudeen",
            studentId: "145039228",
            timestamp: new Date()
        });
    }
});

app.get("/solutions/projects/:id", async (req, res) => {
    try {
        const project = await projectData.getProjectById(parseInt(req.params.id));
        res.json({
            studentName: "Abdulgafar Tajudeen",
            studentId: "145039228",
            timestamp: new Date(),
            project,
        });
    } catch (err) {
        res.status(404).json({
            message: err,
            studentName: "Abdulgafar Tajudeen",
            studentId: "145039228",
            timestamp: new Date()
        });
    }
});

app.post("/post-request", (req, res) => {
    res.json({
        studentName: "Abdulgafar Tajudeen",
        studentId: "145039228",
        timestamp: new Date(),
        body: req.body
    });
});

app.use((req, res) => {
  res.status(404).sendFile(__dirname + "/views/404.html");
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