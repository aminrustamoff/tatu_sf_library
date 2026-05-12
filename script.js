// Django API-ready frontend.
// Backend endpointlarni moslashtirish uchun shu qiymatni o'zgartiring:
const API_BASE = window.API_BASE || '/api';
const USE_API = true;

const LANGS = {
  uz: {
    login_subtitle: 'Axborot markazi ekotizimi', hemis_id: 'HEMIS ID', password: 'Parol', login: 'Kirish', logout: 'Chiqish',
    nav_main: 'Bosh', nav_catalog: 'Katalog', nav_profile: 'Profil', nav_admin: 'Admin',
    hero_sub: 'Kitoblar katalogi, o‘quvchi profili va admin boshqaruvi uchun yengil platforma.', search_placeholder: 'Kitob, muallif yoki kategoriya qidiring', search: 'Qidirish',
    stats_books: 'Kitoblar', stats_users: 'Foydalanuvchilar', stats_avail: 'Mavjudlik', recent_books: 'So‘nggi kitoblar', see_all: 'Barchasini ko‘rish',
    results: 'ta natija', add_book: 'Kitob qo‘shish', filter: 'Filter', category: 'Kategoriya', format: 'Format', all: 'Barchasi', sort: 'Saralash', sort_new: 'Yangi', sort_rating: 'Reyting', sort_title: 'Nom bo‘yicha',
    back_catalog: 'Katalogga qaytish', focus_mode: 'Fokus', student_profile: 'Talaba profili', my_books: 'Mening kitoblarim', reading_stats: 'O‘qish statistikasi', daily_goal: 'Kunlik maqsad', goal_text: 'Bugun 3 / 5 sahifa o‘qildi',
    admin_title: 'Admin panel', admin_sub: 'Kitoblarni qo‘shish va ro‘yxatni boshqarish', title: 'Sarlavha', author: 'Muallif', year: 'Yil', rating: 'Reyting', description: 'Tavsif', save: 'Saqlash', current_books: 'Joriy kitoblar',
    login_error: 'Demo uchun: 322201100452 / student123', login_ok: 'Xush kelibsiz', saved: 'Kitob saqlandi', api_fallback: 'API topilmadi, demo data ishlayapti', empty: 'Ma’lumot topilmadi'
  },
  ru: {
    login_subtitle: 'Экосистема информационного центра', hemis_id: 'HEMIS ID', password: 'Пароль', login: 'Войти', logout: 'Выйти',
    nav_main: 'Главная', nav_catalog: 'Каталог', nav_profile: 'Профиль', nav_admin: 'Админ',
    hero_sub: 'Легкая платформа для каталога книг, профиля читателя и админ-панели.', search_placeholder: 'Искать книгу, автора или категорию', search: 'Поиск',
    stats_books: 'Книги', stats_users: 'Пользователи', stats_avail: 'Доступность', recent_books: 'Новые книги', see_all: 'Смотреть все',
    results: 'результатов', add_book: 'Добавить книгу', filter: 'Фильтр', category: 'Категория', format: 'Формат', all: 'Все', sort: 'Сортировка', sort_new: 'Новые', sort_rating: 'Рейтинг', sort_title: 'По названию',
    back_catalog: 'Назад к каталогу', focus_mode: 'Фокус', student_profile: 'Профиль студента', my_books: 'Мои книги', reading_stats: 'Статистика чтения', daily_goal: 'Дневная цель', goal_text: 'Сегодня прочитано 3 / 5 страниц',
    admin_title: 'Админ-панель', admin_sub: 'Добавление и управление книгами', title: 'Название', author: 'Автор', year: 'Год', rating: 'Рейтинг', description: 'Описание', save: 'Сохранить', current_books: 'Текущие книги',
    login_error: 'Для демо: 322201100452 / student123', login_ok: 'Добро пожаловать', saved: 'Книга сохранена', api_fallback: 'API не найден, используется демо', empty: 'Ничего не найдено'
  },
  en: {
    login_subtitle: 'Information center ecosystem', hemis_id: 'HEMIS ID', password: 'Password', login: 'Login', logout: 'Logout',
    nav_main: 'Home', nav_catalog: 'Catalog', nav_profile: 'Profile', nav_admin: 'Admin',
    hero_sub: 'A lightweight platform for book catalog, reader profile and admin management.', search_placeholder: 'Search by book, author or category', search: 'Search',
    stats_books: 'Books', stats_users: 'Users', stats_avail: 'Availability', recent_books: 'Recent books', see_all: 'See all',
    results: 'results', add_book: 'Add book', filter: 'Filter', category: 'Category', format: 'Format', all: 'All', sort: 'Sort', sort_new: 'Newest', sort_rating: 'Rating', sort_title: 'By title',
    back_catalog: 'Back to catalog', focus_mode: 'Focus', student_profile: 'Student profile', my_books: 'My books', reading_stats: 'Reading statistics', daily_goal: 'Daily goal', goal_text: 'Today 3 / 5 pages read',
    admin_title: 'Admin panel', admin_sub: 'Add and manage books', title: 'Title', author: 'Author', year: 'Year', rating: 'Rating', description: 'Description', save: 'Save', current_books: 'Current books',
    login_error: 'Demo: 322201100452 / student123', login_ok: 'Welcome', saved: 'Book saved', api_fallback: 'API not found, demo data is used', empty: 'No data found'
  }
};

