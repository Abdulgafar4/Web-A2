/********************************************************************************
 * WEB322 -- Assignment 05
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
 *
 * Name: Abdulgafar Tajudeen Student ID: 145039228 Date: 2025-03-23
 *
 * Published URL: _________________________________________________________
 *
 ********************************************************************************/

const express = require("express");
const projectData = require("./modules/projects.js");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({extended: true})); // Added middleware for form data

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

// Add project - GET route
app.get("/solutions/addProject", async (req, res) => {
    try {
        const sectorData = await projectData.getAllSectors();
        res.render("addProject", {
            studentName: "Abdulgafar Tajudeen",
            studentId: "145039228",
            timestamp: new Date(),
            sectors: sectorData
        });
    } catch (err) {
        res.render("500", {
            message: `I'm sorry, but we have encountered the following error: ${err}`,
            studentName: "Abdulgafar Tajudeen",
            studentId: "145039228",
            timestamp: new Date()
        });
    }
});

// Add project - POST route
app.post("/solutions/addProject", async (req, res) => {
    try {
         const data = {
          id: 100,
          ...req.body
         }
        await projectData.addProject(data);
        res.redirect("/solutions/projects");
    } catch (err) {
        res.render("500", {
            message: `I'm sorry, but we have encountered the following error: ${err}`,
            studentName: "Abdulgafar Tajudeen",
            studentId: "145039228",
            timestamp: new Date()
        });
    }
});

// Edit project - GET route
app.get("/solutions/editProject/:id", async (req, res) => {
    try {
        const projectDataItem = await projectData.getProjectById(parseInt(req.params.id));
        const sectorData = await projectData.getAllSectors();
        
        res.render("editProject", {
            studentName: "Abdulgafar Tajudeen",
            studentId: "145039228",
            timestamp: new Date(),
            sectors: sectorData,
            project: projectDataItem
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

// Edit project - POST route
app.post("/solutions/editProject", async (req, res) => {
    try {
        await projectData.editProject(req.body.id, req.body);
        res.redirect("/solutions/projects");
    } catch (err) {
        res.render("500", {
            message: `I'm sorry, but we have encountered the following error: ${err}`,
            studentName: "Abdulgafar Tajudeen",
            studentId: "145039228",
            timestamp: new Date()
        });
    }
});

// Delete project - GET route
app.get("/solutions/deleteProject/:id", async (req, res) => {
    try {
        await projectData.deleteProject(req.params.id);
        res.redirect("/solutions/projects");
    } catch (err) {
        res.render("500", {
            message: `I'm sorry, but we have encountered the following error: ${err}`,
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