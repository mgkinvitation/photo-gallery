// === GALERI & POPUP FOTO ===
const thumbnails = document.querySelectorAll(".thumbnail");
const popup = document.getElementById("popup");
const popupImg = document.getElementById("popup-img");
const captionText = document.getElementById("caption");
const closeBtn = document.querySelector(".close");
const prevBtn = document.querySelector(".nav.prev");
const nextBtn = document.querySelector(".nav.next");

let currentIndex = 0;
let slideshowInterval = null;
let selectedPhoto = null; // simpan foto yang dipilih user

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

// Klik thumbnail → tampilkan popup foto
thumbnails.forEach((img, index) => {
  img.addEventListener("click", () => {
    currentIndex = index;
    popup.style.display = "block";
    showImage(currentIndex);
  });
});

// === FAVORITES POPUP ===
const favPopup = document.getElementById("fav-popup");
const favPopupClose = document.querySelector(".fav-popup-close");
const favSignin = document.getElementById("fav-signin");
const favEmailInput = document.getElementById("fav-email");

// Tombol favorites di setiap thumbnail
document.querySelectorAll(".thumb-btn.fav").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const img = btn.closest(".thumb-wrapper").querySelector(".thumbnail");

    // ✅ Gunakan URL absolut agar bisa dibuka di email (misalnya di GitHub Pages)
    selectedPhoto = {
      name: img.alt,
      url: new URL(img.dataset.full, document.baseURI).href
    };

    favPopup.style.display = "flex";
  });
});

// Tombol favorites di toolbar (tanpa foto)
document.getElementById("btn-fav").addEventListener("click", () => {
  selectedPhoto = null;
  favPopup.style.display = "flex";
});

// Tutup popup hanya dengan tombol X
favPopupClose.addEventListener("click", () => {
  favPopup.style.display = "none";
});

// Tombol SIGN IN → Kirim email via EmailJS
favSignin.addEventListener("click", () => {
  const email = favEmailInput.value.trim();
  if (!email) {
    alert("Masukkan email terlebih dahulu.");
    return;
  }

  console.log('sending email to:', email);
console.log('photo_name:', selectedPhoto ? selectedPhoto.name : '(none)');
console.log('photo_url:', selectedPhoto ? selectedPhoto.url : '(none)');

// opsional: buka URL di tab baru untuk cek cepat (hilangkan lagi setelah tes)
// window.open(selectedPhoto.url, '_blank');


  emailjs.send("service_18z3kpe", "template_u78o5vi", {
    user_email: email,
    photo_name: selectedPhoto ? selectedPhoto.name : "(Tidak ada foto dipilih)",
    photo_url: selectedPhoto ? selectedPhoto.url : "",
  })
  .then(() => {
    alert("✅ Email terkirim ke " + email);
    favPopup.style.display = "none";
    favEmailInput.value = "";
  })
  .catch((err) => {
    console.error("❌ Gagal kirim email:", err);
    alert("Gagal mengirim email, Silahkan periksa koneksi internet anda.");
  });
});

// === DOWNLOAD & SHARE BUTTONS DI THUMBNAIL ===
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

// === POPUP FOTO NAVIGASI ===
closeBtn.addEventListener("click", () => closePopup());
prevBtn.addEventListener("click", prevImage);
nextBtn.addEventListener("click", nextImage);

document.addEventListener("keydown", (e) => {
  if (popup.style.display !== "block") return;
  if (e.key === "ArrowLeft") prevImage();
  if (e.key === "ArrowRight") nextImage();
  if (e.key === "Escape") closePopup();
});

// Klik background popup tidak menutup foto
popup.addEventListener("click", (e) => {
  if (e.target === popupImg || e.target.classList.contains("nav")) return;
});

// === TOOLBAR BUTTONS ===
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
