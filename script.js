const thumbnails = document.querySelectorAll(".thumbnail");
const popup = document.getElementById("popup");
const popupImg = document.getElementById("popup-img");
const captionText = document.getElementById("caption");
const closeBtn = document.querySelector(".close");
const prevBtn = document.querySelector(".nav.prev");
const nextBtn = document.querySelector(".nav.next");

let currentIndex = 0;
let slideshowInterval = null;

function showImage(index) {
  const img = thumbnails[index];
  popupImg.src = img.dataset.full;
  captionText.innerHTML = `Foto ${index + 1} / ${thumbnails.length} - ${img.alt}`;
}

function closePopup() {
  popup.style.display = "none";
  clearInterval(slideshowInterval);
  slideshowInterval = null;
}

function prevImage() {
  if (currentIndex > 0) {
    currentIndex--;
    showImage(currentIndex);
  } else {
    closePopup();
  }
}

function nextImage() {
  if (currentIndex < thumbnails.length - 1) {
    currentIndex++;
    showImage(currentIndex);
  } else {
    closePopup();
  }
}

// Klik thumbnail → tampilkan popup
thumbnails.forEach((img, index) => {
  img.addEventListener("click", function () {
    currentIndex = index;
    popup.style.display = "block";
    showImage(currentIndex);
  });
});

// === FAVORITES POPUP ===
const favPopup = document.getElementById("fav-popup");
const favPopupClose = document.querySelector(".fav-popup-close");
const favSignin = document.getElementById("fav-signin");

// Klik tombol favorites (thumbnail & toolbar)
document.querySelectorAll(".thumb-btn.fav").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    favPopup.style.display = "flex";
  });
});

document.getElementById("btn-fav").addEventListener("click", () => {
  favPopup.style.display = "flex";
});

// Klik tombol close (X)
favPopupClose.addEventListener("click", () => {
  favPopup.style.display = "none";
});

// Jangan tutup popup jika klik area luar
favPopup.addEventListener("click", (e) => {
  if (e.target === favPopup) {
    // abaikan, jangan tutup popup
  }
});

// Klik SIGN IN
favSignin.addEventListener("click", () => {
  const email = document.getElementById("fav-email").value;
  if (!email) {
    alert("Masukkan email terlebih dahulu.");
  } else {
    emailjs.send("service_18z3kpe", "template_u78o5vi", {
      user_email: email,
      message: "Terima kasih! Foto favorit kamu sudah disimpan."
    })
    .then(() => {
      alert("Email berhasil dikirim ke " + email);
      favPopup.style.display = "none";
    })
    .catch((err) => {
      console.error("Email gagal:", err);
      alert("Gagal mengirim email. Coba lagi.");
    });
  }
});

// Tombol download & share di thumbnail
document.querySelectorAll(".thumb-btn.download").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const img = btn.closest(".thumb-wrapper").querySelector(".thumbnail");
    const link = document.createElement("a");
    link.href = img.dataset.full;
    link.download = img.alt.replace(/\s+/g, "_") + ".jpg";
    link.click();
  });
});

document.querySelectorAll(".thumb-btn.share").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const img = btn.closest(".thumb-wrapper").querySelector(".thumbnail");
    if (navigator.share) {
      navigator.share({
        title: img.alt,
        url: img.dataset.full
      }).catch(() => alert("Gagal membagikan."));
    } else {
      navigator.clipboard.writeText(img.dataset.full);
      alert("Link foto disalin ke clipboard!");
    }
  });
});

// Tombol close popup foto
closeBtn.addEventListener("click", () => closePopup());

// Navigasi tombol panah
prevBtn.addEventListener("click", prevImage);
nextBtn.addEventListener("click", nextImage);

// Navigasi keyboard
document.addEventListener("keydown", (e) => {
  if (popup.style.display !== "block") return;
  if (e.key === "ArrowLeft") prevImage();
  if (e.key === "ArrowRight") nextImage();
  if (e.key === "Escape") closePopup();
});

// Nonaktifkan klik background agar popup tidak tertutup
popup.addEventListener("click", (e) => {
  if (e.target === popupImg || e.target.classList.contains("nav")) return;
});

// Toolbar Buttons (Download, Share, Slideshow)
document.getElementById("btn-download").addEventListener("click", () => {
  if (!popupImg.src) return alert("Buka foto dulu.");
  const link = document.createElement("a");
  link.href = popupImg.src;
  link.download = `foto-${currentIndex + 1}.jpg`;
  link.click();
});

document.getElementById("btn-share").addEventListener("click", () => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href);
    alert("Link halaman disalin!");
  } else {
    alert("Browser tidak mendukung clipboard.");
  }
});

document.getElementById("btn-slideshow").addEventListener("click", () => {
  if (slideshowInterval) {
    stopSlideshow();
  } else {
    currentIndex = 0;
    startSlideshow();
  }
});

function startSlideshow() {
  popup.style.display = "block";
  showImage(currentIndex);
  slideshowInterval = setInterval(() => {
    if (currentIndex < thumbnails.length - 1) {
      currentIndex++;
      showImage(currentIndex);
    } else {
      stopSlideshow();
    }
  }, 3000);
}

function stopSlideshow() {
  closePopup();
}
