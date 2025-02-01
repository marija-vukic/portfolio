// import { fetchJSON, renderProjects } from './global.js'; // Import the required functions

// (async function() {
//     const projects = await fetchJSON('./lib/projects.json');
//     const latestProjects = projects.slice(0, 3);
//     const projectsContainer = document.querySelector('.projects');
//     renderProjects(latestProjects, projectsContainer, 'h2');
    
// })();

// const githubData = await fetchGitHubData('marija-vukic');
// console.log(githubData);

// import { fetchJSON, renderProjects, fetchGitHubData } from '../global.js'; // Import fetchGitHubData

// (async function() {
//     // Fetch and display latest projects
//     const projects = await fetchJSON('./lib/projects.json');
//     const latestProjects = projects.slice(0, 3);
//     const projectsContainer = document.querySelector('.projects');
//     renderProjects(latestProjects, projectsContainer, 'h2');

//     // Fetch and display GitHub user data
//     const githubData = await fetchGitHubData('marija-vukic'); // Replace 'your-username' with your actual GitHub username
//     if (githubData) {
//         const githubContainer = document.querySelector('.github-stats');
//         githubContainer.innerHTML = `
//             <p>Followers: ${githubData.followers}</p>
//             <p>Following: ${githubData.following}</p>
//             <p>Public Repositories: ${githubData.public_repos}</p>
//             <a href="${githubData.html_url}" target="_blank">View GitHub Profile</a>
//         `;
//     }
// })();


import { fetchJSON, renderProjects, fetchGitHubData } from './global.js'; // Import functions

(async function() {
    // Fetch and render latest projects
    const projects = await fetchJSON('./lib/projects.json');
    const latestProjects = projects.slice(0, 3);
    const projectsContainer = document.querySelector('.projects');
    renderProjects(latestProjects, projectsContainer, 'h2');

    // Fetch GitHub data
    const githubData = await fetchGitHubData('marija-vukic'); // Replace with your GitHub username
    const profileStats = document.querySelector('#profile-stats');

    // Check if profileStats container exists before updating it
    if (profileStats && githubData) {
        profileStats.innerHTML = `
            <dl class="github-stats">
                <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
                <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
                <dt>Followers:</dt><dd>${githubData.followers}</dd>
                <dt>Following:</dt><dd>${githubData.following}</dd>
            </dl>
        `;
    }
})();


