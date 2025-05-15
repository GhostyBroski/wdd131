const menuBtn = document.getElementById("menuBtn");
const nav = document.querySelector("nav");

menuButton.addEventListener("click", () => {
  nav.classList.toggle("show");
});

document.querySelectorAll('.gallery img').forEach(img => {
    img.addEventListener('click', () => {
      const fullSrc = img.getAttribute('data-full');
      const dialog = document.createElement('dialog');
      dialog.innerHTML = `
        <img src="${fullSrc}" alt="${img.alt}">
        <button class="close-viewer">X</button>
      `;

      document.body.appendChild(dialog);
      dialog.showModal();

      // Close button
      dialog.querySelector('.close-viewer').addEventListener('click', () => {
        dialog.close();
        dialog.remove();
      });

      // Optional: click outside image to close
      dialog.addEventListener('click', e => {
        if (e.target === dialog) {
          dialog.close();
          dialog.remove();
        }
      });
    });
  });