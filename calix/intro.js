(() => {
  "use strict";

  const intro = document.getElementById("calix-intro");
  if (!intro) return;

  const sessionKey = "calix-intro-pen";
  let seen = false;
  try {
    seen = sessionStorage.getItem(sessionKey) === "seen";
  } catch {}
  if (seen) {
    intro.remove();
    return;
  }

  if (intro.open) intro.close();
  intro.showModal();
  const heading = intro.querySelector("h1");
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
  document.documentElement.style.overflow = "hidden";

  let leaving = false;
  function enter() {
    if (leaving) return;
    leaving = true;
    try {
      sessionStorage.setItem(sessionKey, "seen");
    } catch {}
    intro.classList.add("leaving");
    function finish() {
      intro.close();
      intro.remove();
      document.documentElement.style.overflow = "";
      const title = document.querySelector("main h1");
      title?.setAttribute("tabindex", "-1");
      title?.focus({ preventScroll: true });
    }
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) finish();
    else setTimeout(finish, 500);
  }
  intro.querySelectorAll("[data-enter]").forEach(button => button.addEventListener("click", enter));
  intro.addEventListener("cancel", event => {
    event.preventDefault();
    enter();
  });
})();