let curLang = localStorage.getItem('arm_lang') || 'uz';
let isDark = localStorage.getItem('arm_dark') === '1';
let books = [];
let filteredBooks = [];
let currentBook = null;
let readerFont = 17;
let apiWarned = false;

const demoBooks = [
  { id: 1, title: 'Neural Architectures in Python', author: 'Dr. Elena Vosovic', year: 2023, category: 'IT', format: 'PDF', rating: 4.9, description: 'Python orqali neyron tarmoqlar asoslari va amaliy arxitekturalar.' },
  { id: 2, title: 'Distributed Systems & Cloud', author: 'Prof. Marcus Thorne', year: 2022, category: 'IT', format: 'EPUB', rating: 4.7, description: 'Bulutli tizimlar, mikroservislar va taqsimlangan hisoblash konsepsiyalari.' },
  { id: 3, title: 'Clean Code Paradigm', author: 'Sarah Jenkins', year: 2024, category: 'IT', format: 'PDF', rating: 5.0, description: 'Toza kod yozish, refactoring va professional dasturlash uslublari.' },
  { id: 4, title: 'Quantum Computation', author: 'David Heisenberg', year: 2023, category: 'Physics', format: 'PDF', rating: 4.2, description: 'Kvant hisoblash, kubitlar va algoritmlar haqida kirish qo‘llanma.' },
  { id: 5, title: 'Advanced Calculus', author: 'Prof. William Scott', year: 2022, category: 'Math', format: 'PDF', rating: 4.6, description: 'Matematik analiz, limit, integral va differensial tenglamalar.' },
  { id: 6, title: 'World Literature Classics', author: 'Multiple Authors', year: 2024, category: 'Literature', format: 'EPUB', rating: 4.9, description: 'Jahon adabiyotining tanlangan asarlari va qisqa sharhlari.' }
];

function t(key) {
  return (LANGS[curLang] && LANGS[curLang][key]) || LANGS.uz[key] || key;
}

function setLang(lang) {
  curLang = lang;
  localStorage.setItem('arm_lang', lang);
  document.documentElement.lang = lang;
  const labels = { uz: 'UZ', ru: 'RU', en: 'EN' };
  const label = document.getElementById('lang-label');
  if (label) label.textContent = labels[lang] || 'UZ';

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });
  renderAll();
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return '';
}

async function apiRequest(path, options = {}) {
  if (!USE_API) throw new Error('API disabled');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  const csrf = getCookie('csrftoken');
  if (csrf) headers['X-CSRFToken'] = csrf;

  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    ...options,
    headers
  });
  if (!response.ok) throw new Error(`API error ${response.status}`);
  return response.json();
}

async function loadBooks() {
  try {
    const data = await apiRequest('/books/');
    books = Array.isArray(data) ? data : (data.results || []);
  } catch (error) {
    books = [...demoBooks];
    if (!apiWarned) {
      showToast(t('api_fallback'));
      apiWarned = true;
    }
  }
  filteredBooks = [...books];
  renderAll();
}

