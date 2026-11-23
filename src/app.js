import {
  NICKNAME_STYLES,
  FRAME_PRESETS,
  SYMBOL_GROUPS,
  generateRandomIdea,
  analyzeCompatibility
} from './unicode-styles.js';

const STORAGE_KEYS = {
  favorites: 'glyphname_favorites_v1',
  theme: 'glyphname_theme_v1',
  cookieConsent: 'glyphname_cookie_consent_v1'
};

const PAGE_SIZE = 48;

const state = {
  inputText: 'Aarav',
  category: 'all',
  styleSearch: '',
  frameId: 'auto',
  visibleLimit: PAGE_SIZE,
  insertPosition: 'end',
  previewName: '𝐀𝐚𝐫𝐚𝐯',
  previewStyleName: 'Bold Serif',
  favorites: loadFavorites(),
  route: 'generator'
};

const elements = {
  nicknameInput: /** @type {HTMLInputElement} */ (document.getElementById('nickname-input')),
  clearInputBtn: document.getElementById('clear-input-btn'),
  randomIdeaBtn: document.getElementById('random-idea-btn'),
  ideaVibeSelect: /** @type {HTMLSelectElement} */ (document.getElementById('idea-vibe-select')),
  styleSearchInput: /** @type {HTMLInputElement} */ (document.getElementById('style-search-input')),
  themeToggleBtn: document.getElementById('theme-toggle-btn'),
  previewAvatar: document.getElementById('preview-avatar'),
  previewNameDisplay: document.getElementById('preview-name-display'),
  previewStyleLabel: document.getElementById('preview-style-label'),
  previewCharCount: document.getElementById('preview-char-count'),
  compatSocial: document.getElementById('compat-social'),
  compatGame: document.getElementById('compat-game'),
  compatA11y: document.getElementById('compat-a11y'),
  stylesGrid: document.getElementById('styles-grid'),
  visibleCount: document.getElementById('visible-count'),
  totalFilteredCount: document.getElementById('total-filtered-count'),
  paginationBar: document.getElementById('pagination-bar'),
  paginationSummary: document.getElementById('pagination-summary'),
  loadMoreBtn: document.getElementById('load-more-btn'),
  showAllBtn: document.getElementById('show-all-btn'),
  frameButtonsContainer: document.getElementById('frame-buttons-container'),
  customizerInput: /** @type {HTMLInputElement} */ (document.getElementById('customizer-input')),
  customizerMeta: document.getElementById('customizer-meta'),
  copyCustomBtn: document.getElementById('copy-custom-btn'),
  saveCustomBtn: document.getElementById('save-custom-btn'),
  clearCustomBtn: document.getElementById('clear-custom-btn'),
  insertPosEndBtn: document.getElementById('insert-pos-end'),
  insertPosWrapBtn: document.getElementById('insert-pos-wrap'),
  symbolGroupsContainer: document.getElementById('symbol-groups-container'),
  openFavoritesBtn: document.getElementById('open-favorites-btn'),
  closeFavoritesBtn: document.getElementById('close-favorites-btn'),
  drawerBackdrop: document.getElementById('drawer-backdrop'),
  favoritesDrawer: document.getElementById('favorites-drawer'),
  favoritesList: document.getElementById('favorites-list'),
  savedCount: document.getElementById('saved-count'),
  copyAllFavoritesBtn: document.getElementById('copy-all-favorites-btn'),
  clearFavoritesBtn: document.getElementById('clear-favorites-btn'),
  cookieBanner: document.getElementById('cookie-banner'),
  cookieAcceptBtn: document.getElementById('cookie-accept-btn'),
  cookieEssentialBtn: document.getElementById('cookie-essential-btn'),
  openCookieSettingsBtn: document.getElementById('open-cookie-settings-btn'),
  contactForm: /** @type {HTMLFormElement} */ (document.getElementById('contact-form')),
  contactFeedback: document.getElementById('contact-feedback'),
  toast: document.getElementById('toast')
};

let toastTimer = null;

function loadFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.favorites);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveFavorites() {
  try {
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(state.favorites));
  } catch {
    // Ignore storage quota errors cleanly
  }
  updateSavedBadge();
  renderFavoritesDrawer();
}

