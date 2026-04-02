const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('nav');
const slideElements = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
<<<<<<< HEAD
const gameCards = document.querySelectorAll('.game-card');
=======
>>>>>>> 52daff4 (Inicio de Aplicação de API)
const gameDetail = document.getElementById('gameDetail');
const closeDetail = document.querySelector('.close-detail');
const reqTabs = document.querySelectorAll('.req-tab');
const thumbnailImages = document.querySelectorAll('.thumbnail-images img');
const mainImage = document.querySelector('.main-image img');

let currentSlide = 0;
let slideInterval;

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    nav.classList.toggle('active');

    const icon = mobileMenuBtn.querySelector('i');
    if (icon.classList.contains('fa-bars')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  });
}

document.addEventListener('click', (e) => {
  if (nav.classList.contains('active') && !e.target.closest('nav') && !e.target.closest('.mobile-menu-btn')) {
    nav.classList.remove('active');
    const icon = mobileMenuBtn.querySelector('i');
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
  }
});

function initSlider() {
  showSlide(0);

  startSlideInterval();

  prevBtn.addEventListener('click', () => {
    clearInterval(slideInterval);
    prevSlide();
    startSlideInterval();
  });

  nextBtn.addEventListener('click', () => {
    clearInterval(slideInterval);
    nextSlide();
    startSlideInterval();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      clearInterval(slideInterval);
      showSlide(index);
      startSlideInterval();
    });
  });
}

function startSlideInterval() {
  slideInterval = setInterval(() => {
    nextSlide();
  }, 5000);
}

function showSlide(index) {
  slideElements.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));

  slideElements[index].classList.add('active');
  dots[index].classList.add('active');

  currentSlide = index;
}

function nextSlide() {
  let nextIndex = currentSlide + 1;
  if (nextIndex >= slideElements.length) {
    nextIndex = 0;
  }
  showSlide(nextIndex);
}

function prevSlide() {
  let prevIndex = currentSlide - 1;
  if (prevIndex < 0) {
    prevIndex = slideElements.length - 1;
  }
  showSlide(prevIndex);
}

if (slideElements.length > 0 && dots.length > 0) {
  initSlider();
}

<<<<<<< HEAD
gameCards.forEach(card => {
  const detailBtn = card.querySelector('.game-overlay .btn');
  if (detailBtn) {
    detailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openGameDetail();
    });
=======
// Renderiza cards dinamicamente a partir da API (ou arquivo local)
function createGameCard(game) {
  const card = document.createElement('div');
  card.className = 'game-card';
  card.dataset.id = game.id;

  const imgSrc = game.image || '';
  const categories = (game.categories || []).join(' / ');
  const discount = game.discount ? ` <span class="discount">-${game.discount}%</span>` : '';

  let oldPriceHtml = '';
  if (game.discount && game.price) {
    const oldPrice = (game.price / (1 - game.discount / 100));
    oldPriceHtml = `<span class="old-price">R$ ${oldPrice.toFixed(2).replace('.', ',')}</span>`;
  }

  const currentPrice = game.price ? `<span class="current-price">R$ ${game.price.toFixed(2).replace('.', ',')}</span>` : '';

  card.innerHTML = `
    <div class="game-image">
      <img data-src="${imgSrc}" alt="${game.title}">
      <div class="game-overlay">
        <a href="#" class="btn" data-id="${game.id}">Ver Detalhes</a>
      </div>
    </div>
    <div class="game-info">
      <h3>${game.title}</h3>
      <p class="game-category">${categories}</p>
      <div class="game-price">
        ${discount} ${oldPriceHtml} ${currentPrice}
      </div>
    </div>
  `;

  return card;
}

function renderGames(games) {
  const grid = document.querySelector('.games-grid');
  if (!grid) return;
  grid.innerHTML = '';
  games.forEach(g => grid.appendChild(createGameCard(g)));
  setupLazyLoading();
}

function populateGameDetail(game) {
  if (!gameDetail) return;
  const mainImg = gameDetail.querySelector('.main-image img');
  const thumbnailsContainer = gameDetail.querySelector('.thumbnail-images');
  const titleEl = gameDetail.querySelector('.game-detail-info h2');
  const developerEl = gameDetail.querySelector('.game-meta .developer');
  const publisherEl = gameDetail.querySelector('.game-meta .publisher');
  const releaseEl = gameDetail.querySelector('.game-meta .release-date');
  const tagsEl = gameDetail.querySelector('.game-tags');
  const descEl = gameDetail.querySelector('.game-description');
  const pricingEl = gameDetail.querySelector('.game-pricing');

  titleEl.textContent = game.title || '';
  if (developerEl) developerEl.textContent = game.developer || '';
  if (publisherEl) publisherEl.textContent = game.publisher || '';
  if (releaseEl) releaseEl.textContent = game.releaseDate || '';

  tagsEl.innerHTML = '';
  (game.categories || []).forEach(cat => {
    const span = document.createElement('span');
    span.textContent = cat;
    tagsEl.appendChild(span);
  });

  descEl.innerHTML = `<p>${game.description || ''}</p>`;

  thumbnailsContainer.innerHTML = '';
  const thumbs = (game.thumbnails && game.thumbnails.length) ? game.thumbnails : [game.image];
  thumbs.forEach((t, idx) => {
    const img = document.createElement('img');
    img.src = t || '';
    img.alt = `${game.title} ${idx + 1}`;
    img.addEventListener('click', () => {
      if (mainImg) mainImg.src = t || '';
      mainImg.style.opacity = '0';
      setTimeout(() => { mainImg.style.opacity = '1'; }, 120);
    });
    thumbnailsContainer.appendChild(img);
  });

  if (mainImg) mainImg.src = thumbs[0] || game.image || '';

  if (pricingEl) {
    const discountEl = pricingEl.querySelector('.discount');
    const oldPriceEl = pricingEl.querySelector('.old-price');
    const currentPriceEl = pricingEl.querySelector('.current-price');
    if (game.discount && game.price) {
      if (discountEl) discountEl.textContent = `-${game.discount}%`;
      if (oldPriceEl) {
        const oldPrice = (game.price / (1 - game.discount / 100));
        oldPriceEl.textContent = `R$ ${oldPrice.toFixed(2).replace('.', ',')}`;
      }
      if (currentPriceEl) currentPriceEl.textContent = `R$ ${game.price.toFixed(2).replace('.', ',')}`;
    } else {
      if (discountEl) discountEl.textContent = '';
      if (oldPriceEl) oldPriceEl.textContent = '';
      if (currentPriceEl) currentPriceEl.textContent = game.price ? `R$ ${game.price.toFixed(2).replace('.', ',')}` : '';
    }
  }
}

// Delegação de clique para abrir detalhes
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.game-overlay .btn, .game-card .btn');
  if (btn) {
    e.preventDefault();
    const id = btn.getAttribute('data-id') || btn.closest('.game-card')?.dataset.id;
    if (!id) return;
    const game = window.gameAPI ? window.gameAPI.getGameById(id) : null;
    if (game) {
      populateGameDetail(game);
      openGameDetail();
    }
>>>>>>> 52daff4 (Inicio de Aplicação de API)
  }
});

