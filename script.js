document.addEventListener("DOMContentLoaded", () => {
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

  function openPopup(index) {
    currentIndex = index;
    if (popup) popup.style.display = "flex";
    if (popupImg && thumbnails[index]) {
      popupImg.src = thumbnails[index].dataset.full;
    }
    if (isPlaying) setTimeout(() => resetProgressBar(), 200);
    scrollPopupIntoView();
  }

  function scrollPopupIntoView() {
    if (popup) {
      popup.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function closePopup() {
    if (popup) popup.style.display = "none";
    stopSlideshow();
  }

  function showNextImage() {
    if (thumbnails.length === 0) return;
    currentIndex = (currentIndex + 1) % thumbnails.length;
    if (popupImg) popupImg.src = thumbnails[currentIndex].dataset.full;
    if (isPlaying) setTimeout(() => resetProgressBar(), 200);
  }

  function showPrevImage() {
    if (thumbnails.length === 0) return;
    currentIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
    if (popupImg) popupImg.src = thumbnails[currentIndex].dataset.full;
    if (isPlaying) setTimeout(() => resetProgressBar(), 200);
  }

  // Thumbnail click
  thumbnails.forEach((img, i) => {
    img.addEventListener("click", () => openPopup(i));
  });

  if (nextBtn) nextBtn.addEventListener("click", showNextImage);
  if (prevBtn) prevBtn.addEventListener("click", showPrevImage);
  if (closeBtn) closeBtn.addEventListener("click", closePopup);

  // --- SLIDESHOW ---
  const playPauseBtn = document.getElementById("popup-playpause");
  const closeSlideshowBtn = document.getElementById("popup-close");

  function resetProgressBar() {
    if (!progressFill) return;
    progressFill.style.transition = "none";
    progressFill.style.width = "0%";
    setTimeout(() => {
      progressFill.style.transition = "width 4s linear";
      progressFill.style.width = "100%";
    }, 50);
  }

  function startSlideshow() {
    stopSlideshow();
    isPlaying = true;
    resetProgressBar();
    slideInterval = setInterval(() => {
      showNextImage();
    }, 4000);
    if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
  }

  function stopSlideshow() {
    isPlaying = false;
    clearInterval(slideInterval);
    if (progressFill) progressFill.style.width = "0%";
    if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
  }

  // --- SLIDESHOW TOOLBAR ---
  const toolbarSlideshowBtn = document.getElementById("btn-slideshow");

  if (toolbarSlideshowBtn) {
    toolbarSlideshowBtn.addEventListener("click", () => {
      openPopup(0);
      startSlideshow();
      scrollPopupIntoView();
    });
  }

  if (playPauseBtn) {
    playPauseBtn.addEventListener("click", () => {
      if (isPlaying) stopSlideshow();
      else startSlideshow();
    });
  }

  if (closeSlideshowBtn) {
    closeSlideshowBtn.addEventListener("click", () => {
      stopSlideshow();
      if (popup) popup.style.display = "none";
    });
  }

  // --- KEYBOARD CONTROL ---
  document.addEventListener("keydown", (e) => {
    if (popup && popup.style.display === "flex") {
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

  favBtn.addEventListener("click", () => {
    favPopup.style.display = "flex";
    favPopup.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  popupFavBtn.addEventListener("click", () => {
    const currentImage = thumbnails[currentIndex].dataset.full;
    if (!favorites.includes(currentImage)) favorites.push(currentImage);
    favPopup.style.display = "flex";
    favPopup.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  if (favPopupClose) favPopupClose.addEventListener("click", () => favPopup.style.display = "none");

  // --- KIRIM EMAIL ---
  const baseUrl = "https://mgkinvitation.github.io/photo-gallery/";

  if (favSubmit) {
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
  }

  // === SHARE POPUP ===
  const shareBtn = document.getElementById("popup-share");   
  const toolbarShareBtn = document.getElementById("btn-share"); 
  const footerShare = document.getElementById("footer-share");
  const sharePopup = document.getElementById("sharePopup");
  const shareClose = document.getElementById("closeShare");
  const copyBtn = document.getElementById("copyBtn");
  const shareLinkInput = document.getElementById("shareLink");

  if (shareBtn) shareBtn.addEventListener("click", () => { sharePopup.style.display = "flex"; });
  if (toolbarShareBtn) toolbarShareBtn.addEventListener("click", () => { sharePopup.style.display = "flex"; });
  if (footerShare) footerShare.addEventListener("click", () => { sharePopup.style.display = "flex"; });
  if (shareClose) shareClose.addEventListener("click", () => { sharePopup.style.display = "none"; });
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      shareLinkInput.select();
      navigator.clipboard.writeText(shareLinkInput.value)
        .then(() => alert("Link copied to clipboard!"))
        .catch(() => alert("Failed to copy link"));
    });
  }

  if (shareLinkInput) {
    const pageUrl = encodeURIComponent(shareLinkInput.value);
    const pageTitle = encodeURIComponent("Check out this gallery!");
    const sw = document.getElementById("shareWhatsapp");
    const si = document.getElementById("shareInstagram");
    const se = document.getElementById("shareEmail");
    if (sw) sw.href = `https://wa.me/?text=${pageTitle}%20${pageUrl}`;
    if (si) si.href = `https://www.instagram.com/direct/new/?text=${pageTitle}%20${pageUrl}`;
    if (se) se.href = `mailto:?subject=${pageTitle}&body=${pageUrl}`;
  }

  // --- DOWNLOAD (fungsi umum) ---
  async function downloadAllPhotos() {
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
  }

  const downloadBtn = document.getElementById("btn-download");
  const popupDownloadBtn = document.getElementById("popup-download");
  const footerDownloadBtn = document.getElementById("footer-download");

  if (downloadBtn) downloadBtn.addEventListener("click", (e) => { e.preventDefault(); downloadAllPhotos(); });
  if (footerDownloadBtn) downloadBtn.addEventListener("click", (e) => { e.preventDefault(); downloadAllPhotos(); });

  // --- DOWNLOAD POPUP ---
  const downloadPopup = document.getElementById("download-popup");
  const downloadClose = document.getElementById("download-close");
  const saveDeviceBtn = document.getElementById("save-device");
  const saveGoogleBtn = document.getElementById("save-google");

  if (popupDownloadBtn) {
    popupDownloadBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (downloadPopup) downloadPopup.style.display = "flex";
    });
  }
  if (downloadClose) {
    downloadClose.addEventListener("click", () => {
      if (downloadPopup) downloadPopup.style.display = "none";
    });
  }
  if (saveDeviceBtn) {
    saveDeviceBtn.addEventListener("click", () => {
      const currentImage = thumbnails[currentIndex] ? thumbnails[currentIndex].dataset.full : null;
      if (!currentImage) return;
      const link = document.createElement("a");
      link.href = currentImage;
      link.download = currentImage.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (downloadPopup) downloadPopup.style.display = "none"; 
    });
  }
  if (saveGoogleBtn) {
    saveGoogleBtn.addEventListener("click", () => {
      const currentImage = thumbnails[currentIndex] ? thumbnails[currentIndex].dataset.full : null;
      if (!currentImage) return;
      const photoUrl = window.location.origin + "/" + currentImage;
      const googlePhotosUrl = `https://photos.google.com/?pli=1&url=${encodeURIComponent(photoUrl)}`;
      window.open(googlePhotosUrl, "_blank");
      if (downloadPopup) downloadPopup.style.display = "none"; 
    });
  }

  // --- Pagination ---
  const galleryContainer = document.getElementById("gallery");
  const paginationContainer = document.getElementById("pagination");
  const allPhotos = Array.from(document.querySelectorAll(".thumbnail-wrapper"));
  const itemsPerPage = 15;
  let currentPage = 1;

  function renderGallery(page) {
    if (!galleryContainer) return;
    galleryContainer.innerHTML = "";
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = allPhotos.slice(start, end);
    paginatedItems.forEach(item => galleryContainer.appendChild(item));

    const thumbnailsPage = galleryContainer.querySelectorAll("img");
    thumbnailsPage.forEach((img, i) => {
      img.addEventListener("click", () => openPopup(start + i));
    });
  }

  function renderPagination() {
    if (!paginationContainer) return;
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(allPhotos.length / itemsPerPage);
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

  if (galleryContainer && paginationContainer) {
    renderGallery(currentPage);
    renderPagination();
  }

  // --- Scroll Icon ---
  const scrollIcon = document.querySelector(".scroll-icon");
  if (scrollIcon) {
    scrollIcon.addEventListener("click", () => {
      const mainContent = document.getElementById("main-content");
      if (mainContent && !mainContent.classList.contains("show")) {
        mainContent.classList.add("show");
      }
      const toolbar = document.getElementById("toolbar");
      if (toolbar) toolbar.scrollIntoView({ behavior: "smooth" });
    });
  }

  // end DOMContentLoaded
});

// === HAMBURGER MENU ===
const hamburger = document.getElementById("hamburger");
const toolbarButtons = document.getElementById("toolbar-buttons");
const closeHamburger = document.querySelector("#toolbar-buttons .close-hamburger");

if (hamburger && toolbarButtons) {
  hamburger.addEventListener("click", () => {
    toolbarButtons.classList.toggle("active");
  });
}

// tombol close manual
if (closeHamburger) {
  closeHamburger.addEventListener("click", () => {
    toolbarButtons.classList.remove("active");
  });
}

// jika salah satu tombol toolbar dipilih → menu nutup otomatis
if (toolbarButtons) {
  const toolbarMenuButtons = toolbarButtons.querySelectorAll("button:not(.close-hamburger)");
  toolbarMenuButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      toolbarButtons.classList.remove("active");
    });
  });
}
