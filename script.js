// --- GALLERY & POPUP ---
const thumbnails = document.querySelectorAll(".thumbnail-wrapper img");
const popup = document.getElementById("popup");
const popupImg = document.getElementById("popup-img");
const prevBtn = document.querySelector(".nav.prev");
const nextBtn = document.querySelector(".nav.next");
const closeBtn = document.getElementById("popup-close");
const progressFill = document.querySelector(".progress-fill");

let currentIndex = 0;
let slideInterval;

// Scroll ke toolbar saat panah diklik
document.querySelector(".scroll-icon").addEventListener("click", () => {
  document.getElementById("toolbar").scrollIntoView({ 
    behavior: "smooth" 
  });
});


function openPopup(index) {
  currentIndex = index;
  popup.style.display = "flex";
  popupImg.src = thumbnails[index].dataset.full;
}

function closePopup() {
  popup.style.display = "none";
  stopSlideshow();
}

function showNextImage() {
  currentIndex = (currentIndex + 1) % thumbnails.length;
  popupImg.src = thumbnails[currentIndex].dataset.full;
}

function showPrevImage() {
  currentIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
  popupImg.src = thumbnails[currentIndex].dataset.full;
}

// Thumbnail click
thumbnails.forEach((img, i) => {
  img.addEventListener("click", () => openPopup(i));
});

nextBtn.addEventListener("click", showNextImage);
prevBtn.addEventListener("click", showPrevImage);
closeBtn.addEventListener("click", closePopup);

// --- SLIDESHOW ---
const playPauseBtn = document.getElementById("popup-playpause");

function startSlideshow() {
  stopSlideshow();
  slideInterval = setInterval(() => {
    showNextImage();
    progressFill.style.width = "0%";
    setTimeout(() => { progressFill.style.width = "100%"; }, 50);
  }, 4000);
  progressFill.style.transition = "width 4s linear";
  progressFill.style.width = "100%";
  playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
}

function stopSlideshow() {
  clearInterval(slideInterval);
  progressFill.style.width = "0%";
  playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
}

playPauseBtn.addEventListener("click", () => {
  if (slideInterval) stopSlideshow(); else startSlideshow();
});

// --- FAVORITES ---
const favBtn = document.getElementById("btn-fav");
const favPopup = document.getElementById("favorites-popup");
const favPopupClose = document.getElementById("favorites-close");
const favSubmit = document.getElementById("favorites-submit");
const favEmailInput = document.getElementById("favorites-email");

favBtn.addEventListener("click", () => favPopup.style.display = "flex");
favPopupClose.addEventListener("click", () => favPopup.style.display = "none");

// toggle favorite di thumbnail
const thumbs = document.querySelectorAll(".thumbnail-wrapper");
thumbs.forEach(thumb => {
  thumb.addEventListener("click", e => {
    if (e.target.classList.contains("favorite-icon")) {
      thumb.classList.toggle("favorited");
    }
  });
});

// EmailJS submit
favSubmit.addEventListener("click", () => {
  const email = favEmailInput.value.trim();
  if (!email) {
    alert("Masukkan email terlebih dahulu.");
    return;
  }

  emailjs.send("service_18z3kpe", "template_u78o5vi", {
    user_email: email,
    message: "User ingin simpan daftar foto favorit."
  }, "kYYvwVNbBupJ8pAXd")
  .then(() => {
    alert("✅ Email terkirim ke " + email);
    favPopup.style.display = "none";
    favEmailInput.value = "";
  })
  .catch((err) => {
    console.error("❌ Gagal kirim email:", err);
    alert("Gagal mengirim email, coba lagi.");
  });
});

// Scroll ke toolbar saat panah diklik
document.querySelector(".scroll-icon").addEventListener("click", () => {
  document.getElementById("toolbar").scrollIntoView({
    behavior: "smooth"
  });
});
