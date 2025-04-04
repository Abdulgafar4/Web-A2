/********************************************************************************
 * WEB322 -- Assignment 06
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 *
 * Name: Abdulgafar Tajudeen Student ID: 145039228 Date: 2025-04-02
 *
 * Published URL: _________________________________________________________
 *
 ********************************************************************************/

const express = require("express");
const projectData = require("./modules/projects.js");
const authData = require("./modules/auth-service.js");
const clientSessions = require("client-sessions");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 8080;

// Track database initialization
let dbInitialized = false;
let initializationPromise = null;

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({extended: true})); // Added middleware for form data

// Set up client-sessions
app.use(clientSessions({
  cookieName: "session",
  secret: "web322_assignment6_secret",
  duration: 30 * 60 * 1000, // 30 minutes
  activeDuration: 10 * 60 * 1000 // 10 minutes
}));

// Make session data available to templates
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Middleware to ensure DB is initialized for every request
app.use(async (req, res, next) => {
  try {
    if (!dbInitialized) {
      if (!initializationPromise) {
        // Start initialization if it hasn't been started yet
        initializationPromise = projectData.initialize()
          .then(() => authData.initialize())
          .then(() => {
            dbInitialized = true;
            console.log("Database initialized successfully");
          });
      }
      // Wait for initialization to complete
      await initializationPromise;
    }
    next();
  } catch (err) {
    console.error("Failed to initialize database:", err);
    res.status(500).send("Server initialization error. Please try again later.");
  }
});

// Helper middleware function to check if user is logged in
function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    next();
  }
}

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get("/", (req, res) => {
  res.render("home", {
    studentName: "Abdulgafar Tajudeen",
    studentId: "145039228",
    timestamp: new Date(),
    page: "/"
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    studentName: "Abdulgafar Tajudeen",
    studentId: "145039228",
    timestamp: new Date(),
    page: "/about"
  });
});

// Authentication Routes
app.get("/login", (req, res) => {
  res.render("login", {
    errorMessage: "",
    userName: "",
    page: "/login",
    studentName: "Abdulgafar Tajudeen",
    studentId: "145039228",
    timestamp: new Date()
  });
});

app.get("/register", (req, res) => {
  res.render("register", {
    errorMessage: "",
    successMessage: "",
    userName: "",
    page: "/register",
    studentName: "Abdulgafar Tajudeen",
    studentId: "145039228",
    timestamp: new Date()
  });
});

app.post("/register", (req, res) => {
  authData.registerUser(req.body)
    .then(() => {
      res.render("register", {
        errorMessage: "",
        successMessage: "User created",
        userName: "",
        page: "/register",
        studentName: "Abdulgafar Tajudeen",
        studentId: "145039228",
        timestamp: new Date()
      });
    })
    .catch((err) => {
      res.render("register", {
        errorMessage: err,
        successMessage: "",
        userName: req.body.userName,
        page: "/register",
        studentName: "Abdulgafar Tajudeen",
        studentId: "145039228",
        timestamp: new Date()
      });
    });
});

app.post("/login", (req, res) => {
  req.body.userAgent = req.get('User-Agent');
  
  authData.checkUser(req.body)
    .then((user) => {
      req.session.user = {
        userName: user.userName,
        email: user.email,
        loginHistory: user.loginHistory
      };
      res.redirect('/solutions/projects');
    })
    .catch((err) => {
      res.render("login", {
        errorMessage: err,
        userName: req.body.userName,
        page: "/login",
        studentName: "Abdulgafar Tajudeen",
        studentId: "145039228",
        timestamp: new Date()
      });
    });
});

app.get("/logout", (req, res) => {
  req.session.reset();
  res.redirect('/');
});

app.get("/userHistory", ensureLogin, (req, res) => {
  res.render("userHistory", {
    page: "/userHistory",
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
            projects,
            page: "/solutions/projects"
        });
    } catch (err) {
        res.status(404).render("404", {
            message: err,
            studentName: "Abdulgafar Tajudeen",
            studentId: "145039228",
            timestamp: new Date(),
            page: ""
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
            project,
            page: ""
        });
    } catch (err) {
        res.status(404).render("404", {
            message: err,
            studentName: "Abdulgafar Tajudeen",
            studentId: "145039228",
            timestamp: new Date(),
            page: ""
        });
    }
});

// Add project - GET route
app.get("/solutions/addProject", ensureLogin, async (req, res) => {
    try {
        const sectorData = await projectData.getAllSectors();
        res.render("addProject", {
            studentName: "Abdulgafar Tajudeen",
            studentId: "145039228",
            timestamp: new Date(),
            sectors: sectorData,
            page: "/solutions/addProject"
        });
    } catch (err) {
        res.render("500", {
            message: `I'm sorry, but we have encountered the following error: ${err}`,
            studentName: "Abdulgafar Tajudeen",
            studentId: "145039228",
            timestamp: new Date(),
            page: ""
        });
    }
});

// Add project - POST route
app.post("/solutions/addProject", ensureLogin, async (req, res) => {
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
            timestamp: new Date(),
            page: ""
        });
    }
});

// Edit project - GET route
app.get("/solutions/editProject/:id", ensureLogin, async (req, res) => {
    try {
        const projectDataItem = await projectData.getProjectById(parseInt(req.params.id));
        const sectorData = await projectData.getAllSectors();
        
        res.render("editProject", {
            studentName: "Abdulgafar Tajudeen",
            studentId: "145039228",
            timestamp: new Date(),
            sectors: sectorData,
            project: projectDataItem,
            page: ""
        });
    } catch (err) {
        res.status(404).render("404", {
            message: err,
            studentName: "Abdulgafar Tajudeen",
            studentId: "145039228",
            timestamp: new Date(),
            page: ""
        });
    }
});

// Edit project - POST route
app.post("/solutions/editProject", ensureLogin, async (req, res) => {
    try {
        await projectData.editProject(req.body.id, req.body);
        res.redirect("/solutions/projects");
    } catch (err) {
        res.render("500", {
            message: `I'm sorry, but we have encountered the following error: ${err}`,
            studentName: "Abdulgafar Tajudeen",
            studentId: "145039228",
            timestamp: new Date(),
            page: ""
        });
    }
});

// Delete project - GET route
app.get("/solutions/deleteProject/:id", ensureLogin, async (req, res) => {
    try {
        await projectData.deleteProject(req.params.id);
        res.redirect("/solutions/projects");
    } catch (err) {
        res.render("500", {
            message: `I'm sorry, but we have encountered the following error: ${err}`,
            studentName: "Abdulgafar Tajudeen",
            studentId: "145039228",
            timestamp: new Date(),
            page: ""
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
    timestamp: new Date(),
    page: ""
  });
});

// Start server for local development
if (process.env.NODE_ENV !== 'production') {
  const server = app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
  });
}

// Export the Express app for Vercel
module.exports = app;