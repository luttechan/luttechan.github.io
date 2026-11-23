const preview = document.querySelector("#theme-preview");
const swatches = [...document.querySelectorAll(".theme-picker button")];
let selection = 0;

for (const swatch of swatches) {
  swatch.addEventListener("click", async () => {
    const request = ++selection;
    const image = new Image();
    const file = swatch.dataset.image ?? `home-${swatch.dataset.theme}-173.webp`;
    image.src = `../assets/${file}?v=177`;
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
