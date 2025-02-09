import { fetchJSON, renderProjects } from '../global.js';

(async function() {
    const projects = await fetchJSON('../lib/projects.json');
    const projectsContainer = document.querySelector('.projects');
    const projectsTitle = document.querySelector('.projects-title');
    projectsTitle.textContent = `${projects.length} Projects`;
    renderProjects(projects, projectsContainer, 'h2');
})();

let selectedIndex = -1;

// lab 5
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";
let svg = d3.select("#projects-plot");

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

let data = [
    { value: 1, label: 'apples' },
    { value: 2, label: 'oranges' },
    { value: 3, label: 'mangos' },
    { value: 4, label: 'pears' },
    { value: 5, label: 'limes' },
    { value: 5, label: 'cherries' },
];
let sliceGenerator = d3.pie().value((d) => d.value);

// let total = 0;
// for (let d of data) {
//   total += d;
// }
let arcData = sliceGenerator(data);
// let angle = 0;


// for (let d of data) {
//   let endAngle = angle - (d / total) * 2 * Math.PI;
//   arcData.push({ startAngle: angle, endAngle });
//   angle = endAngle;
// }

let arcs = arcData.map((d) => arcGenerator(d));
let colors = d3.scaleOrdinal(d3.schemeTableau10);
arcs.forEach((arc, idx) => {
    d3.select('svg').append('path').attr('d', arc).attr('fill', colors(idx));
});

let legend = d3.select('.legend');
data.forEach((d, idx) => {
    legend.append('li')
          .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
          .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); 
})

let projects = await fetchJSON('../lib/projects.json');

function renderPieChart(projectsGiven) {
    let newRolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year
    );

    let newData = newRolledData.map(([year, count]) => {
        return { value: count, label: year };
    });

    let sliceGenerator = d3.pie().value((d) => d.value);
    let arcData = sliceGenerator(newData);
    let arcs = arcData.map((d) => arcGenerator(d));
    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    let newSVG = d3.select("#projects-plot");
    newSVG.selectAll("path").remove(); // Clear previous wedges

    // Append paths and add click event for selection
    arcs.forEach((arc, idx) => {
        newSVG
            .append("path")
            .attr("d", arc)
            .attr("fill", colors(idx))
            .attr("data-year", newData[idx].label)
            .style("cursor", "pointer")
            .on("click", function () {
                let selectedYear = newData[idx].label;
                selectedIndex = selectedIndex === idx ? -1 : idx; // Toggle selection

                // Update UI
                newSVG
                    .selectAll("path")
                    .attr("class", (_, i) => (i === selectedIndex ? "selected" : ""));

                d3.select(".legend")
                    .selectAll("li")
                    .attr("class", (_, i) => (i === selectedIndex ? "selected" : ""));

                // Filter projects based on selection
                let filteredProjects = selectedIndex === -1 
                    ? projectsGiven 
                    : projectsGiven.filter(p => p.year === selectedYear);

                renderProjects(filteredProjects, document.querySelector('.projects'), 'h2');
            });
    });

    // Clear legend
    let legend = d3.select(".legend");
    legend.selectAll("*").remove();

    // Create legend items with click event
    newData.forEach((d, idx) => {
        legend
            .append("li")
            .attr("style", `--color:${colors(idx)}`)
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
            .style("cursor", "pointer")
            .on("click", function () {
                let selectedYear = d.label;
                selectedIndex = selectedIndex === idx ? -1 : idx; // Toggle selection

                // Update UI
                newSVG
                    .selectAll("path")
                    .attr("class", (_, i) => (i === selectedIndex ? "selected" : ""));

                d3.select(".legend")
                    .selectAll("li")
                    .attr("class", (_, i) => (i === selectedIndex ? "selected" : ""));

                // Filter projects
                let filteredProjects = selectedIndex === -1 
                    ? projectsGiven 
                    : projectsGiven.filter(p => p.year === selectedYear);

                renderProjects(filteredProjects, document.querySelector('.projects'), 'h2');
            });
    });
}
    
renderPieChart(projects);

let query = '';
let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener("input", (event) => {
    query = event.target.value;
    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join("\n").toLowerCase();
        return values.includes(query.toLowerCase());
    });

    const projectsContainer = document.querySelector(".projects");
    renderProjects(filteredProjects, projectsContainer, "h2");
    
    // Reset selectedIndex when using search
    selectedIndex = -1;
    renderPieChart(filteredProjects);
});