function openGameDetail() {
  gameDetail.style.display = 'block';
  gameDetail.offsetHeight;
  gameDetail.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeGameDetail() {
  gameDetail.classList.remove('active');

  setTimeout(() => {
    gameDetail.style.display = 'none';
    document.body.style.overflow = '';
  }, 300);
}

if (closeDetail) {
  closeDetail.addEventListener('click', closeGameDetail);
}

gameDetail.addEventListener('click', (e) => {
  if (e.target === gameDetail) {
    closeGameDetail();
  }
});

reqTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const tabId = tab.getAttribute('data-tab');

    reqTabs.forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.req-content').forEach(content => {
      content.classList.remove('active');
    });

    tab.classList.add('active');
    document.getElementById(tabId).classList.add('active');
  });
});

thumbnailImages.forEach(thumb => {
  thumb.addEventListener('click', () => {
    mainImage.src = thumb.src;

    mainImage.style.opacity = '0';
    setTimeout(() => {
      mainImage.style.opacity = '1';
    }, 100);
  });
});

function setupScrollAnimations() {
  const animatedElements = document.querySelectorAll('.section-title, .game-card, .category-card, .newsletter-content');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  animatedElements.forEach(element => {
    element.classList.remove('animate-fade-in');
    observer.observe(element);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupScrollAnimations();
});

function setupLazyLoading() {
  const lazyImages = document.querySelectorAll('img[data-src]');

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });

  lazyImages.forEach(img => {
    imageObserver.observe(img);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupLazyLoading();
<<<<<<< HEAD
=======
});

// Carrega jogos via API/fallback e habilita busca
document.addEventListener('DOMContentLoaded', async () => {
  if (!window.gameAPI) return;
  try {
    const games = await window.gameAPI.loadGames();
    if (games && games.length) renderGames(games);

    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        const filtered = (window.gameAPI.games || []).filter(g => {
          return g.title.toLowerCase().includes(q) || (g.categories || []).some(c => c.toLowerCase().includes(q));
        });
        renderGames(filtered);
      });
    }
  } catch (err) {
    console.error('Erro carregando jogos:', err);
  }
>>>>>>> 52daff4 (Inicio de Aplicação de API)
});