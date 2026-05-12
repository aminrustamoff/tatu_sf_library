// ═══════════════════════════════════════════════════════
//  TATUSF ARM · script.js
//  Fully integrated with Django REST API
// ═══════════════════════════════════════════════════════

const API_BASE = '/api';
let authToken = localStorage.getItem('authToken') || null;

// ─── API HELPERS ────────────────────────────────────────

function getHeaders(json = true) {
  const h = {};
  if (authToken) h['Authorization'] = `Token ${authToken}`;
  if (json) h['Content-Type'] = 'application/json';
  return h;
}

async function apiGet(url) {
  const res = await fetch(`${API_BASE}${url}`, { headers: getHeaders(false) });
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
  return res.json();
}

async function apiPost(url, data) {
  const res = await fetch(`${API_BASE}${url}`, {
    method: 'POST', headers: getHeaders(), body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `POST ${url} → ${res.status}`);
  }
  return res.json();
}

async function apiPatch(url, data) {
  const res = await fetch(`${API_BASE}${url}`, {
    method: 'PATCH', headers: getHeaders(), body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`PATCH ${url} → ${res.status}`);
  return res.json();
}

async function apiDelete(url) {
  const res = await fetch(`${API_BASE}${url}`, {
    method: 'DELETE', headers: getHeaders(false)
  });
  if (!res.ok) throw new Error(`DELETE ${url} → ${res.status}`);
  return res.status === 204 ? null : res.json();
}

async function apiFormData(url, formData, method = 'POST') {
  const h = {};
  if (authToken) h['Authorization'] = `Token ${authToken}`;
  const res = await fetch(`${API_BASE}${url}`, { method, headers: h, body: formData });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(Object.values(err).flat().join(' ') || `${method} ${url} → ${res.status}`);
  }
  return res.json();
}

// ─── I18N ───────────────────────────────────────────────