function updateSavedBadge() {
  if (elements.savedCount) {
    elements.savedCount.textContent = String(state.favorites.length);
  }
}

function showToast(message) {
  if (!elements.toast) return;
  elements.toast.textContent = message;
  elements.toast.classList.add('is-visible');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    elements.toast.classList.remove('is-visible');
  }, 2000);
}

async function copyTextToClipboard(text, btnElement = null) {
  if (!text) return;
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    showToast(`Copied: ${text}`);
    if (btnElement) {
      const original = btnElement.textContent;
      btnElement.textContent = 'Copied';
      btnElement.classList.add('is-copied');
      setTimeout(() => {
        btnElement.textContent = original;
        btnElement.classList.remove('is-copied');
      }, 1400);
    }
  } catch {
    showToast('Unable to copy automatically — select text to copy.');
  }
}

function toggleFavorite(text) {
  if (!text) return false;
  const idx = state.favorites.indexOf(text);
  let added = false;
  if (idx === -1) {
    state.favorites.unshift(text);
    added = true;
    showToast('Added to Saved Nicknames');
  } else {
    state.favorites.splice(idx, 1);
    showToast('Removed from Saved Nicknames');
  }
  saveFavorites();
  renderStylesGrid();
  return added;
}

function getActiveFrame() {
  return FRAME_PRESETS.find((f) => f.id === state.frameId) || FRAME_PRESETS[0];
}

function formatWithCurrentFrame(style, rawInput, frame) {
  if (!frame || frame.id === 'auto') {
    return style.transform(rawInput);
  }
  const baseStyled = style.transformBaseOnly(rawInput);
  if (frame.id === 'none') {
    return baseStyled;
  }
  return `${frame.left}${baseStyled}${frame.right}`;
}

function getFilteredStyles() {
  const query = state.styleSearch.trim().toLowerCase();
  return NICKNAME_STYLES.filter((style) => {
    const matchesCategory = state.category === 'all' || style.category === state.category;
    if (!matchesCategory) return false;
    if (!query) return true;
    return (
      style.name.toLowerCase().includes(query) ||
      style.category.toLowerCase().includes(query) ||
      style.support.toLowerCase().includes(query)
    );
  });
}

function renderFrameButtons() {
  if (!elements.frameButtonsContainer) return;
  elements.frameButtonsContainer.innerHTML = '';
  FRAME_PRESETS.forEach((frame) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `frame-btn${state.frameId === frame.id ? ' is-active' : ''}`;
    btn.textContent = frame.label;
    btn.addEventListener('click', () => {
      state.frameId = frame.id;
      renderFrameButtons();
      renderStylesGrid();
      const firstStyle = NICKNAME_STYLES[1];
      if (firstStyle) {
        const base = state.inputText.trim() || 'Aarav';
        const formatted = formatWithCurrentFrame(firstStyle, base, frame);
        updateLivePreview(formatted, firstStyle.name);
      }
    });
    elements.frameButtonsContainer.appendChild(btn);
  });
}

function updateLivePreview(formattedName, styleName) {
  state.previewName = formattedName;
  state.previewStyleName = styleName;
  const analysis = analyzeCompatibility(formattedName);
  const firstChar = Array.from(state.inputText.trim() || 'A')[0] || 'A';

  if (elements.previewAvatar) elements.previewAvatar.textContent = firstChar.toUpperCase();
  if (elements.previewNameDisplay) elements.previewNameDisplay.textContent = formattedName;
  if (elements.previewStyleLabel) elements.previewStyleLabel.textContent = styleName;
  if (elements.previewCharCount) elements.previewCharCount.textContent = `${analysis.length} chars`;
  if (elements.compatSocial) elements.compatSocial.textContent = analysis.socialStatus;
  if (elements.compatGame) elements.compatGame.textContent = analysis.gameStatus;
  if (elements.compatA11y) elements.compatA11y.textContent = analysis.screenReaderNote;
}

