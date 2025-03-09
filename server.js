/********************************************************************************
 *  WEB322 – Assignment 04
 *
 *  I declare that this assignment is my own work in accordance with Seneca's
 *  Academic Integrity Policy:
 *
 *  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 *
 *  Name: Abdulgafar Tajudeen 
 * Student ID: 145039228 
 * Date: 2025-03-09
 *
 *  
 *
 ********************************************************************************/

const express = require("express");
const projectData = require("./modules/projects.js");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static('public'));

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get("/", (req, res) => {
  res.render("home", {
    studentName: "Abdulgafar Tajudeen",
    studentId: "145039228",
    timestamp: new Date()
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    studentName: "Abdulgafar Tajudeen",
    studentId: "145039228",
    timestamp: new Date()
  });
});

app.get("/solutions/projects", async (req, res) => {
    try {
        let projects;
        if (req.query.sector) {
            projects = await projectData.getProjectsBySector(req.query.sector);
        } else {
            projects = await projectData.getAllProjects();
        }
        res.render("projects", {
            studentName: "Abdulgafar Tajudeen",
            studentId: "145039228",
            timestamp: new Date(),
            projects
        });
    } catch (err) {
        res.status(404).render("404", {
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
        res.render("project", {
            studentName: "Abdulgafar Tajudeen",
            studentId: "145039228",
            timestamp: new Date(),
            project
        });
    } catch (err) {
        res.status(404).render("404", {
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
  res.status(404).render("404", {
    message: "I'm sorry, we're unable to find what you're looking for",
    studentName: "Abdulgafar Tajudeen",
    studentId: "145039228",
    timestamp: new Date()
  });
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