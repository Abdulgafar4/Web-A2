require('dotenv').config();
require('pg');
const Sequelize = require('sequelize');

// Create the sequelize connection
let sequelize = new Sequelize(
  process.env.PGDATABASE, 
  process.env.PGUSER, 
  process.env.PGPASSWORD, 
  {
    host: process.env.PGHOST,
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false }
    }
  }
);

// Define the Sector model
const Sector = sequelize.define('Sector', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sector_name: Sequelize.STRING
}, {
  timestamps: false
});

// Define the Project model
const Project = sequelize.define('Project', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: Sequelize.STRING,
  feature_img_url: Sequelize.STRING,
  summary_short: Sequelize.TEXT,
  intro_short: Sequelize.TEXT,
  impact: Sequelize.TEXT,
  original_source_url: Sequelize.STRING,
}, {
  timestamps: false
});

// Establish relationship between Project and Sector
Project.belongsTo(Sector, { foreignKey: 'sector_id'});

// Initialize function to sync with database
function initialize() {
  return new Promise((resolve, reject) => {
    sequelize.sync()
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// Get all projects
function getAllProjects() {
  return new Promise((resolve, reject) => {
    Project.findAll({ include: [Sector] })
      .then((projects) => {
        resolve(projects);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// Get project by ID
function getProjectById(projectId) {
  return new Promise((resolve, reject) => {
    Project.findAll({ 
      include: [Sector],
      where: {
        id: projectId 
      }
    })
      .then((projects) => {
        if (projects.length > 0) {
          resolve(projects[0]);
        } else {
          reject("Unable to find requested project");
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// Get projects by sector
function getProjectsBySector(sector) {
  return new Promise((resolve, reject) => {
    Project.findAll({
      include: [Sector],
      where: {
        '$Sector.sector_name$': {
          [Sequelize.Op.iLike]: `%${sector}%`
        }
      }
    })
      .then((projects) => {
        if (projects.length > 0) {
          resolve(projects);
        } else {
          reject(`Unable to find requested projects for sector: ${sector}`);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// Get all sectors
function getAllSectors() {
  return new Promise((resolve, reject) => {
    Sector.findAll()
      .then((sectors) => {
        resolve(sectors);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// Add a new project
function addProject(projectData) {
  return new Promise((resolve, reject) => {
    Project.create(projectData)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err.errors && err.errors[0] ? err.errors[0].message : err.message);
      });
  });
}

// Edit an existing project
function editProject(id, projectData) {
  return new Promise((resolve, reject) => {
    Project.update(projectData, {
      where: { id: id }
    })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err.errors && err.errors[0] ? err.errors[0].message : err.message);
      });
  });
}

// Delete a project
function deleteProject(id) {
  return new Promise((resolve, reject) => {
    Project.destroy({
      where: { id: id }
    })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err.errors && err.errors[0] ? err.errors[0].message : err.message);
      });
  });
}

module.exports = {
  initialize,
  getAllProjects,
  getProjectById,
  getProjectsBySector,
  getAllSectors,
  addProject,
  editProject,
  deleteProject
};