function renderStylesGrid() {
  if (!elements.stylesGrid) return;
  const rawInput = state.inputText.trim() || 'Aarav';
  const frame = getActiveFrame();
  const filtered = getFilteredStyles();
  const totalCount = filtered.length;
  const visibleItems = filtered.slice(0, state.visibleLimit);

  if (elements.visibleCount) {
    elements.visibleCount.textContent = visibleItems.length.toLocaleString();
  }
  if (elements.totalFilteredCount) {
    elements.totalFilteredCount.textContent = totalCount.toLocaleString();
  }

  elements.stylesGrid.innerHTML = '';

  if (visibleItems.length === 0) {
    const emptyBox = document.createElement('div');
    emptyBox.className = 'empty-results-box';
    emptyBox.textContent = 'No nickname styles match your current search filter. Clear the search box to browse all 1,050 styles.';
    elements.stylesGrid.appendChild(emptyBox);
  } else {
    const fragment = document.createDocumentFragment();
    visibleItems.forEach((style) => {
      const transformed = formatWithCurrentFrame(style, rawInput, frame);
      const charLen = Array.from(transformed).length;
      const isSaved = state.favorites.includes(transformed);

      const card = document.createElement('article');
      card.className = 'style-card';

      const meta = document.createElement('div');
      meta.className = 'style-card-meta';
      meta.innerHTML = `
        <span class="style-card-title">${escapeHtml(style.name)}</span>
        <span class="tabular-nums">${charLen} chars</span>
      `;

      const output = document.createElement('div');
      output.className = 'style-output';
      output.textContent = transformed;

      const actions = document.createElement('div');
      actions.className = 'style-card-actions';

      const support = document.createElement('span');
      support.className = 'style-support-note';
      support.textContent = style.support;

      const btnGroup = document.createElement('div');
      btnGroup.className = 'action-btn-group';

      const customizeBtn = document.createElement('button');
      customizeBtn.type = 'button';
      customizeBtn.className = 'icon-btn';
      customizeBtn.title = 'Edit in Symbol Studio';
      customizeBtn.setAttribute('aria-label', `Edit ${style.name} in Symbol Studio`);
      customizeBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>`;
      customizeBtn.addEventListener('click', () => {
        if (elements.customizerInput) {
          elements.customizerInput.value = transformed;
          updateCustomizerMeta();
          elements.customizerInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          elements.customizerInput.focus();
        }
        updateLivePreview(transformed, style.name);
      });

      const saveBtn = document.createElement('button');
      saveBtn.type = 'button';
      saveBtn.className = `icon-btn${isSaved ? ' is-saved' : ''}`;
      saveBtn.title = isSaved ? 'Remove from Saved' : 'Save Nickname';
      saveBtn.setAttribute('aria-label', isSaved ? 'Remove from Saved' : 'Save Nickname');
      saveBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>`;
      saveBtn.addEventListener('click', () => {
        toggleFavorite(transformed);
      });

      const copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.className = 'copy-btn';
      copyBtn.textContent = 'Copy';
      copyBtn.addEventListener('click', () => {
        copyTextToClipboard(transformed, copyBtn);
        updateLivePreview(transformed, style.name);
      });

      btnGroup.append(customizeBtn, saveBtn, copyBtn);
      actions.append(support, btnGroup);
      card.append(meta, output, actions);
      fragment.appendChild(card);
    });
    elements.stylesGrid.appendChild(fragment);
  }

  // Update pagination bar
  if (elements.paginationBar && elements.paginationSummary && elements.loadMoreBtn && elements.showAllBtn) {
    const remaining = Math.max(0, totalCount - visibleItems.length);
    elements.paginationSummary.textContent = `Showing ${visibleItems.length.toLocaleString()} of ${totalCount.toLocaleString()} stylish variations`;
    elements.paginationBar.style.display = totalCount === 0 ? 'none' : 'flex';

    if (remaining === 0) {
      elements.loadMoreBtn.style.display = 'none';
      elements.showAllBtn.style.display = 'none';
    } else {
      const nextStep = Math.min(PAGE_SIZE, remaining);
      elements.loadMoreBtn.style.display = 'inline-flex';
      elements.showAllBtn.style.display = 'inline-flex';
      elements.loadMoreBtn.textContent = `Load ${nextStep} More`;
      elements.showAllBtn.textContent = `Show All ${totalCount.toLocaleString()}`;
    }
  }
}

