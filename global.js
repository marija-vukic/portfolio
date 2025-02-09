console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

//PART THREE
let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'resume/', title: 'Resume' },
  { url: 'contact/', title: 'Contact' },
  { url: 'https://github.com/marija-vukic/', title: 'Github' },
];

let nav = document.createElement('nav');
document.body.prepend(nav);

const ARE_WE_HOME = document.documentElement.classList.contains('home');

for (let p of pages) {
  let url = p.url;
  let title = p.title;
  url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;
  // nav.insertAdjacentHTML('beforeend', `<a href="${url}">${title}</a>`);

  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;
  a.classList.toggle(
    'current',
    a.host === location.host && a.pathname === location.pathname
  );
  if (a.host != location.host) {
    a.target = "_blank"
  }
  nav.append(a);
}

document.body.insertAdjacentHTML(
  'afterbegin',
  `
  <label class="color-scheme">
    Theme:
    <select id="theme-select">
      <option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>
  `
);

const select = document.querySelector('.color-scheme select');
const savedColorScheme = localStorage.getItem('colorScheme') || 'light dark';
document.documentElement.style.setProperty('color-scheme', savedColorScheme);
select.value = savedColorScheme;

select.addEventListener('input', function (event) {
  const selectedScheme = event.target.value;
  console.log('Color scheme changed to', selectedScheme);
  document.documentElement.style.setProperty('color-scheme', selectedScheme);
  localStorage.setItem('colorScheme', selectedScheme);
});

let form = document.querySelector('form');
form?.addEventListener('submit', function (event) {
  event.preventDefault();

  let data = new FormData(form);
  let url = form.action + '?';
  let params = [];

  for (let [name, value] of data) {
    params.push(`${name}=${encodeURIComponent(value)}`);
  }

  url += params.join('&');
  console.log('Generated URL:', url);
  location.href = url;
});

//lab 4
// //1.2
// export async function fetchJSON(url) {
//   try {
//       const response = await fetch(url);
//       if (!response.ok) {
//           throw new Error(`Failed to fetch projects: ${response.statusText}`);
//       }
//       const data = await response.json();
//       return data;
//   } catch (error) {
//       console.error('Error fetching or parsing JSON data:', error);
//   }
// }

// window.fetchJSON = fetchJSON;

// //1.3

// export function renderProjects(projects, containerElement, headingLevel = 'h2') {
//   if (!containerElement || !(containerElement instanceof HTMLElement)) {
//       console.error('Invalid container element provided.');
//       return;
//   }
//   containerElement.innerHTML = ''; // Clear existing content

//   const validHeadings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
//   if (!validHeadings.includes(headingLevel)) {
//       console.warn(`Invalid heading level "${headingLevel}", defaulting to h2.`);
//       headingLevel = 'h2';
//   }

//   projects.forEach(project => {
//       const div = document.createElement('div');
//       div.classList.add('project-item'); // Add the project-item class

//       const title = project.title || 'Untitled Project';
//       const image = project.image || 'https://via.placeholder.com/150';
//       const description = project.description || 'No description available.';

//       div.innerHTML = `
//           <${headingLevel}>${title}</${headingLevel}>
//           <img src="${image}" alt="${title}">
//           <p>${description}</p>
//       `;

//       containerElement.appendChild(div);
//   });
// }

export async function fetchJSON(url) {
  try {
      // Fetch the JSON file from the given URL
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    // console.log(response)
    const data = await response.json();
    return data;

  } catch (error) {
      console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  if (!containerElement || !(containerElement instanceof HTMLElement)) {
    console.error('Invalid container element provided.');
    return;
  }

  const validHeadings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  if (!validHeadings.includes(headingLevel)) {
      console.warn(`Invalid heading level "${headingLevel}". Defaulting to 'h2'.`);
      headingLevel = 'h2';  
  }

  // containerElement.innerHTML = '';

  // for (let project of projects) {
  //   const article = document.createElement('article');
  //   article.innerHTML = `
  //     <${headingLevel}>${project.title}</${headingLevel}>
  //     <img src="${project.image}" alt="${project.title}">
  //     <p>${project.description}</p>
  //   `;
  //   containerElement.appendChild(article);
  // }

  containerElement.innerHTML = '';

  for (let project of projects) {
    const article = document.createElement('article');
    article.innerHTML = `
      <${headingLevel}>${project.title}</${headingLevel}>
      <img src="${project.image}" alt="${project.title}">
     
      <div class="project-details">
      <p>${project.description}</p>
      <p class="project-year">c. ${project.year}</p>
      </div>
    `;
    containerElement.appendChild(article);
  }
}

//3
export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}

