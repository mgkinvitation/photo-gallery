// --- GALLERY & POPUP ---
const thumbnails = document.querySelectorAll(".thumbnail-wrapper img");
const popup = document.getElementById("popup");
const popupImg = document.getElementById("popup-img");
const prevBtn = document.querySelector(".nav.prev");
const nextBtn = document.querySelector(".nav.next");
const closeBtn = document.getElementById("popup-close");
const progressFill = document.querySelector(".progress-fill");

let currentIndex = 0;
let slideInterval = null;
let isPlaying = false;
let favorites = []; // <- simpan file favorit

// Scroll ke toolbar saat panah diklik
document.querySelector(".scroll-icon").addEventListener("click", () => {
  document.getElementById("toolbar").scrollIntoView({ behavior: "smooth" });
});

function openPopup(index) {
  currentIndex = index;
  popup.style.display = "flex";
  popupImg.src = thumbnails[index].dataset.full;

  // progress bar hanya aktif kalau slideshow sedang jalan
  if (isPlaying) {
    setTimeout(() => resetProgressBar(), 200);
  }
}

function closePopup() {
  popup.style.display = "none";
  stopSlideshow();
}

function showNextImage() {
  currentIndex = (currentIndex + 1) % thumbnails.length;
  popupImg.src = thumbnails[currentIndex].dataset.full;

  if (isPlaying) {
    setTimeout(() => resetProgressBar(), 200);
  }
}

