const preview = document.querySelector("#theme-preview");
const swatches = [...document.querySelectorAll(".theme-picker button")];
let selection = 0;

for (const swatch of swatches) {
  swatch.addEventListener("click", async () => {
    const request = ++selection;
    const image = new Image();
    const theme = swatch.dataset.theme;
    image.src = theme === "dark" ? "../assets/aurora-home.webp" : `../assets/home-${theme}-173.webp`;
    try {
      await image.decode();
    } catch {
      return;
    }
    if (request !== selection) return;
    preview.src = image.src;
    preview.alt = `Calix ${swatch.getAttribute("aria-label")} 테마`;
    for (const button of swatches) button.setAttribute("aria-pressed", String(button === swatch));
  });
}