const LANGS = {
  uz: {
    login_subtitle: 'Axborot markazi ekotizimi',
    hemis_id: 'HEMIS ID', password: 'Parol', login: 'Kirish', logout: 'Chiqish',
    nav_main: 'Bosh', nav_catalog: 'Katalog', nav_profile: 'Profil', nav_admin: 'Admin',
    hero_sub: 'Kitoblar katalogi, o\'quvchi profili va admin boshqaruvi uchun yengil platforma.',
    search_placeholder: 'Kitob, muallif yoki kategoriya qidiring', search: 'Qidirish',
    stats_books: 'Kitoblar', stats_users: 'Foydalanuvchilar', stats_avail: 'Mavjudlik',
    recent_books: 'So\'nggi kitoblar', see_all: 'Barchasini ko\'rish',
    results: 'ta natija', add_book: 'Kitob qo\'shish', filter: 'Filter',
    category: 'Kategoriya', format: 'Format', all: 'Barchasi',
    sort: 'Saralash', sort_new: 'Yangi', sort_rating: 'Reyting', sort_title: 'Nom bo\'yicha',
    back_catalog: 'Katalogga qaytish', focus_mode: 'Fokus', download: '⬇ Yuklab olish',
    student_profile: 'Talaba profili', admin_profile: 'Administrator',
    tab_progress: 'O\'qish jarayoni', tab_notes: 'Izohlar', tab_notifs: 'Bildirishnomalar',
    tab_books: 'Kitoblar', tab_users: 'Foydalanuvchilar',
    reading_progress: 'O\'qish jarayoni', current_page: 'Joriy sahifa',
    total_pages: 'Jami sahifalar', save_progress: 'Jarayonni saqlash',
    my_notes: 'Izohlarim', note_placeholder: 'Izoh yozing...',
    add_note: 'Izoh qo\'shish', save_note: 'Saqlash',
    add_note_for: 'Yangi izoh', for_book: 'Kitob (ixtiyoriy)',
    mark_all_read: 'Barchasini o\'qildi deb belgilash',
    admin_title: 'Admin panel', admin_sub: 'Kitoblar va foydalanuvchilarni boshqarish',
    title: 'Sarlavha', author: 'Muallif', year: 'Yil', rating: 'Reyting',
    description: 'Tavsif', save: 'Saqlash', cancel: 'Bekor qilish',
    current_books: 'Joriy kitoblar', cover_image: 'Muqova rasmi',
    book_file: 'Kitob fayli (PDF/EPUB/MP3)', refresh: 'Yangilash',
    edit: 'Tahrir', delete: 'O\'chirish', make_admin: 'Admin qil',
    remove_admin: 'Adminlikni olib qo\'y', deactivate: 'Bloklash', activate: 'Faollashtirish',
    login_error: 'Login yoki parol noto\'g\'ri', login_ok: 'Xush kelibsiz!',
    saved: 'Kitob saqlandi', updated: 'Kitob yangilandi', deleted: 'O\'chirildi',
    progress_saved: 'Jarayon saqlandi', note_saved: 'Izoh saqlandi',
    note_deleted: 'Izoh o\'chirildi', confirm_delete: 'Rostdan ham o\'chirishni xohlaysizmi?',
    empty: 'Ma\'lumot topilmadi', no_file: 'Fayl mavjud emas',
    unread: 'O\'qilmagan', read_mark: 'O\'qildi deb belgilash',
    pages: 'sahifa', of: 'dan', joined: 'Ro\'yxatdan o\'tgan',
    books_read: 'Kitob o\'qilgan', notes_written: 'Izoh yozilgan',
  },
  ru: {
    login_subtitle: 'Экосистема информационного центра',
    hemis_id: 'HEMIS ID', password: 'Пароль', login: 'Войти', logout: 'Выйти',
    nav_main: 'Главная', nav_catalog: 'Каталог', nav_profile: 'Профиль', nav_admin: 'Админ',
    hero_sub: 'Лёгкая платформа для каталога книг, профиля читателя и административной панели.',
    search_placeholder: 'Поиск по книге, автору или категории', search: 'Поиск',
    stats_books: 'Книги', stats_users: 'Пользователи', stats_avail: 'Доступность',
    recent_books: 'Новые книги', see_all: 'Смотреть все',
    results: 'результатов', add_book: 'Добавить книгу', filter: 'Фильтр',
    category: 'Категория', format: 'Формат', all: 'Все',
    sort: 'Сортировка', sort_new: 'Новые', sort_rating: 'Рейтинг', sort_title: 'По названию',
    back_catalog: 'Назад к каталогу', focus_mode: 'Фокус', download: '⬇ Скачать',
    student_profile: 'Профиль студента', admin_profile: 'Администратор',
    tab_progress: 'Прогресс чтения', tab_notes: 'Заметки', tab_notifs: 'Уведомления',
    tab_books: 'Книги', tab_users: 'Пользователи',
    reading_progress: 'Прогресс чтения', current_page: 'Текущая страница',
    total_pages: 'Всего страниц', save_progress: 'Сохранить прогресс',
    my_notes: 'Мои заметки', note_placeholder: 'Напишите заметку...',
    add_note: 'Добавить заметку', save_note: 'Сохранить',
    add_note_for: 'Новая заметка', for_book: 'Книга (необязательно)',
    mark_all_read: 'Отметить все как прочитанные',
    admin_title: 'Админ-панель', admin_sub: 'Управление книгами и пользователями',
    title: 'Название', author: 'Автор', year: 'Год', rating: 'Рейтинг',
    description: 'Описание', save: 'Сохранить', cancel: 'Отмена',
    current_books: 'Текущие книги', cover_image: 'Обложка',
    book_file: 'Файл книги (PDF/EPUB/MP3)', refresh: 'Обновить',
    edit: 'Изменить', delete: 'Удалить', make_admin: 'Сделать админом',
    remove_admin: 'Убрать права', deactivate: 'Заблокировать', activate: 'Активировать',
    login_error: 'Неверный логин или пароль', login_ok: 'Добро пожаловать!',
    saved: 'Книга сохранена', updated: 'Книга обновлена', deleted: 'Удалено',
    progress_saved: 'Прогресс сохранён', note_saved: 'Заметка сохранена',
    note_deleted: 'Заметка удалена', confirm_delete: 'Вы уверены, что хотите удалить?',
    empty: 'Ничего не найдено', no_file: 'Файл недоступен',
    unread: 'Не прочитано', read_mark: 'Отметить прочитанным',
    pages: 'стр.', of: 'из', joined: 'Зарегистрирован',
    books_read: 'Книг читается', notes_written: 'Заметок написано',
  },
  en: {
    login_subtitle: 'Information center ecosystem',
    hemis_id: 'HEMIS ID', password: 'Password', login: 'Login', logout: 'Logout',
    nav_main: 'Home', nav_catalog: 'Catalog', nav_profile: 'Profile', nav_admin: 'Admin',
    hero_sub: 'A lightweight platform for book catalog, reader profile and admin management.',
    search_placeholder: 'Search by book, author or category', search: 'Search',
    stats_books: 'Books', stats_users: 'Users', stats_avail: 'Availability',
    recent_books: 'Recent books', see_all: 'See all',
    results: 'results', add_book: 'Add book', filter: 'Filter',
    category: 'Category', format: 'Format', all: 'All',
    sort: 'Sort', sort_new: 'Newest', sort_rating: 'Rating', sort_title: 'By title',
    back_catalog: 'Back to catalog', focus_mode: 'Focus', download: '⬇ Download',
    student_profile: 'Student profile', admin_profile: 'Administrator',
    tab_progress: 'Reading progress', tab_notes: 'Notes', tab_notifs: 'Notifications',
    tab_books: 'Books', tab_users: 'Users',
    reading_progress: 'Reading progress', current_page: 'Current page',
    total_pages: 'Total pages', save_progress: 'Save progress',
    my_notes: 'My notes', note_placeholder: 'Write a note...',
    add_note: 'Add note', save_note: 'Save',
    add_note_for: 'New note', for_book: 'Book (optional)',
    mark_all_read: 'Mark all as read',
    admin_title: 'Admin panel', admin_sub: 'Manage books and users',
    title: 'Title', author: 'Author', year: 'Year', rating: 'Rating',
    description: 'Description', save: 'Save', cancel: 'Cancel',
    current_books: 'Current books', cover_image: 'Cover image',
    book_file: 'Book file (PDF/EPUB/MP3)', refresh: 'Refresh',
    edit: 'Edit', delete: 'Delete', make_admin: 'Make admin',
    remove_admin: 'Remove admin', deactivate: 'Deactivate', activate: 'Activate',
    login_error: 'Invalid username or password', login_ok: 'Welcome!',
    saved: 'Book saved', updated: 'Book updated', deleted: 'Deleted',
    progress_saved: 'Progress saved', note_saved: 'Note saved',
    note_deleted: 'Note deleted', confirm_delete: 'Are you sure you want to delete?',
    empty: 'No data found', no_file: 'File not available',
    unread: 'Unread', read_mark: 'Mark as read',
    pages: 'pages', of: 'of', joined: 'Joined',
    books_read: 'Books in progress', notes_written: 'Notes written',
  }
};

