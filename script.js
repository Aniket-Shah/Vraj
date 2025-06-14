function toggleMenu() {
    const navLinks = document.getElementById('nav-links');
    const hamburger = document.getElementById('hamburger');
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
}
function loadHTML(id, file) {
    fetch(file)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${file}`);
        return res.text();
      })
      .then((html) => {
        document.getElementById(id).innerHTML = html;
        // Automatically load CSS with the same base path
        const cssFile = file.replace(".html", ".css");
        loadCSS(cssFile);
      })
      .catch((err) => console.error(err));
  }
  
  function loadCSS(href) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }
  
  // Load components and their CSS
  loadHTML("include-nav", "sections/nav/nav.html");
  loadHTML("include-hero", "sections/hero/hero.html");
  loadHTML("include-achievement", "sections/achievement/achievement.html");
  loadHTML("include-about", "sections/about/about.html");
  loadHTML("include-category", "sections/category/category.html");
  