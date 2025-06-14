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

      // Load CSS with matching path
      const cssFile = file.replace(".html", ".css");
      loadCSS(cssFile);

      // Initialize script logic after HTML is inserted
      if (id === "include-hero") initHeroEvents();
    })
    .catch((err) => console.error(err));
}

function loadCSS(href) {
  fetch(href)
    .then((res) => {
      if (res.ok && res.headers.get("Content-Type").includes("text/css")) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
      } else {
        console.warn("CSS not found or wrong type:", href);
      }
    })
    .catch((err) => console.error("Failed to load CSS:", href, err));
}

function initHeroEvents() {
  const contactBtn = document.getElementById("contactCTA");
  const meetBtn = document.getElementById("meetCald");

  if (contactBtn) {
    contactBtn.addEventListener("click", function () {
      const shortLink = "https://bit.ly/yourShortenedLink"; // use your actual link
      window.open(shortLink, "_blank");
    });
  }

  if (meetBtn) {
    meetBtn.addEventListener("click", function () {
      const title = encodeURIComponent("Client Meeting");
      const details = encodeURIComponent("Agenda: Discuss project updates");
      const location = encodeURIComponent("Google Meet");

      const now = new Date();
      const utcOffset = now.getTimezoneOffset();
      const istOffset = 330;
      const diffMinutes = istOffset - utcOffset;
      now.setMinutes(now.getMinutes() + diffMinutes);

      let meetingHour = now.getHours();
      if (meetingHour < 12) meetingHour = 12;
      else if (meetingHour >= 18) meetingHour = 12;
      else meetingHour += 1;

      const start = new Date(now);
      start.setHours(meetingHour, 0, 0, 0);
      const end = new Date(start);
      end.setHours(start.getHours() + 1);

      const startTime = start.toISOString().replace(/-|:|\.\d\d\d/g, "");
      const endTime = end.toISOString().replace(/-|:|\.\d\d\d/g, "");
      const guests = encodeURIComponent("aniketshah2407@gmail.com");

      const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startTime}/${endTime}&add=${guests}&sf=true&output=xml`;

      window.open(calendarUrl, "_blank");
    });
  }
}

// Load components
loadHTML("include-nav", "sections/nav/nav.html");
loadHTML("include-hero", "sections/hero/hero.html");
loadHTML("include-achievement", "sections/achievement/achievement.html");
loadHTML("include-about", "sections/about/about.html");
loadHTML("include-category", "sections/category/category.html");

  
  