let curLang    = localStorage.getItem('arm_lang') || 'uz';
let isDark     = localStorage.getItem('arm_dark') === '1';
let books      = [];
let filteredBooks = [];
let currentBook   = null;
let currentUser   = null;
let readerFont    = 17;
let isAdmin       = false;
let editingBookId = null;

function t(key) {
  return (LANGS[curLang] && LANGS[curLang][key]) || LANGS.uz[key] || key;
}

function setLang(lang) {
  curLang = lang;
  localStorage.setItem('arm_lang', lang);
  document.documentElement.lang = lang;
  const labels = { uz: 'UZ', ru: 'RU', en: 'EN' };
  const lbl = document.getElementById('lang-label');
  if (lbl) lbl.textContent = labels[lang] || 'UZ';

  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
  });
  renderCatalog();
  renderAdminBooks();
}

// ─── AUTH ───────────────────────────────────────────────

async function doLogin(event) {
  if (event) event.preventDefault();
  const username = document.getElementById('login-id')?.value.trim();
  const password = document.getElementById('login-password')?.value.trim();
  const btn = document.getElementById('login-btn');
  if (btn) { btn.disabled = true; btn.textContent = '...'; }

  try {
    const res = await fetch(`${API_BASE}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) { showToast(t('login_error')); return; }

    authToken = data.token;
    localStorage.setItem('authToken', data.token);

    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    showToast(t('login_ok'));
    await initApp();

  } catch (e) {
    showToast(t('login_error'));
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = t('login'); }
  }
}

function doLogout() {
  authToken = null;
  currentUser = null;
  isAdmin = false;
  localStorage.removeItem('authToken');
  books = [];
  filteredBooks = [];
  document.getElementById('main-app').classList.add('hidden');
  document.getElementById('login-page').classList.remove('hidden');
  document.getElementById('login-id').value = '';
  document.getElementById('login-password').value = '';
}

// ─── INIT ───────────────────────────────────────────────

async function initApp() {
  await loadCurrentUser();
  await loadBooks();
  renderStats();
  renderRecentBooks();
  renderCatalog();
  renderAdminBooks();
  loadProfileData();
  showPage('main');
}

// ─── CURRENT USER ───────────────────────────────────────

async function loadCurrentUser() {
  if (!authToken) { isAdmin = false; updateAdminUI(); return; }
  try {
    currentUser = await apiGet('/auth/user/');
    isAdmin = !!currentUser.is_admin;
    updateAdminUI();
    updateProfileCard();
    updateNotifBadge(currentUser.unread_notifications || 0);
    // Update stat-users only for admins (total user count)
    if (isAdmin) {
      const users = await apiGet('/auth/users/').catch(() => null);
      if (users) {
        const el = document.getElementById('stat-users');
        if (el) el.textContent = users.length;
      }
    }
  } catch (e) {
    isAdmin = false;
    updateAdminUI();
  }
}

function updateAdminUI() {
  document.querySelectorAll('.admin-only').forEach(el => {
    el.classList.toggle('hidden', !isAdmin);
  });
  if (!isAdmin) {
    const ap = document.getElementById('page-admin');
    if (ap && !ap.classList.contains('hidden')) showPage('main');
  }
}

function updateProfileCard() {
  if (!currentUser) return;
  const name = [currentUser.first_name, currentUser.last_name].filter(Boolean).join(' ') || currentUser.username;
  const nameEl = document.getElementById('profile-name');
  if (nameEl) nameEl.textContent = name;

  const roleEl = document.getElementById('profile-role');
  if (roleEl) roleEl.textContent = currentUser.is_admin ? t('admin_profile') : t('student_profile');

  const xp = (currentUser.progress_count || 0) * 250 + (currentUser.notes_count || 0) * 50;
  const xpEl = document.getElementById('badge-xp');
  if (xpEl) xpEl.textContent = `🏆 ${xp} XP`;

  const booksEl = document.getElementById('badge-books');
  if (booksEl) booksEl.textContent = `📚 ${currentUser.progress_count || 0} ${t('books_read')}`;

  // Populate note book select
  populateNoteBookSelect();
}

function updateNotifBadge(count) {
  const dot = document.getElementById('notif-dot');
  const badge = document.getElementById('badge-notif');
  if (dot) dot.classList.toggle('hidden', count === 0);
  if (badge) {
    badge.classList.toggle('hidden', count === 0);
    badge.textContent = `🔔 ${count}`;
  }
}

// ─── BOOKS ──────────────────────────────────────────────

async function loadBooks() {
  try {
    const data = await apiGet('/books/');
    const list = Array.isArray(data) ? data : (data.results || []);
    books = list.map(normalizeBook);
    filteredBooks = [...books];
  } catch (e) {
    showToast('Kitoblarni yuklashda xatolik');
  }
}

function normalizeBook(b) {
  return {
    id:          b.id || 0,
    title:       b.title || '',
    author:      b.author || '',
    year:        Number(b.year) || new Date().getFullYear(),
    category:    b.category || b.cat || 'IT',
    format:      b.format || b.fmt || 'PDF',
    rating:      Number(b.rating) || 0,
    citations:   Number(b.citations || b.cit) || 0,
    description: b.description || '',
    cover_url:   b.cover_url || null,
    file_url:    b.file_url || null,
    created_at:  b.created_at || '',
  };
}

function formatLabel(fmt) {
  const map = { PDF: 'PDF', EPUB: 'EPUB', AUDIO: '🎧 Audio' };
  return map[fmt] || fmt;
}

function bookCard(book) {
  const b = normalizeBook(book);
  const coverHtml = b.cover_url
    ? `<div class="book-cover" style="background-image:url('${b.cover_url}');background-size:cover;background-position:center;"></div>`
    : `<div class="book-cover book-cover-placeholder">📖</div>`;

  const dlIcon = b.file_url
    ? `<a class="btn-dl" href="${escHtml(b.file_url)}" target="_blank" download onclick="event.stopPropagation()" title="${t('download')}">⬇</a>`
    : '';

  return `
    <article class="card book-card" onclick="openBook(${b.id})">
      ${coverHtml}
      <div class="book-card-body">
        <h3>${escHtml(b.title)}</h3>
        <p class="book-author">${escHtml(b.author)} · ${b.year}</p>
        <div class="book-meta">
          <span class="badge badge-primary">${escHtml(b.category)}</span>
          <span class="badge badge-fmt">${formatLabel(b.format)}</span>
        </div>
        <div class="book-footer">
          <strong class="book-rating">⭐ ${b.rating.toFixed(1)}</strong>
          ${dlIcon}
        </div>
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
  const grid  = document.getElementById('catalog-grid');
  const count = document.getElementById('catalog-count');
  if (count) count.textContent = filteredBooks.length;
  if (grid) grid.innerHTML = filteredBooks.map(bookCard).join('') || emptyState();
}

function renderStats() {
  const el = document.getElementById('stat-books');
  if (el) el.textContent = books.length;
}

function applyFilters() {
  const cat  = document.getElementById('filter-category')?.value;
  const fmt  = document.getElementById('filter-format')?.value;
  const sort = document.getElementById('sort-books')?.value;

  filteredBooks = books.filter(book => {
    const b = normalizeBook(book);
    const catOk = !cat || cat === 'all' || b.category === cat;
    const fmtOk = !fmt || fmt === 'all' || b.format === fmt;
    return catOk && fmtOk;
  });

  if (sort === 'rating') filteredBooks.sort((a, b) => b.rating - a.rating);
  if (sort === 'new')    filteredBooks.sort((a, b) => b.year - a.year);
  if (sort === 'title')  filteredBooks.sort((a, b) => a.title.localeCompare(b.title));

  renderCatalog();
}

function searchBooks() {
  const query = document.getElementById('search-input')?.value.trim().toLowerCase() || '';
  showPage('catalog');
  filteredBooks = books.filter(b => {
    return [b.title, b.author, b.category, b.format].some(v => String(v).toLowerCase().includes(query));
  });
  renderCatalog();
}

// ─── READER ─────────────────────────────────────────────

async function openBook(id) {
  const raw = books.find(b => Number(b.id) === Number(id));
  if (!raw) return;
  currentBook = normalizeBook(raw);

  document.getElementById('reader-title').textContent = currentBook.title;
  document.getElementById('reader-meta').textContent  = `${currentBook.author} · ${currentBook.year} · ${currentBook.category}`;
  document.getElementById('reader-format').textContent = formatLabel(currentBook.format);
  document.getElementById('reader-category-badge').textContent = currentBook.category;

  // Download button
  const dlBtn = document.getElementById('reader-download-btn');
  if (dlBtn) {
    if (currentBook.file_url) {
      dlBtn.href = currentBook.file_url;
      dlBtn.classList.remove('hidden');
    } else {
      dlBtn.classList.add('hidden');
    }
  }

  // Cover background
  const card = document.getElementById('reader-card');
  if (currentBook.cover_url && card) {
    card.style.setProperty('--reader-cover', `url('${currentBook.cover_url}')`);
  }

  // Description
  document.getElementById('reader-text').innerHTML = `
    <p>${escHtml(currentBook.description || 'Tavsif mavjud emas.')}</p>
  `;

  // Load existing reading progress
  try {
    const progressList = await apiGet('/progress/');
    const mine = (Array.isArray(progressList) ? progressList : (progressList.results || []))
      .find(p => Number(p.book) === Number(currentBook.id));
    if (mine) {
      document.getElementById('prog-current').value = mine.current_page;
      document.getElementById('prog-total').value   = mine.total_pages;
    } else {
      document.getElementById('prog-current').value = 1;
      document.getElementById('prog-total').value   = 100;
    }
  } catch (_) {}

  // Load notes for this book
  await loadReaderNotes(currentBook.id);

  showPage('reader');
}

async function saveReadingProgress() {
  if (!currentBook) return;
  const current = parseInt(document.getElementById('prog-current').value) || 1;
  const total   = parseInt(document.getElementById('prog-total').value)   || 100;
  try {
    await apiPost('/progress/update_progress/', {
      book: currentBook.id,
      current_page: current,
      total_pages: total
    });
    showToast(t('progress_saved'));
    if (currentUser) {
      currentUser.progress_count = (currentUser.progress_count || 0) + 1;
      updateProfileCard();
    }
  } catch (e) {
    showToast(e.message || 'Xatolik');
  }
}

async function loadReaderNotes(bookId) {
  const container = document.getElementById('reader-notes');
  if (!container) return;
  try {
    const data = await apiGet('/notes/');
    const notes = (Array.isArray(data) ? data : (data.results || []))
      .filter(n => Number(n.book) === Number(bookId));
    renderNotesList(notes, container, true);
  } catch (_) {
    container.innerHTML = '';
  }
}

async function addNoteForCurrentBook() {
  if (!currentBook) return;
  const input = document.getElementById('reader-note-input');
  const text  = input?.value.trim();
  if (!text) return;
  try {
    await apiPost('/notes/', { book: currentBook.id, text });
    input.value = '';
    showToast(t('note_saved'));
    await loadReaderNotes(currentBook.id);
  } catch (e) {
    showToast(e.message || 'Xatolik');
  }
}

// ─── PROFILE DATA ────────────────────────────────────────

async function loadProfileData() {
  await Promise.all([
    loadReadingProgress(),
    loadUserNotes(),
    loadNotifications(),
  ]);
}

async function loadReadingProgress() {
  const container = document.getElementById('profile-progress');
  if (!container) return;
  container.innerHTML = '<div class="loading-state">⏳</div>';
  try {
    const data = await apiGet('/progress/');
    const list = Array.isArray(data) ? data : (data.results || []);
    if (!list.length) { container.innerHTML = emptyState(); return; }

    container.innerHTML = list.map(p => {
      const bookTitle = getBookTitle(p.book);
      const pct = Math.round(Math.min(100, (p.current_page / Math.max(1, p.total_pages)) * 100));
      return `
        <div class="card progress-item">
          <div class="progress-item-header">
            <strong>${escHtml(bookTitle)}</strong>
            <span class="progress-pct">${pct}%</span>
          </div>
          <div class="progress-bar-wrap">
            <div class="progress"><div style="width:${pct}%"></div></div>
          </div>
          <p class="progress-pages">${p.current_page} ${t('of')} ${p.total_pages} ${t('pages')}</p>
          <button class="btn-ghost btn-sm" onclick="openBook(${p.book})">📖 ${t('back_catalog')}</button>
        </div>
      `;
    }).join('');
  } catch (_) {
    container.innerHTML = emptyState();
  }
}

async function loadUserNotes() {
  const container = document.getElementById('profile-notes');
  if (!container) return;
  container.innerHTML = '<div class="loading-state">⏳</div>';
  try {
    const data = await apiGet('/notes/');
    const notes = Array.isArray(data) ? data : (data.results || []);
    renderNotesList(notes, container, false);
  } catch (_) {
    container.innerHTML = emptyState();
  }
}

function renderNotesList(notes, container, compact = false) {
  if (!notes.length) { container.innerHTML = emptyState(); return; }
  container.innerHTML = notes.map(n => {
    const bookTitle = n.book ? getBookTitle(n.book) : '';
    const date = n.created_at ? new Date(n.created_at).toLocaleDateString() : '';
    return `
      <div class="note-item card">
        ${bookTitle ? `<span class="badge badge-primary note-book-badge">📖 ${escHtml(bookTitle)}</span>` : ''}
        <p class="note-text">${escHtml(n.text)}</p>
        <div class="note-footer">
          <span class="muted note-date">${date}</span>
          <button class="btn-danger-sm" onclick="deleteNote(${n.id})" title="${t('delete')}">🗑</button>
        </div>
      </div>
    `;
  }).join('');
}

async function addNote() {
  const textEl  = document.getElementById('note-text-input');
  const bookEl  = document.getElementById('note-book-select');
  const text    = textEl?.value.trim();
  const bookId  = bookEl?.value || null;
  if (!text) return;
  try {
    const payload = { text };
    if (bookId) payload.book = Number(bookId);
    await apiPost('/notes/', payload);
    textEl.value = '';
    showToast(t('note_saved'));
    if (currentUser) {
      currentUser.notes_count = (currentUser.notes_count || 0) + 1;
      updateProfileCard();
    }
    await loadUserNotes();
  } catch (e) {
    showToast(e.message || 'Xatolik');
  }
}

async function deleteNote(id) {
  try {
    await apiDelete(`/notes/${id}/`);
    showToast(t('note_deleted'));
    await loadUserNotes();
  } catch (e) {
    showToast(e.message || 'Xatolik');
  }
}

async function loadNotifications() {
  const container = document.getElementById('profile-notifs');
  if (!container) return;
  container.innerHTML = '<div class="loading-state">⏳</div>';
  try {
    const data = await apiGet('/notifications/');
    const notifs = Array.isArray(data) ? data : (data.results || []);
    const unread = notifs.filter(n => !n.is_read).length;
    updateNotifBadge(unread);

    if (!notifs.length) { container.innerHTML = emptyState(); return; }
    container.innerHTML = notifs.map(n => {
      const date = n.created_at ? new Date(n.created_at).toLocaleDateString() : '';
      return `
        <div class="notif-item card ${n.is_read ? 'notif-read' : 'notif-unread'}">
          <div class="notif-content">
            ${!n.is_read ? `<span class="unread-dot" title="${t('unread')}"></span>` : ''}
            <p>${escHtml(n.text)}</p>
          </div>
          <div class="notif-footer">
            <span class="muted">${date}</span>
            ${!n.is_read ? `<button class="btn-ghost btn-sm" onclick="markRead(${n.id})">${t('read_mark')}</button>` : ''}
          </div>
        </div>
      `;
    }).join('');
  } catch (_) {
    container.innerHTML = emptyState();
  }
}

async function markRead(id) {
  try {
    await apiPatch(`/notifications/${id}/`, { is_read: true });
    await loadNotifications();
  } catch (_) {}
}

async function markAllRead() {
  try {
    await fetch(`${API_BASE}/notifications/mark_all_read/`, {
      method: 'PATCH',
      headers: getHeaders(false)
    });
    await loadNotifications();
  } catch (_) {}
}

// ─── ADMIN: BOOKS ────────────────────────────────────────

async function saveBook(event) {
  event.preventDefault();
  const id     = document.getElementById('editing-book-id')?.value;
  const title  = document.getElementById('book-title').value.trim();
  const author = document.getElementById('book-author').value.trim();
  const year   = document.getElementById('book-year').value;
  if (!title || !author || !year) return;

  const fd = new FormData();
  fd.append('title',       title);
  fd.append('author',      author);
  fd.append('year',        year);
  fd.append('category',    document.getElementById('book-category').value);
  fd.append('format',      document.getElementById('book-format').value);
  fd.append('rating',      document.getElementById('book-rating').value || '4.5');
  fd.append('description', document.getElementById('book-description').value.trim());

  const coverFile = document.getElementById('book-cover')?.files?.[0];
  const bookFile  = document.getElementById('book-file')?.files?.[0];
  if (coverFile) fd.append('cover', coverFile);
  if (bookFile)  fd.append('file',  bookFile);

  try {
    let saved;
    if (id) {
      saved = await apiFormData(`/books/${id}/`, fd, 'PATCH');
      showToast(t('updated'));
    } else {
      saved = await apiFormData('/books/', fd, 'POST');
      showToast(t('saved'));
    }
    const norm = normalizeBook(saved);
    if (id) {
      const idx = books.findIndex(b => b.id === norm.id);
      if (idx !== -1) books[idx] = norm;
    } else {
      books.unshift(norm);
    }
    filteredBooks = [...books];
    cancelEdit();
    renderStats();
    renderRecentBooks();
    renderCatalog();
    renderAdminBooks();
  } catch (e) {
    showToast(e.message || 'Xatolik');
  }
}

function startEditBook(id) {
  const b = books.find(b => b.id === id);
  if (!b) return;
  editingBookId = id;
  document.getElementById('editing-book-id').value = id;
  document.getElementById('book-title').value       = b.title;
  document.getElementById('book-author').value      = b.author;
  document.getElementById('book-year').value        = b.year;
  document.getElementById('book-category').value    = b.category;
  document.getElementById('book-format').value      = b.format;
  document.getElementById('book-rating').value      = b.rating;
  document.getElementById('book-description').value = b.description;

  const formTitle = document.getElementById('book-form-title');
  if (formTitle) formTitle.textContent = t('edit') + ': ' + b.title;
  const cancelBtn = document.getElementById('cancel-edit-btn');
  if (cancelBtn) cancelBtn.classList.remove('hidden');
  const saveBtn = document.getElementById('book-save-btn');
  if (saveBtn) saveBtn.textContent = t('save');

  // Show file hints
  const coverHint = document.getElementById('cover-hint');
  const fileHint  = document.getElementById('file-hint');
  if (coverHint) coverHint.textContent = b.cover_url ? '✓ Mavjud' : '';
  if (fileHint)  fileHint.textContent  = b.file_url  ? '✓ Mavjud' : '';

  document.getElementById('book-form').scrollIntoView({ behavior: 'smooth' });
  switchAdminTab('books');
}

function cancelEdit() {
  editingBookId = null;
  document.getElementById('editing-book-id').value = '';
  document.getElementById('book-form').reset();
  document.getElementById('book-rating').value = '4.5';
  const formTitle = document.getElementById('book-form-title');
  if (formTitle) formTitle.textContent = t('add_book');
  const cancelBtn = document.getElementById('cancel-edit-btn');
  if (cancelBtn) cancelBtn.classList.add('hidden');
  const coverHint = document.getElementById('cover-hint');
  const fileHint  = document.getElementById('file-hint');
  if (coverHint) coverHint.textContent = '';
  if (fileHint)  fileHint.textContent  = '';
}

async function deleteBook(id) {
  if (!confirm(t('confirm_delete'))) return;
  try {
    await apiDelete(`/books/${id}/`);
    books = books.filter(b => b.id !== id);
    filteredBooks = filteredBooks.filter(b => b.id !== id);
    showToast(t('deleted'));
    renderStats();
    renderRecentBooks();
    renderCatalog();
    renderAdminBooks();
  } catch (e) {
    showToast(e.message || 'Xatolik');
  }
}

function renderAdminBooks() {
  const el = document.getElementById('admin-books');
  if (!el) return;
  if (!books.length) { el.innerHTML = emptyState(); return; }

  const rows = books.map(b => `
    <tr>
      <td>
        ${b.cover_url ? `<img class="cover-thumb" src="${b.cover_url}" alt="" />` : '<span class="cover-thumb-placeholder">📖</span>'}
        ${escHtml(b.title)}
      </td>
      <td>${escHtml(b.author)}</td>
      <td>${b.year}</td>
      <td><span class="badge badge-primary">${escHtml(b.category)}</span></td>
      <td>${formatLabel(b.format)}</td>
      <td>⭐ ${(b.rating || 0).toFixed(1)}</td>
      <td>
        ${b.file_url ? `<a class="btn-ghost btn-sm" href="${escHtml(b.file_url)}" target="_blank" download>⬇</a>` : ''}
      </td>
      <td class="action-cell">
        <button class="btn-outline btn-sm" onclick="startEditBook(${b.id})">${t('edit')}</button>
        <button class="btn-danger-sm" onclick="deleteBook(${b.id})">${t('delete')}</button>
      </td>
    </tr>
  `).join('');

  el.innerHTML = `
    <table class="book-table">
      <thead>
        <tr>
          <th>${t('title')}</th>
          <th>${t('author')}</th>
          <th>${t('year')}</th>
          <th>${t('category')}</th>
          <th>${t('format')}</th>
          <th>${t('rating')}</th>
          <th>📎</th>
          <th></th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

// ─── ADMIN: USERS ────────────────────────────────────────

async function loadUsers() {
  const el = document.getElementById('admin-users');
  if (!el) return;
  el.innerHTML = '<div class="loading-state">⏳</div>';
  try {
    const users = await apiGet('/auth/users/');
    if (!users.length) { el.innerHTML = emptyState(); return; }

    const rows = users.map(u => `
      <tr class="${!u.is_active ? 'row-inactive' : ''}">
        <td>
          <strong>${escHtml(u.username)}</strong>
          ${u.is_superuser ? '<span class="badge badge-super">👑</span>' : ''}
        </td>
        <td>${escHtml(u.email || '—')}</td>
        <td>${u.books_count || 0}</td>
        <td>${u.notes_count || 0}</td>
        <td>
          <span class="status-dot ${u.is_staff ? 'dot-admin' : ''}">
            ${u.is_staff ? '🛠 Admin' : '👤 Talaba'}
          </span>
        </td>
        <td>
          <span class="status-dot ${u.is_active ? 'dot-active' : 'dot-inactive'}">
            ${u.is_active ? '✅' : '🚫'}
          </span>
        </td>
        <td class="action-cell">
          ${!u.is_superuser ? `
            <button class="btn-outline btn-sm" onclick="toggleUserAdmin(${u.id}, ${u.is_staff})">
              ${u.is_staff ? t('remove_admin') : t('make_admin')}
            </button>
            <button class="btn-danger-sm" onclick="toggleUserActive(${u.id}, ${u.is_active})">
              ${u.is_active ? t('deactivate') : t('activate')}
            </button>
          ` : '<span class="muted">—</span>'}
        </td>
      </tr>
    `).join('');

    el.innerHTML = `
      <table class="book-table">
        <thead>
          <tr>
            <th>${t('hemis_id')}</th>
            <th>Email</th>
            <th>${t('books_read')}</th>
            <th>${t('notes_written')}</th>
            <th>Rol</th>
            <th>Holat</th>
            <th></th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  } catch (e) {
    el.innerHTML = `<div class="card" style="padding:18px;color:var(--error)">${e.message}</div>`;
  }
}

async function toggleUserAdmin(userId, currentIsAdmin) {
  try {
    await apiPatch(`/auth/users/${userId}/`, { is_staff: !currentIsAdmin });
    showToast(t('updated'));
    await loadUsers();
  } catch (e) {
    showToast(e.message || 'Xatolik');
  }
}

async function toggleUserActive(userId, currentIsActive) {
  if (!confirm(t('confirm_delete'))) return;
  try {
    await apiPatch(`/auth/users/${userId}/`, { is_active: !currentIsActive });
    showToast(t('updated'));
    await loadUsers();
  } catch (e) {
    showToast(e.message || 'Xatolik');
  }
}

// ─── UI: PAGES & TABS ────────────────────────────────────

const PAGES = ['main', 'catalog', 'reader', 'profile', 'admin', 'ai'];

function showPage(page) {
  if (page === 'admin' && !isAdmin) { page = 'main'; }
  PAGES.forEach(p => document.getElementById(`page-${p}`)?.classList.add('hidden'));
  document.getElementById(`page-${page}`)?.classList.remove('hidden');
  document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
  document.getElementById(`nl-${page}`)?.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Lazy load per-page data
  if (page === 'profile') loadProfileData();
  if (page === 'admin' && isAdmin) {
    renderAdminBooks();
    // Load users only when users tab is active
  }
}

function switchTab(name) {
  document.querySelectorAll('#page-profile .tab-panel').forEach(p => p.classList.add('hidden'));
  document.getElementById(`tab-${name}`)?.classList.remove('hidden');
  document.querySelectorAll('#page-profile .tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === name);
  });
}

