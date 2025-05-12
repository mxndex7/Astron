const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('nav');
const slideElements = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const gameCards = document.querySelectorAll('.game-card');
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

gameCards.forEach(card => {
  const detailBtn = card.querySelector('.game-overlay .btn');
  if (detailBtn) {
    detailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openGameDetail();
    });
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
});