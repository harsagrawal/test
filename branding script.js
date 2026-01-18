const links = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll',()=>{
  let current='';
  sections.forEach(sec=>{
    if(pageYOffset >= sec.offsetTop-150) current = sec.id;
  });
  links.forEach(a=>{
    a.classList.remove('active');
    if(a.getAttribute('href') === '#'+current) a.classList.add('active');
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

document.querySelectorAll('.card img').forEach(img=>{
  img.onclick = ()=>{
    lightbox.style.display='flex';
    lightboxImg.src = img.src;
  }
});

lightbox.onclick = ()=> lightbox.style.display='none';