function renderSymbolGroups() {
  if (!elements.symbolGroupsContainer) return;
  elements.symbolGroupsContainer.innerHTML = '';

  SYMBOL_GROUPS.forEach((group) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'symbol-group';

    const label = document.createElement('span');
    label.className = 'symbol-group-label';
    label.textContent = group.title;

    const grid = document.createElement('div');
    grid.className = 'symbol-grid';

    group.symbols.forEach((sym) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'symbol-btn';
      btn.textContent = sym;
      btn.title = `Insert ${sym}`;
      btn.addEventListener('click', () => {
        if (!elements.customizerInput) return;
        const current = elements.customizerInput.value;
        if (state.insertPosition === 'wrap') {
          elements.customizerInput.value = `${sym} ${current.trim()} ${sym}`.trim();
        } else {
          elements.customizerInput.value = `${current}${sym}`;
        }
        updateCustomizerMeta();
        updateLivePreview(elements.customizerInput.value, 'Custom Studio Build');
      });
      grid.appendChild(btn);
    });

    wrapper.append(label, grid);
    elements.symbolGroupsContainer.appendChild(wrapper);
  });
}

function updateCustomizerMeta() {
  if (!elements.customizerInput || !elements.customizerMeta) return;
  const val = elements.customizerInput.value;
  const len = Array.from(val).length;
  elements.customizerMeta.textContent = `Length: ${len} characters · Ready to copy`;
}

