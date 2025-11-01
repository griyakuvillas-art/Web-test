const billingToggle = document.querySelector('#billing-toggle');
const priceTags = document.querySelectorAll('.price-card .price');

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const updatePricing = (yearly) => {
  priceTags.forEach((tag) => {
    const monthlyValue = Number(tag.dataset.monthly || 0);
    const yearlyValue = Number(tag.dataset.yearly || 0);

    if (monthlyValue === 0) {
      tag.textContent = 'Gratis';
      return;
    }

    if (yearly && yearlyValue) {
      tag.textContent = `${formatCurrency(yearlyValue)}/thn`;
    } else {
      tag.textContent = `${formatCurrency(monthlyValue)}/bln`;
    }
  });
};

if (billingToggle) {
  updatePricing(false);
  billingToggle.addEventListener('change', (event) => {
    updatePricing(event.target.checked);
  });
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    },
    {
      threshold: 0.2
    }
  );

  document.querySelectorAll('.glass-panel, .glass-soft, .feed-card, .price-card').forEach((block) => {
    block.classList.add('will-animate');
    observer.observe(block);
  });
}

const navLinks = document.querySelectorAll('.main-nav .nav-link');
const sections = Array.from(navLinks).map((link) => document.querySelector(link.getAttribute('href')));

const highlightNav = () => {
  const scrollPosition = window.scrollY + 120;

  sections.forEach((section, index) => {
    if (!section) return;
    const offsetTop = section.offsetTop;
    const offsetBottom = offsetTop + section.offsetHeight;
    const isActive = scrollPosition >= offsetTop && scrollPosition < offsetBottom;

    navLinks[index].classList.toggle('is-active', isActive);
  });
};

highlightNav();
window.addEventListener('scroll', highlightNav, { passive: true });

const hero = document.querySelector('.hero');
const heroVisual = document.querySelector('.hero-visual');

if (hero && heroVisual && !prefersReducedMotion) {
  hero.addEventListener('mousemove', (event) => {
    const rect = hero.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 10;

    heroVisual.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });

  hero.addEventListener('mouseleave', () => {
    heroVisual.style.transform = '';
  });
}
