// step 1
let data = [];
let commits = [];
let xScale, yScale;

async function loadData() {
  data = await d3.csv('loc.csv', (row) => ({
    ...row,
    line: +row.line,
    depth: +row.depth,
    length: +row.length,
    date: new Date(row.date + 'T00:00' + row.timezone),
    datetime: new Date(row.datetime),
  }));

  console.log("Loaded Data:", data); 

  processCommits(); 
  console.log("Processed Commits:", commits);

  displayStats();
  createScatterplot();
  console.log(commits.map(d => d.datetime));

}

document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
});

function processCommits() {
    commits = d3
      .groups(data, (d) => d.commit)
      .map(([commit, lines]) => {
        let first = lines[0];
        let { author, date, time, timezone, datetime } = first;
  
        let ret = {
          id: commit,
          url: `https://github.com/marija-vukic/portfolio/commit/${commit}`,
          author,
          date,
          time,
          timezone,
          datetime,
          hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
          totalLines: lines.length,
        };
  
        Object.defineProperty(ret, 'lines', {
          value: lines,
          enumerable: false, 
          configurable: false,
          writable: false
        });
  
        return ret;
      });
  }
  
function displayStats() {
    const dl = d3.select('#stats')
      .append('dl')
      .attr('class', 'stats');
  
    dl.append('dt').text('Commits');
    dl.append('dd').text(commits.length);
  
    const totalFiles = d3.group(data, d => d.file).size || 0;
    dl.append('dt').text('Files');
    dl.append('dd').text(totalFiles);
  
    dl.append('dt').html('Total <abbr title="Lines of Code">LOC</abbr>');
    dl.append('dd').text(data.length);
  
    const maxDepth = d3.max(data, d => d.depth) || 0;
    dl.append('dt').text('Max Depth');
    dl.append('dd').text(maxDepth);
  
    const longestLineLength = d3.max(data, d => d.length) || 0;
    dl.append('dt').text('Longest Line');
    dl.append('dd').text(longestLineLength);
  
    const maxFileLength = d3.max(data, d => d.line) || 0;
    dl.append('dt').text('Max Lines');
    dl.append('dd').text(maxFileLength);
  }

//   step 2
// 2.1
const width = 1000;
const height = 600;
const margin = { top: 10, right: 10, bottom: 30, left: 20 };

const usableArea = {
  top: margin.top,
  right: width - margin.right,
  bottom: height - margin.bottom,
  left: margin.left,
  width: width - margin.left - margin.right,
  height: height - margin.top - margin.bottom,
};

const svg = d3
  .select("#chart")
  .append("svg")
  .attr("viewBox", `0 0 ${width} ${height}`)
  .style("overflow", "visible");

function createScatterplot() {
    console.log("Creating scatterplot with commits:", commits);

    xScale = d3
      .scaleTime()
      .domain(d3.extent(commits, (d) => d.datetime))
      .range([usableArea.left, usableArea.right])
      .nice();

    yScale = d3.scaleLinear().domain([0, 24]).range([usableArea.bottom, usableArea.top]);
    const dots = svg.append("g").attr("class", "dots");

    // step 4
    const sortedCommits = d3.sort(commits, (d) => -d.totalLines);
    const [minLines, maxLines] = d3.extent(commits, (d) => d.totalLines);
    const rScale = d3.scaleSqrt().domain([minLines, maxLines]).range([2, 30]); 


    dots
      .selectAll("circle")
      .data(sortedCommits)
      .join("circle")
      .attr("cx", (d) => (isNaN(xScale(d.datetime)) ? 0 : xScale(d.datetime)))
      .attr("cy", (d) => yScale(d.hourFrac))
      .attr("r", (d) => rScale(d.totalLines))
      .attr("fill", "steelblue")
      .attr("opacity", 0.7)
    //   step 3
      .on("mouseenter", (event, commit) => {
        updateTooltipContent(commit);
        updateTooltipVisibility(true);
        updateTooltipPosition(event);
    })
      .on("mousemove", updateTooltipPosition)
      .on("mouseleave", () => {
        updateTooltipVisibility(false);
    });

    createAxes(xScale, yScale);
    brushSelector();
}