function showPrevImage() {
  currentIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
  popupImg.src = thumbnails[currentIndex].dataset.full;

  if (isPlaying) {
    setTimeout(() => resetProgressBar(), 200);
  }
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
const closeSlideshowBtn = document.getElementById("popup-close"); // tombol X close

function resetProgressBar() {
  progressFill.style.transition = "none";
  progressFill.style.width = "0%";

  setTimeout(() => {
    progressFill.style.transition = "width 4s linear";
    progressFill.style.width = "100%";
  }, 50);
}

function startSlideshow() {
  stopSlideshow(); // biar gak dobel interval
  isPlaying = true;

  resetProgressBar();

  slideInterval = setInterval(() => {
    showNextImage();
  }, 4000);

  playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
}

function stopSlideshow() {
  isPlaying = false;
  clearInterval(slideInterval);
  progressFill.style.width = "0%";
  playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
}

// --- SLIDESHOW TOOLBAR ---
const toolbarSlideshowBtn = document.getElementById("btn-slideshow");

if (toolbarSlideshowBtn) {
  toolbarSlideshowBtn.addEventListener("click", () => {
    // buka popup mulai dari foto pertama
    openPopup(0);
    // langsung start slideshow
    startSlideshow();
  });
}

// tombol play/pause di popup toolbar
if (playPauseBtn) {
  playPauseBtn.addEventListener("click", () => {
    if (isPlaying) stopSlideshow();
    else startSlideshow();
  });
}

// tombol X close di popup toolbar
if (closeSlideshowBtn) {
  closeSlideshowBtn.addEventListener("click", () => {
    stopSlideshow();
    popup.style.display = "none";
  });
}

// --- KEYBOARD CONTROL ---
document.addEventListener("keydown", (e) => {
  if (popup.style.display === "flex") {
    if (e.code === "Space") {
      e.preventDefault();
      if (isPlaying) stopSlideshow();
      else startSlideshow();
    }
    if (e.code === "ArrowRight") showNextImage();
    if (e.code === "ArrowLeft") showPrevImage();
    if (e.code === "Escape") closePopup();
  }
});

// --- FAVORITES POPUP ---
const favBtn = document.getElementById("btn-fav");
const favPopup = document.getElementById("favorites-popup");
const favPopupClose = document.getElementById("favorites-close");
const favSubmit = document.getElementById("favorites-submit");
const favEmailInput = document.getElementById("favorites-email");
const popupFavBtn = document.getElementById("popup-fav");

// buka popup dari toolbar & popup favorite
favBtn.addEventListener("click", () => favPopup.style.display = "flex");
popupFavBtn.addEventListener("click", () => {
  const currentImage = thumbnails[currentIndex].dataset.full;
  if (!favorites.includes(currentImage)) favorites.push(currentImage);
  favPopup.style.display = "flex";
});

// tutup popup
favPopupClose.addEventListener("click", () => favPopup.style.display = "none");

// --- KIRIM EMAIL ---
const baseUrl = "https://mgkinvitation.github.io/photo-gallery/";

favSubmit.addEventListener("click", () => {
  const email = favEmailInput.value.trim();
  if (!email) {
    alert("Masukkan email terlebih dahulu.");
    return;
  }
  if (favorites.length === 0) {
    alert("Pilih dulu foto favoritnya.");
    return;
  }

  const photoPath = favorites[0]; 
  const photoName = photoPath.split("/").pop().split(".")[0];
  const photoUrl = baseUrl + photoPath;

  emailjs.send("service_v2rmo45", "template_g3fq6mb", {
    user_email: email,
    photo_name: photoName,
    photo_url: photoUrl
  }, "wfCaR74fpUMQbJZNq")
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

// === SHARE POPUP ===
const shareBtn = document.getElementById("popup-share");   
const toolbarShareBtn = document.getElementById("btn-share"); 
const sharePopup = document.getElementById("sharePopup");
const shareClose = document.getElementById("closeShare");
const copyBtn = document.getElementById("copyBtn");
const shareLinkInput = document.getElementById("shareLink");

// buka share popup (popup toolbar)
if (shareBtn) {
  shareBtn.addEventListener("click", () => {
    sharePopup.style.display = "flex";
  });
}

// buka share popup (toolbar utama)
if (toolbarShareBtn) {
  toolbarShareBtn.addEventListener("click", () => {
    sharePopup.style.display = "flex";
  });
}

// tutup share popup
shareClose.addEventListener("click", () => {
  sharePopup.style.display = "none";
});

// copy link
copyBtn.addEventListener("click", () => {
  shareLinkInput.select();
  navigator.clipboard.writeText(shareLinkInput.value)
    .then(() => alert("Link copied to clipboard!"))
    .catch(() => alert("Failed to copy link"));
});

// === SET SHARE LINK ===
const pageUrl = encodeURIComponent(shareLinkInput.value);
const pageTitle = encodeURIComponent("Check out this gallery!");

// WhatsApp
document.getElementById("shareWhatsapp").href = `https://wa.me/?text=${pageTitle}%20${pageUrl}`;
// Instagram
document.getElementById("shareInstagram").href = `https://www.instagram.com/direct/new/?text=${pageTitle}%20${pageUrl}`;
// Email
document.getElementById("shareEmail").href = `mailto:?subject=${pageTitle}&body=${pageUrl}`;

// --- DOWNLOAD ---
const downloadBtn = document.getElementById("btn-download");     
const popupDownloadBtn = document.getElementById("popup-download"); 

// Download semua foto (toolbar utama)
if (downloadBtn) {
  downloadBtn.addEventListener("click", async () => {
    const zip = new JSZip();
    const folder = zip.folder("gallery");

    for (let i = 0; i < thumbnails.length; i++) {
      const imgUrl = thumbnails[i].dataset.full;
      const fileName = imgUrl.split("/").pop();

      try {
        const response = await fetch(imgUrl);
        const blob = await response.blob();
        folder.file(fileName, blob);
      } catch (err) {
        console.error("Gagal download:", imgUrl, err);
      }
    }

    zip.generateAsync({ type: "blob" }).then((content) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "gallery.zip";
      link.click();
    });
  });
}

// --- DOWNLOAD POPUP ---
const downloadPopup = document.getElementById("download-popup");
const downloadClose = document.getElementById("download-close");
const saveDeviceBtn = document.getElementById("save-device");
const saveGoogleBtn = document.getElementById("save-google");

// buka popup download (tidak langsung download)
if (popupDownloadBtn) {
  popupDownloadBtn.addEventListener("click", () => {
    downloadPopup.style.display = "flex";
  });
}

// tutup popup download
if (downloadClose) {
  downloadClose.addEventListener("click", () => {
    downloadPopup.style.display = "none";
  });
}

// Save to My Device
if (saveDeviceBtn) {
  saveDeviceBtn.addEventListener("click", () => {
    const currentImage = thumbnails[currentIndex].dataset.full;
    const link = document.createElement("a");
    link.href = currentImage;
    link.download = currentImage.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    downloadPopup.style.display = "none"; 
  });
}

// Save to Google Photos
if (saveGoogleBtn) {
  saveGoogleBtn.addEventListener("click", () => {
    const currentImage = thumbnails[currentIndex].dataset.full;
    const photoUrl = window.location.origin + "/" + currentImage;
    const googlePhotosUrl = `https://photos.google.com/?pli=1&url=${encodeURIComponent(photoUrl)}`;
    window.open(googlePhotosUrl, "_blank");

    downloadPopup.style.display = "none"; 
  });
}

// --- Pagination ---
const galleryContainer = document.getElementById("gallery");
const paginationContainer = document.getElementById("pagination");

const allPhotos = Array.from(document.querySelectorAll(".thumbnail-wrapper"));
const itemsPerPage = 15; // ✅ batas per halaman
let currentPage = 1;

function renderGallery(page) {
  galleryContainer.innerHTML = "";

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedItems = allPhotos.slice(start, end);

  paginatedItems.forEach(item => galleryContainer.appendChild(item));

  // update thumbnails sesuai halaman
  thumbnailsPage = galleryContainer.querySelectorAll("img");

  thumbnailsPage.forEach((img, i) => {
    img.addEventListener("click", () => openPopup(start + i));
  });
}

function renderPagination() {
  paginationContainer.innerHTML = "";
  const totalPages = Math.ceil(allPhotos.length / itemsPerPage);

  // Tombol Prev
  if (currentPage > 1) {
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Prev";
    prevBtn.addEventListener("click", () => {
      currentPage--;
      renderGallery(currentPage);
      renderPagination();
    });
    paginationContainer.appendChild(prevBtn);
  }

  // Tombol angka halaman
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("active");
    btn.addEventListener("click", () => {
      currentPage = i;
      renderGallery(currentPage);
      renderPagination();
    });
    paginationContainer.appendChild(btn);
  }

  // Tombol Next
  if (currentPage < totalPages) {
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    nextBtn.addEventListener("click", () => {
      currentPage++;
      renderGallery(currentPage);
      renderPagination();
    });
    paginationContainer.appendChild(nextBtn);
  }
}

// --- Init Pagination ---
if (galleryContainer && paginationContainer) {
  renderGallery(currentPage);
  renderPagination();
}
