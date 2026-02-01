const cards = document.querySelectorAll('.showcase-card');
const overlay = document.getElementById('overlay');
const closeBtn = document.querySelector('.close');
const title = document.getElementById('caseTitle');
const desc = document.getElementById('caseDesc');
const slides = document.querySelectorAll('.slide');

let index = 0;

const projects = {
  1: {
    title: "Screener for web & app",
    desc: "A fast, minimal trading screener designed for serious users.",
    images: [
      "https://picsum.photos/600/900?11",
      "https://picsum.photos/600/900?12",
      "https://picsum.photos/600/900?13"
    ]
  },
  2: {
    title: "Stock event calendar",
    desc: "A focused calendar experience for tracking market events.",
    images: [
      "https://picsum.photos/600/900?21",
      "https://picsum.photos/600/900?22",
      "https://picsum.photos/600/900?23"
    ]
  }
};

cards.forEach(card => {
  card.onclick = () => {
    const data = projects[card.dataset.project];

    title.innerText = data.title;
    desc.innerText = data.desc;

    slides.forEach((img, i) => {
      img.src = data.images[i];
      img.classList.toggle('active', i === 0);
    });

    index = 0;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
});

document.querySelector('.next').onclick = () => move(1);
document.querySelector('.prev').onclick = () => move(-1);

function move(step) {
  slides[index].classList.remove('active');
  index = (index + step + slides.length) % slides.length;
  slides[index].classList.add('active');
}

closeBtn.onclick = () => {
  overlay.classList.remove('active');
  document.body.style.overflow = '';
};
