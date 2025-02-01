// import { fetchJSON } from '../global.js';
// import { renderProjects } from '../global.js';

// document.addEventListener("DOMContentLoaded", async () => {
//     const projectContainer = document.getElementById('projects-container'); 
//     const projectTitle = document.querySelector('.projects-title'); // Select the title element

//     if (projectContainer) {
//         try {
//             // Fetch projects from JSON file
//             const projects = await fetchJSON('../lib/projects.json'); 

//             if (projects && projects.length > 0) {
//                 renderProjects(projects, projectContainer, 'h3');

//                 // Update project count in the title
//                 if (projectTitle) {
//                     projectTitle.textContent = `${projects.length} Projects`; 
//                 }
//             }
//         } catch (error) {
//             console.error('Error fetching or rendering projects:', error);
//         }
//     } else {
//         console.error("projects-container not found in the DOM");
//     }
// });
import { fetchJSON, renderProjects } from '../global.js';

(async function() {
    const projects = await fetchJSON('../lib/projects.json');
    const projectsContainer = document.querySelector('.projects');
    const projectsTitle = document.querySelector('.projects-title');
    projectsTitle.textContent = `${projects.length} Projects`;
    renderProjects(projects, projectsContainer, 'h2');
})();