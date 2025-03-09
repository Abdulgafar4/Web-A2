const projectsModule = require('./projects');

// Name and student ID for the test output
const studentName = "Abdulgafar Tajudeen";
const studentID = "145039228";

console.log(`test projects ${studentName} - ${studentID}`);


jest.mock('../data/projectData.json', () => [
  { id: 1, title: "Project 1", sector_id: 1 },
  { id: 2, title: "Project 2", sector_id: 2 },
  { id: 3, title: "Project 3", sector_id: 3 }
], { virtual: true });

jest.mock('../data/sectorData.json', () => [
  { id: 1, sector_name: "Industry" },
  { id: 2, sector_name: "Transportation" },
  { id: 3, sector_name: "Electricity" }
], { virtual: true });

describe('Projects Module', () => {
  beforeAll(async () => {
    await projectsModule.initialize();
  });

  test('getAllProjects returns all projects', async () => {
    const projects = await projectsModule.getAllProjects();
    expect(projects).toHaveLength(3);
    expect(projects[0]).toHaveProperty('title');
    expect(projects[0]).toHaveProperty('sector');
  });

  test('getProjectById returns the correct project', async () => {
    const project = await projectsModule.getProjectById(2);
    expect(project).toHaveProperty('id', 2);
    expect(project).toHaveProperty('title', 'Project 2');
    expect(project).toHaveProperty('sector', 'Transportation');
  });

  test('getProjectById rejects with error for non-existent project', async () => {
    await expect(projectsModule.getProjectById(99)).rejects.toEqual('Project not found');
  });

  test('getProjectsBySector returns projects with matching sector', async () => {
    const projects = await projectsModule.getProjectsBySector('Transportation');
    expect(projects).toHaveLength(1);
    expect(projects[0]).toHaveProperty('sector', 'Transportation');
  });

  test('getProjectsBySector rejects with error for non-existent sector', async () => {
    await expect(projectsModule.getProjectsBySector('InvalidSector')).rejects.toMatch(/No projects found for the sector:/);
  });
});
