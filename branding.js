const fullscreen = document.getElementById("fullscreen");
const fsContent = fullscreen.querySelector(".fullscreen-content");

/* ---------- CAROUSEL WITH POINTER EVENTS ---------- */
function initCarousel(carousel){
  const track = carousel.querySelector(".track");
  const slides = track.children;
  const prev = carousel.querySelector(".prev");
  const next = carousel.querySelector(".next");

  let index = 0;
  let startX = 0;
  let isDown = false;

  function update(){
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  prev.onclick = e=>{
    e.stopPropagation();
    if(index > 0){ index--; update(); }
  };

  next.onclick = e=>{
    e.stopPropagation();
    if(index < slides.length - 1){ index++; update(); }
  };

  /* 🔥 REAL SWIPE (POINTER EVENTS) */
  carousel.addEventListener("pointerdown", e=>{
    isDown = true;
    startX = e.clientX;
    carousel.setPointerCapture(e.pointerId);
  });

  carousel.addEventListener("pointerup", e=>{
    if(!isDown) return;

    const diff = e.clientX - startX;
    if(diff > 60 && index > 0) index--;
    if(diff < -60 && index < slides.length - 1) index++;

    update();
    isDown = false;
  });

  carousel.addEventListener("pointercancel", ()=>{
    isDown = false;
  });
}

/* INIT PAGE CAROUSELS */
document.querySelectorAll("[data-carousel]").forEach(initCarousel);

/* ---------- CARD → FULLSCREEN ---------- */
document.querySelectorAll(".card").forEach(card=>{
  card.addEventListener("click",()=>{
    const clone = card.cloneNode(true);

    fsContent.innerHTML="";
    fsContent.appendChild(clone);

    const fsCarousel = clone.querySelector("[data-carousel]");
    if(fsCarousel) initCarousel(fsCarousel);

    fullscreen.classList.add("active");
    document.body.style.overflow="hidden";
  });
});

/* ---------- CLOSE ---------- */
function closeFS(){
  fullscreen.classList.remove("active");
  fsContent.innerHTML="";
  document.body.style.overflow="auto";
}

document.querySelector(".close").onclick = closeFS;
