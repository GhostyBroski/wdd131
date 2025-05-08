const menuBtn = document.getElementById("menuBtn");
const nav = document.querySelector("nav");

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("show");
});

function updateImages() {
    const pics = document.querySelectorAll('.pic');
    const width = window.innerWidth;
  
    pics.forEach(pic => {
      if (width >= 900) {
        pic.src = "norris-sm.jpeg";
      } else if (width >= 700) {
        pic.src = "norris-full.jpeg";
      } else {
        pic.src = "norris-sm.jpeg";
      }
    });
}
  
// Initial check
updateImages();
  
// On resize
window.addEventListener("resize", updateImages);