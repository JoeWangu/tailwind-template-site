document.addEventListener("DOMContentLoaded", () => {
  const btns = document.querySelectorAll(".theme-btn");
  const highlight = document.getElementById("theme-highlight");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  // Error handling: Exit if critical elements are missing
  if (!highlight || !btns.length) {
    console.warn("Theme toggle elements not found.");
    return;
  }

  // Debounce utility
  function debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  // Apply theme and update UI
  function setTheme(mode) {
    const isDark = mode === "dark" || (mode === "system" && prefersDark.matches);
    document.documentElement.classList.toggle("dark", isDark);
    // Store theme or clear for system mode
    if (mode === "system") {
      localStorage.removeItem("theme");
    } else {
      localStorage.setItem("theme", mode);
    }
    updateUI(mode);
  }

  // Update highlight and active button
  function updateUI(mode) {
    // Update highlight position using CSS variable
    highlight.style.setProperty("--highlight-pos", `var(--${mode}-pos)`);
    // Update active button state
    btns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.theme === mode);
    });
  }

  // Handle system theme changes with debounce
  prefersDark.addEventListener("change", debounce(() => {
    // Only apply system theme if no explicit theme is set
    if (!localStorage.getItem("theme")) {
      setTheme("system");
    }
  }, 100));

  // Button click handlers
  btns.forEach((btn) =>
    btn.addEventListener("click", () => setTheme(btn.dataset.theme))
  );

  // Initialize theme
  setTheme(localStorage.getItem("theme") || "system");
});