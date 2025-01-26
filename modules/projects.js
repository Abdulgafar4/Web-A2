const projectData = require("../data/projectData.json");
const sectorData = require("../data/sectorData.json");

let projects = [];

function initialize() {
  return new Promise((resolve, reject) => {
    try {
      projects = projectData.map((project) => {
        const sector = sectorData.find((s) => s.id === project.sector_id);
        return { ...project, sector: sector ? sector.sector_name : "Unknown" };
      });
      resolve();
    } catch (error) {
      reject("Failed to initialize projects data.");
    }
  });
}

function getAllProjects() {
  return new Promise((resolve) => resolve(projects));
}

function getProjectById(projectId) {
  return new Promise((resolve, reject) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) resolve(project);
    else reject("Project not found");
  });
}

function getProjectsBySector(sector) {
  return new Promise((resolve, reject) => {
    const matchingProjects = projects.filter((p) =>
      p.sector.toLowerCase().includes(sector.toLowerCase())
    );
    if (matchingProjects.length > 0) resolve(matchingProjects);
    else reject("No projects found for the given sector");
  });
}

module.exports = {
  initialize,
  getAllProjects,
  getProjectById,
  getProjectsBySector,
};