function switchAdminTab(name) {
  document.querySelectorAll('#page-admin .tab-panel').forEach(p => p.classList.add('hidden'));
  document.getElementById(`admin-tab-${name}`)?.classList.remove('hidden');
  document.querySelectorAll('#page-admin .tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.admintab === name);
  });
  if (name === 'users') loadUsers();
}

// ─── UI: MISC ────────────────────────────────────────────

function changeReaderFont(delta) {
  readerFont = Math.max(14, Math.min(24, readerFont + delta));
  document.documentElement.style.setProperty('--reader-font', `${readerFont}px`);
}

function toggleFocusMode() {
  document.body.classList.toggle('focus-mode');
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
  document.getElementById('mobile-menu')?.classList.toggle('show');
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
  }, 2800);
}

function emptyState() {
  return `<div class="empty-state"><span>🔍</span><p>${t('empty')}</p></div>`;
}

function getBookTitle(bookId) {
  const b = books.find(b => Number(b.id) === Number(bookId));
  return b ? b.title : `#${bookId}`;
}

function populateNoteBookSelect() {
  const sel = document.getElementById('note-book-select');
  if (!sel) return;
  const opts = books.map(b => `<option value="${b.id}">${escHtml(b.title)}</option>`).join('');
  sel.innerHTML = `<option value="">— ${curLang === 'ru' ? 'Общая заметка' : curLang === 'en' ? 'General note' : 'Umumiy izoh'} —</option>${opts}`;
}

function escHtml(value) {
  return String(value || '').replace(/[&<>'"]/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;'
  }[c]));
}

// ─── BOOT ────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.toggle('dark', isDark);
  document.getElementById('dark-btn').textContent = isDark ? '☀️' : '🌙';
  setLang(curLang);

  document.getElementById('login-form').addEventListener('submit', doLogin);
  document.getElementById('book-form')?.addEventListener('submit', saveBook);
  document.getElementById('search-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') searchBooks();
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.lang-wrap')) toggleLangMenu(true);
  });

  // File input hints
  document.getElementById('book-cover')?.addEventListener('change', e => {
    const f = e.target.files?.[0];
    const hint = document.getElementById('cover-hint');
    if (hint && f) hint.textContent = f.name;
  });
  document.getElementById('book-file')?.addEventListener('change', e => {
    const f = e.target.files?.[0];
    const hint = document.getElementById('file-hint');
    if (hint && f) hint.textContent = f.name;
  });

  // If token exists, auto-login
  if (authToken) {
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    initApp();
  }
});
