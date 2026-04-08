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
   BOOKS — load from books.json
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
    books.forEach((book, i) => renderCard(book, i, grid));

  } catch (err) {
    loading.style.display = 'none';
    empty.style.display   = 'block';
    console.warn('Could not load books.json', err);
  }
}

function renderCard(book, index, container) {
  const card = document.createElement('div');
  card.className = 'book-card';

  let coverHtml;
  if (book.image) {
    coverHtml = `
      <div class="book-cover">
        <div class="book-spine"></div>
        <img src="${esc(book.image)}" alt="${esc(book.title)}" loading="lazy"
             onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div class="css-cover" data-p="${index % PALETTES}" style="display:none">
          <div class="css-ornament">${ORNAMENTS[index % ORNAMENTS.length]}</div>
          <div class="css-title">${esc(book.title)}</div>
          <div class="css-author-name">তপন বন্দ্যোপাধ্যায়</div>
        </div>
      </div>`;
  } else {
    coverHtml = `
      <div class="book-cover">
        <div class="book-spine"></div>
        <div class="css-cover" data-p="${index % PALETTES}">
          <div class="css-ornament">${ORNAMENTS[index % ORNAMENTS.length]}</div>
          <div class="css-title">${esc(book.title)}</div>
          <div class="css-author-name">তপন বন্দ্যোপাধ্যায়</div>
        </div>
      </div>`;
  }

  // Notice the overlay HTML is gone! 
  card.innerHTML = `
    ${coverHtml}
    <div class="book-label">
      <div class="book-label-title">${esc(book.title)}</div>
      ${book.tag ? `<div class="book-label-tag">${esc(book.tag)}</div>` : ''}
    </div>`;

  // Trigger modal on click
  card.addEventListener('click', () => openModal(book));
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
   GLASSMORPHISM MODAL LOGIC
═══════════════════════════════════════ */
const modal = document.getElementById('bookModal');
const modalBody = document.getElementById('modalBody');
const closeModalBtn = document.getElementById('closeModal');

function openModal(book) {
  modalBody.innerHTML = `
    <div class="modal-title">${esc(book.title)}</div>
    ${book.tag ? `<div class="modal-tag">${esc(book.tag)}</div>` : ''}
    ${book.description ? `<div class="modal-desc">${esc(book.description)}</div>` : ''}
    ${book.link ? `<a class="btn-primary modal-btn" href="${esc(book.link)}" target="_blank" rel="noopener">
      বইটি সংগ্রহ করুন ↗
    </a>` : ''}
  `;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Stops the background from scrolling
}

function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

closeModalBtn.addEventListener('click', closeModal);

// Close if the user clicks the blurry background outside the card
modal.addEventListener('click', e => {
  if (e.target === modal) closeModal();
});

document.addEventListener('DOMContentLoaded', loadBooks);