async function doLogin(event) {
  if (event) event.preventDefault();
  const id = document.getElementById('login-id').value.trim();
  const password = document.getElementById('login-password').value.trim();

  try {
    await apiRequest('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username: id, password })
    });
    openApp();
  } catch (error) {
    if (id === '322201100452' && password === 'student123') {
      openApp();
    } else {
      showToast(t('login_error'));
    }
  }
}

function openApp() {
  document.getElementById('login-page').classList.add('hidden');
  document.getElementById('main-app').classList.remove('hidden');
  showToast(t('login_ok'));
  loadBooks();
  showPage('main');
}

function doLogout() {
  document.getElementById('main-app').classList.add('hidden');
  document.getElementById('login-page').classList.remove('hidden');
}

const PAGES = ['main', 'catalog', 'reader', 'profile', 'admin'];
function showPage(page) {
  PAGES.forEach((p) => document.getElementById(`page-${p}`)?.classList.add('hidden'));
  document.getElementById(`page-${page}`)?.classList.remove('hidden');
  document.querySelectorAll('.nav-link').forEach((el) => el.classList.remove('active'));
  document.getElementById(`nl-${page}`)?.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function normalizeBook(book) {
  return {
    id: book.id || Date.now(),
    title: book.title || '',
    author: book.author || '',
    year: Number(book.year) || new Date().getFullYear(),
    category: book.category || book.cat || 'IT',
    format: book.format || book.fmt || 'PDF',
    rating: Number(book.rating) || 4.5,
    description: book.description || 'Bu kitob bo‘yicha qisqa ma’lumot hozircha demo ko‘rinishda berilgan.'
  };
}

function bookCard(book) {
  const b = normalizeBook(book);
  return `
    <article class="card book-card" onclick="openBook(${b.id})">
      <div class="book-cover">📖</div>
      <h3>${escapeHtml(b.title)}</h3>
      <p>${escapeHtml(b.author)} · ${b.year}</p>
      <div class="book-meta">
        <span class="badge badge-primary">${escapeHtml(b.category)}</span>
        <strong>⭐ ${b.rating.toFixed(1)}</strong>
      </div>
    </article>
  `;
}

function renderRecentBooks() {
  const el = document.getElementById('recent-books');
  if (!el) return;
  el.innerHTML = books.slice(0, 4).map(bookCard).join('') || emptyState();
}

function renderCatalog() {
  const grid = document.getElementById('catalog-grid');
  const count = document.getElementById('catalog-count');
  if (count) count.textContent = filteredBooks.length;
  if (grid) grid.innerHTML = filteredBooks.map(bookCard).join('') || emptyState();
}

function renderProfile() {
  const el = document.getElementById('profile-books');
  if (!el) return;
  el.innerHTML = books.slice(0, 3).map((book) => {
    const b = normalizeBook(book);
    return `<div class="mini-item"><span>${escapeHtml(b.title)}</span><strong>${b.format}</strong></div>`;
  }).join('') || emptyState();
}

function renderAdminBooks() {
  const el = document.getElementById('admin-books');
  if (!el) return;
  const rows = books.map((book) => {
    const b = normalizeBook(book);
    return `
      <tr>
        <td>${escapeHtml(b.title)}</td>
        <td>${escapeHtml(b.author)}</td>
        <td>${b.year}</td>
        <td>${escapeHtml(b.category)}</td>
        <td>${escapeHtml(b.format)}</td>
        <td>⭐ ${b.rating.toFixed(1)}</td>
      </tr>
    `;
  }).join('');

  el.innerHTML = `
    <table class="book-table">
      <thead>
        <tr>
          <th>${t('title')}</th><th>${t('author')}</th><th>${t('year')}</th><th>${t('category')}</th><th>${t('format')}</th><th>${t('rating')}</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderStats() {
  const el = document.getElementById('stat-books');
  if (el) el.textContent = books.length;
}

function renderAll() {
  renderStats();
  renderRecentBooks();
  renderCatalog();
  renderProfile();
  renderAdminBooks();
}

function applyFilters() {
  const category = document.getElementById('filter-category').value;
  const format = document.getElementById('filter-format').value;
  const sort = document.getElementById('sort-books').value;
  filteredBooks = books.filter((book) => {
    const b = normalizeBook(book);
    return (category === 'all' || b.category === category) && (format === 'all' || b.format === format);
  });
  sortBooks(sort);
  renderCatalog();
}

function sortBooks(sort) {
  if (sort === 'rating') filteredBooks.sort((a, b) => normalizeBook(b).rating - normalizeBook(a).rating);
  if (sort === 'new') filteredBooks.sort((a, b) => normalizeBook(b).year - normalizeBook(a).year);
  if (sort === 'title') filteredBooks.sort((a, b) => normalizeBook(a).title.localeCompare(normalizeBook(b).title));
}

function searchBooks() {
  const query = document.getElementById('search-input').value.trim().toLowerCase();
  showPage('catalog');
  filteredBooks = books.filter((book) => {
    const b = normalizeBook(book);
    return [b.title, b.author, b.category, b.format].some((value) => String(value).toLowerCase().includes(query));
  });
  renderCatalog();
}

function openBook(id) {
  currentBook = normalizeBook(books.find((book) => Number(book.id) === Number(id)) || books[0] || demoBooks[0]);
  document.getElementById('reader-title').textContent = currentBook.title;
  document.getElementById('reader-meta').textContent = `${currentBook.author} · ${currentBook.year} · ${currentBook.category}`;
  document.getElementById('reader-format').textContent = currentBook.format;
  document.getElementById('reader-text').innerHTML = `
    <p>${escapeHtml(currentBook.description)}</p>
    <p>Ushbu reader sahifasi Django API orqali keladigan kitob ma’lumotlarini ko‘rsatishga tayyor. Real fayl/PDF ochish kerak bo‘lsa, backenddan <strong>file_url</strong> yoki <strong>content</strong> maydonini yuborish kifoya.</p>
    <p>Responsive dizayn sababli bu sahifa telefon, planshet va kompyuter ekranlarida qulay ko‘rinadi.</p>
  `;
  showPage('reader');
}

function changeReaderFont(delta) {
  readerFont = Math.max(14, Math.min(24, readerFont + delta));
  document.documentElement.style.setProperty('--reader-font', `${readerFont}px`);
}

function toggleFocusMode() {
  document.body.classList.toggle('focus-mode');
}

async function saveBook(event) {
  event.preventDefault();
  const book = {
    title: document.getElementById('book-title').value.trim(),
    author: document.getElementById('book-author').value.trim(),
    year: Number(document.getElementById('book-year').value),
    category: document.getElementById('book-category').value,
    format: document.getElementById('book-format').value,
    rating: Number(document.getElementById('book-rating').value) || 4.5,
    description: document.getElementById('book-description').value.trim()
  };

  if (!book.title || !book.author || !book.year) return;

  try {
    const saved = await apiRequest('/books/', {
      method: 'POST',
      body: JSON.stringify(book)
    });
    books.unshift(normalizeBook(saved));
  } catch (error) {
    books.unshift({ id: Date.now(), ...book });
  }

  filteredBooks = [...books];
  document.getElementById('book-form').reset();
  document.getElementById('book-rating').value = '4.5';
  renderAll();
  showToast(t('saved'));
}

function toggleDark() {
  isDark = !isDark;
  document.body.classList.toggle('dark', isDark);
  localStorage.setItem('arm_dark', isDark ? '1' : '0');
  document.getElementById('dark-btn').textContent = isDark ? '☀️' : '🌙';
}

function toggleLangMenu(forceClose = false) {
  const menu = document.getElementById('lang-menu');
  if (!menu) return;
  if (forceClose) menu.classList.add('hidden');
  else menu.classList.toggle('hidden');
}

function toggleMobileMenu() {
  document.getElementById('mobile-menu').classList.toggle('show');
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'all .25s ease';
    setTimeout(() => toast.remove(), 260);
  }, 2600);
}

function emptyState() {
  return `<div class="card" style="padding:22px;color:var(--text-muted)">${t('empty')}</div>`;
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;'
  }[char]));
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.toggle('dark', isDark);
  document.getElementById('dark-btn').textContent = isDark ? '☀️' : '🌙';
  setLang(curLang);
  document.getElementById('login-form').addEventListener('submit', doLogin);
  document.getElementById('book-form').addEventListener('submit', saveBook);
  document.getElementById('search-input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') searchBooks();
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.lang-wrap')) toggleLangMenu(true);
  });
  books = [...demoBooks];
  filteredBooks = [...books];
  renderAll();
});
