function loadHTML(id, file) {
  fetch(file)
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to load ${file}`);
      return res.text();
    })
    .then((html) => {
      document.getElementById(id).innerHTML = html;
    })
    .catch((err) => console.error(err));
}

loadHTML("include-nav", "sections/nav.html");
loadHTML("include-hero", "sections/hero.html");
loadHTML("include-service", "sections/service.html");
loadHTML("include-about", "sections/about.html");
loadHTML("include-category", "sections/category.html");