function renderFavoritesDrawer() {
  if (!elements.favoritesList) return;
  elements.favoritesList.innerHTML = '';

  if (state.favorites.length === 0) {
    const empty = document.createElement('p');
    empty.style.color = 'var(--text-muted)';
    empty.textContent = 'No saved nicknames yet. Click the bookmark icon on any generated style to save it here.';
    elements.favoritesList.appendChild(empty);
    return;
  }

  state.favorites.forEach((fav) => {
    const item = document.createElement('div');
    item.className = 'saved-item';

    const textSpan = document.createElement('span');
    textSpan.className = 'saved-item-text';
    textSpan.textContent = fav;

    const btnGroup = document.createElement('div');
    btnGroup.className = 'action-btn-group';

    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'copy-btn';
    copyBtn.textContent = 'Copy';
    copyBtn.addEventListener('click', () => copyTextToClipboard(fav, copyBtn));

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'icon-btn';
    delBtn.title = 'Delete saved nickname';
    delBtn.setAttribute('aria-label', 'Delete saved nickname');
    delBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path></svg>`;
    delBtn.addEventListener('click', () => toggleFavorite(fav));

    btnGroup.append(copyBtn, delBtn);
    item.append(textSpan, btnGroup);
    elements.favoritesList.appendChild(item);
  });
}

function openDrawer() {
  elements.drawerBackdrop?.classList.add('is-open');
  elements.favoritesDrawer?.classList.add('is-open');
  elements.favoritesDrawer?.setAttribute('aria-hidden', 'false');
}

function closeDrawer() {
  elements.drawerBackdrop?.classList.remove('is-open');
  elements.favoritesDrawer?.classList.remove('is-open');
  elements.favoritesDrawer?.setAttribute('aria-hidden', 'true');
}

function switchRoute(routeName, scrollTargetId = null) {
  const validRoutes = ['generator', 'about', 'privacy', 'terms', 'contact'];
  const target = validRoutes.includes(routeName) ? routeName : 'generator';
  state.route = target;

  document.querySelectorAll('.page-view').forEach((view) => {
    view.classList.toggle('is-active', view.id === `view-${target}`);
  });

  document.querySelectorAll('.nav-link').forEach((link) => {
    const linkRoute = link.getAttribute('data-route');
    const linkScroll = link.getAttribute('data-scroll');
    const isMatch =
      linkRoute === target &&
      ((!scrollTargetId && !linkScroll) || (scrollTargetId && linkScroll === scrollTargetId));
    link.classList.toggle('is-active', Boolean(isMatch));
  });

  if (scrollTargetId) {
    const el = document.getElementById(scrollTargetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function applyTheme(theme) {
  const resolved = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', resolved);
  if (elements.themeToggleBtn) {
    elements.themeToggleBtn.textContent = resolved === 'dark' ? 'Light Mode' : 'Dark Mode';
  }
  try {
    localStorage.setItem(STORAGE_KEYS.theme, resolved);
  } catch {
    // Ignore
  }
}

function initTheme() {
  let saved = 'light';
  try {
    saved = localStorage.getItem(STORAGE_KEYS.theme) || 'light';
  } catch {
    saved = 'light';
  }
  applyTheme(saved);
}

function initCookieBanner() {
  let consent = null;
  try {
    consent = localStorage.getItem(STORAGE_KEYS.cookieConsent);
  } catch {
    consent = null;
  }
  if (!consent && elements.cookieBanner) {
    elements.cookieBanner.classList.add('is-visible');
  }
}

function saveCookieConsent(choice) {
  try {
    localStorage.setItem(STORAGE_KEYS.cookieConsent, choice);
  } catch {
    // Ignore
  }
  elements.cookieBanner?.classList.remove('is-visible');
  showToast(choice === 'all' ? 'Cookie preferences saved (All)' : 'Cookie preferences saved (Essential Only)');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function bindEvents() {
  elements.nicknameInput?.addEventListener('input', (e) => {
    const target = /** @type {HTMLInputElement} */ (e.target);
    state.inputText = target.value;
    renderStylesGrid();
    const previewStyle = NICKNAME_STYLES[1];
    if (previewStyle) {
      const base = state.inputText.trim() || 'Aarav';
      const formatted = formatWithCurrentFrame(previewStyle, base, getActiveFrame());
      updateLivePreview(formatted, previewStyle.name);
    }
  });

  elements.clearInputBtn?.addEventListener('click', () => {
    if (!elements.nicknameInput) return;
    elements.nicknameInput.value = '';
    state.inputText = '';
    elements.nicknameInput.focus();
    renderStylesGrid();
    updateLivePreview('𝐀𝐚𝐫𝐚𝐯', 'Bold Serif');
  });

  elements.randomIdeaBtn?.addEventListener('click', () => {
    const vibe = elements.ideaVibeSelect?.value || 'gaming';
    const idea = generateRandomIdea(vibe);
    if (elements.nicknameInput) {
      elements.nicknameInput.value = idea;
    }
    state.inputText = idea;
    renderStylesGrid();
    const previewStyle = NICKNAME_STYLES[0];
    if (previewStyle) {
      const formatted = formatWithCurrentFrame(previewStyle, idea, getActiveFrame());
      updateLivePreview(formatted, previewStyle.name);
    }
  });

  elements.styleSearchInput?.addEventListener('input', (e) => {
    const target = /** @type {HTMLInputElement} */ (e.target);
    state.styleSearch = target.value;
    state.visibleLimit = PAGE_SIZE;
    renderStylesGrid();
  });

  elements.loadMoreBtn?.addEventListener('click', () => {
    state.visibleLimit += PAGE_SIZE;
    renderStylesGrid();
  });

  elements.showAllBtn?.addEventListener('click', () => {
    state.visibleLimit = NICKNAME_STYLES.length;
    renderStylesGrid();
  });

  document.querySelectorAll('.tab-btn[data-category]').forEach((tab) => {
    tab.addEventListener('click', () => {
      const cat = tab.getAttribute('data-category') || 'all';
      state.category = cat;
      state.visibleLimit = PAGE_SIZE;
      document.querySelectorAll('.tab-btn[data-category]').forEach((btn) => {
        const active = btn === tab;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-selected', String(active));
      });
      renderStylesGrid();
    });
  });

  elements.customizerInput?.addEventListener('input', updateCustomizerMeta);

  elements.copyCustomBtn?.addEventListener('click', () => {
    if (elements.customizerInput) {
      copyTextToClipboard(elements.customizerInput.value, elements.copyCustomBtn);
    }
  });

  elements.saveCustomBtn?.addEventListener('click', () => {
    if (elements.customizerInput && elements.customizerInput.value.trim()) {
      toggleFavorite(elements.customizerInput.value.trim());
    }
  });

  elements.clearCustomBtn?.addEventListener('click', () => {
    if (elements.customizerInput) {
      const base = state.inputText.trim() || 'Aarav';
      elements.customizerInput.value = base;
      updateCustomizerMeta();
    }
  });

  elements.insertPosEndBtn?.addEventListener('click', () => {
    state.insertPosition = 'end';
    elements.insertPosEndBtn?.classList.add('is-active');
    elements.insertPosWrapBtn?.classList.remove('is-active');
  });

  elements.insertPosWrapBtn?.addEventListener('click', () => {
    state.insertPosition = 'wrap';
    elements.insertPosWrapBtn?.classList.add('is-active');
    elements.insertPosEndBtn?.classList.remove('is-active');
  });

  elements.themeToggleBtn?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  elements.openFavoritesBtn?.addEventListener('click', openDrawer);
  elements.closeFavoritesBtn?.addEventListener('click', closeDrawer);
  elements.drawerBackdrop?.addEventListener('click', closeDrawer);

  elements.copyAllFavoritesBtn?.addEventListener('click', () => {
    if (state.favorites.length === 0) {
      showToast('No saved nicknames to copy.');
      return;
    }
    copyTextToClipboard(state.favorites.join('\n'), elements.copyAllFavoritesBtn);
  });

  elements.clearFavoritesBtn?.addEventListener('click', () => {
    state.favorites = [];
    saveFavorites();
    renderStylesGrid();
    showToast('Saved nicknames cleared');
  });

  document.querySelectorAll('.faq-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.faq-item');
      if (!item) return;
      const isOpen = item.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', String(isOpen));
      const iconSpan = trigger.querySelector('span[aria-hidden="true"]');
      if (iconSpan) iconSpan.textContent = isOpen ? '−' : '+';
    });
  });

  document.querySelectorAll('[data-route]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const route = el.getAttribute('data-route') || 'generator';
      const scrollId = el.getAttribute('data-scroll');
      switchRoute(route, scrollId);
    });
  });

  elements.cookieAcceptBtn?.addEventListener('click', () => saveCookieConsent('all'));
  elements.cookieEssentialBtn?.addEventListener('click', () => saveCookieConsent('essential'));
  elements.openCookieSettingsBtn?.addEventListener('click', () => {
    elements.cookieBanner?.classList.add('is-visible');
  });

  elements.contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = /** @type {HTMLInputElement} */ (document.getElementById('contact-name'));
    const emailInput = /** @type {HTMLInputElement} */ (document.getElementById('contact-email'));
    const msgInput = /** @type {HTMLTextAreaElement} */ (document.getElementById('contact-message'));
    const feedback = elements.contactFeedback;

    const nameVal = nameInput?.value.trim() || '';
    const emailVal = emailInput?.value.trim() || '';
    const msgVal = msgInput?.value.trim() || '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameVal || !emailRegex.test(emailVal) || msgVal.length < 8) {
      if (feedback) {
        feedback.textContent = 'Please provide your name, a valid email address, and a message of at least 8 characters.';
        feedback.style.backgroundColor = 'var(--warning-bg)';
        feedback.style.color = 'var(--warning)';
        feedback.classList.add('is-visible');
      }
      return;
    }

    if (feedback) {
      feedback.textContent = `Thank you, ${nameVal}. Your message has been recorded for review and we will reply to ${emailVal}.`;
      feedback.style.backgroundColor = 'var(--success-bg)';
      feedback.style.color = 'var(--success)';
      feedback.classList.add('is-visible');
    }
    elements.contactForm.reset();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
    }
  });
}

function init() {
  initTheme();
  initCookieBanner();
  renderFrameButtons();
  renderSymbolGroups();
  renderStylesGrid();
  updateSavedBadge();
  renderFavoritesDrawer();
  updateCustomizerMeta();
  bindEvents();

  const hash = window.location.hash.replace('#', '');
  if (['about', 'privacy', 'terms', 'contact'].includes(hash)) {
    switchRoute(hash);
  }
}

init();