//2.2
function createAxes(xScale, yScale) {
    const uniqueCommitDates = [...new Set(commits.map(d => d3.timeDay(d.datetime)))];

    const xAxis = d3.axisBottom(xScale)
        .tickValues(uniqueCommitDates) 
        .tickFormat(d3.timeFormat("%b %d")); 


    const yAxis = d3.axisLeft(yScale)
        .tickValues(d3.range(0, 25, 2))
        .tickFormat(d => d === 24 ? "24" : d);

    svg.append("g")
        .attr("class", "gridlines")
        .attr("transform", `translate(${usableArea.left}, 0)`)
        .call(d3.axisLeft(yScale)
            .tickSize(-usableArea.width) 
            .tickFormat("")
        );

    svg.append("g")
        .attr("transform", `translate(0, ${usableArea.bottom})`)
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-30)")
        .style("text-anchor", "end");

    svg.append("g")
        .attr("transform", `translate(${usableArea.left}, 0)`)
        .call(yAxis);

    svg.selectAll(".gridlines line")
        .attr("stroke", d => d < 6 || d > 18 ? "#4a90e2" : "#f5a623"); // Blue for night, orange for day
    
}

// step 3
function updateTooltipContent(commit) {
    if (!commit || Object.keys(commit).length === 0) return;
  
    document.getElementById('commit-link').href = commit.url;
    document.getElementById('commit-link').textContent = commit.id;
    document.getElementById('commit-date').textContent = commit.datetime.toLocaleDateString('en', { dateStyle: 'full' });
    document.getElementById('commit-time').textContent = commit.datetime.toLocaleTimeString('en', { timeStyle: 'short' });
    document.getElementById('commit-author').textContent = commit.author;
    document.getElementById('commit-lines').textContent = commit.totalLines;
}
  
function updateTooltipVisibility(isVisible) {
    document.getElementById('commit-tooltip').hidden = !isVisible;
}

function updateTooltipPosition(event) {
    const tooltip = document.getElementById('commit-tooltip');
    tooltip.style.left = `${event.clientX + 15}px`;
    tooltip.style.top = `${event.clientY + 15}px`;
}
  
// step 5
function brushSelector() {
    const svg = document.querySelector('svg');
    d3.select(svg).call(d3.brush());
    d3.select(svg).selectAll('.dots, .overlay ~ *').raise();
    d3.select(svg).call(d3.brush().on('start brush end', brushed));
} 

// 5.4
let brushSelection = null;

function brushed(event) {
  brushSelection = event.selection;
  updateSelection();
  console.log(event);
  updateSelectionCount();
  updateLanguageBreakdown();
}

function isCommitSelected(commit) {
  if (!brushSelection) {
    return false;
  }
  // TODO: return true if commit is within brushSelection
  // and false if not
  const min = { x: brushSelection[0][0], y: brushSelection[0][1] };
  const max = { x: brushSelection[1][0], y: brushSelection[1][1] };

  // Convert commit data into screen coordinates
  const x = xScale(commit.date);
  const y = yScale(commit.hourFrac);

  // Check if commit falls within the brushed area
  return x >= min.x && x <= max.x && y >= min.y && y <= max.y;
}

function updateSelection() {
  // Update visual state of dots based on selection
  d3.selectAll('circle').classed('selected', (d) => isCommitSelected(d));
}

// 5.5
function updateSelectionCount() {
    const selectedCommits = brushSelection
      ? commits.filter(isCommitSelected)
      : [];
  
    const countElement = document.getElementById('selection-count');
    countElement.textContent = `${
      selectedCommits.length || 'No'
    } commits selected`;
  
    return selectedCommits;
  }

// 5.6
function updateLanguageBreakdown() {
    const selectedCommits = brushSelection
      ? commits.filter(isCommitSelected)
      : [];
    const container = document.getElementById('language-breakdown');
  
    if (selectedCommits.length === 0) {
      container.innerHTML = '';
      return;
    }
    const requiredCommits = selectedCommits.length ? selectedCommits : commits;
    const lines = requiredCommits.flatMap((d) => d.lines);
  
    // Use d3.rollup to count lines per language
    const breakdown = d3.rollup(
      lines,
      (v) => v.length,
      (d) => d.type
    );
  
    // Update DOM with breakdown
    container.innerHTML = '';
  
    for (const [language, count] of breakdown) {
      const proportion = count / lines.length;
      const formatted = d3.format('.1~%')(proportion);
  
      container.innerHTML += `
              <dt>${language}</dt>
              <dd>${count} lines (${formatted})</dd>
          `;
    }
  
    return breakdown;
  }