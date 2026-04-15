/* ═══════════════════════════════════════
   TAB NAVIGATION
═══════════════════════════════════════ */
function go(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('[data-tab]').forEach(el => el.classList.remove('active', 'here'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll(`[data-tab="${id}"]`).forEach(el => {
    el.classList.add(el.closest('.chapters') ? 'here' : 'active');
  });
  document.getElementById('navTabs').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('[data-tab]').forEach(el =>
  el.addEventListener('click', e => { e.preventDefault(); go(el.dataset.tab); })
);
document.getElementById('burger').addEventListener('click', () =>
  document.getElementById('navTabs').classList.toggle('open')
);

/* ═══════════════════════════════════════
   CONTACT FORM EMAIL TRIGGER
═══════════════════════════════════════ */
document.getElementById('contactSubmit').addEventListener('click', function(e) {
  e.preventDefault();
  const name = document.getElementById('contactName').value.trim();
  const email = document.getElementById('contactEmail').value.trim();
  const message = document.getElementById('contactMessage').value.trim();
  
  if(!message) {
    alert("অনুগ্রহ করে আপনার বার্তা লিখুন।"); 
    return;
  }
  
  const subject = encodeURIComponent(`Website Contact: Message from ${name || 'A Reader'}`);
  const body = encodeURIComponent(`${message}\n\n---\nName: ${name}\nEmail: ${email}`);
  
  window.location.href = `mailto:btapan6@gmail.com?subject=${subject}&body=${body}`;
});

/* ═══════════════════════════════════════
   BOOKS — Load from books.json
═══════════════════════════════════════ */
const PALETTES = 8;
const ORNAMENTS = ['✦','◈','❋','✿','⊕','◉','☽','♛','⬡','❄','☁','⬟'];

async function loadBooks() {
  const grid    = document.getElementById('booksGrid');
  const empty   = document.getElementById('booksEmpty');
  const loading = document.getElementById('booksLoading');

  try {
    const res   = await fetch('books.json?v=' + Date.now());
    const books = await res.json();

    loading.style.display = 'none';

    if (!books || books.length === 0) {
      empty.style.display = 'block';
      return;
    }

    grid.innerHTML = '';
    // Sort books by order ascending (1 is top)
    books.sort((a, b) => a.order - b.order);
    books.forEach((book, i) => renderCard(book, i, grid));

  } catch (err) {
    loading.style.display = 'none';
    empty.style.display   = 'block';
    console.warn('Could not load books.json', err);
  }
}

function renderCard(book, index, container) {
  const card = document.createElement('div');
  card.className = 'book-card-landscape';

  // --- Left Side Cover Logic (Image or Fallback) ---
  let coverHtml;
  if (book.image) {
    coverHtml = `
      <div class="css-cover-wrap">
        <div class="css-cover-spine"></div>
        <img src="${esc(book.image)}" alt="${esc(book.title)}" loading="lazy"
             onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div class="css-cover-procedural" data-p="${index % PALETTES}" style="display:none">
          <div class="css-cover-ornament">${ORNAMENTS[index % ORNAMENTS.length]}</div>
          <div class="css-cover-procedural-title">${esc(book.title)}</div>
          <div class="css-cover-author-name">তপন বন্দ্যোপাধ্যায়</div>
        </div>
      </div>`;
  } else {
    coverHtml = `
      <div class="css-cover-wrap">
        <div class="css-cover-spine"></div>
        <div class="css-cover-procedural" data-p="${index % PALETTES}">
          <div class="css-cover-ornament">${ORNAMENTS[index % ORNAMENTS.length]}</div>
          <div class="css-cover-procedural-title">${esc(book.title)}</div>
          <div class="css-cover-author-name">তপন বন্দ্যোপাধ্যায়</div>
        </div>
      </div>`;
  }

  // --- HTML Structure for YouTube-style Landscape Card ---
  card.innerHTML = `
    <div class="book-card-left">
      ${coverHtml}
      <div class="book-title-label">${esc(book.title)}</div>
    </div>
    
    <div class="book-card-right">
      ${book.tag ? `<div class="book-tag-gold">${esc(book.tag)}</div>` : ''}
      ${book.description ? `<div class="book-description">${esc(book.description)}</div>` : ''}
      ${book.link ? `<a class="btn-primary book-collect-btn" href="${esc(book.link)}" target="_blank" rel="noopener">
        বইটি সংগ্রহ করুন ↗
      </a>` : ''}
    </div>
  `;

  container.appendChild(card);
}

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ═══════════════════════════════════════
   LANGUAGE TRANSLATION TOGGLE (Google Translate)
═══════════════════════════════════════ */
const langToggle = document.getElementById('langToggle');
const isEnglish = document.cookie.includes('googtrans=/bn/en');

// Set initial button text based on current language
if (isEnglish) {
  langToggle.innerText = 'বাং'; // If English, show option to switch to Bengali
} else {
  langToggle.innerText = 'EN';  // If Bengali, show option to switch to English
}

// Handle translation trigger
langToggle.addEventListener('click', () => {
  const domain = window.location.hostname;
  
  if (isEnglish) {
    // Revert to Bengali
    document.cookie = `googtrans=/bn/bn; path=/; domain=${domain}`;
    document.cookie = `googtrans=/bn/bn; path=/;`;
  } else {
    // Translate to English
    document.cookie = `googtrans=/bn/en; path=/; domain=${domain}`;
    document.cookie = `googtrans=/bn/en; path=/;`;
  }
  
  // Reload page to apply Google Translate changes
  window.location.reload();
});

// Initialize books on page load
document.addEventListener('DOMContentLoaded', loadBooks);
                   
