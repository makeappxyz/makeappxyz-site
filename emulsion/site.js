(() => {
  const data = window.EMULSION_SITE;
  const select = document.querySelector('#language');
  const support = document.body.dataset.page === 'support';
  const storageKey = 'emulsion.language';
  const $ = selector => document.querySelector(selector);
  function normalizeLanguage(value) {
    if (typeof value !== 'string') return null;
    const tag = value.trim().replaceAll('_', '-').toLowerCase();
    const parts = tag.split('-');
    if (parts[0] === 'zh') {
      if (parts.includes('hant')) return 'zh-Hant';
      if (parts.includes('hans')) return 'zh-Hans';
      return parts.some(part => ['tw', 'hk', 'mo'].includes(part)) ? 'zh-Hant' : 'zh-Hans';
    }
    return { ja: 'ja', en: 'en-US', ko: 'ko', fr: 'fr-FR', de: 'de-DE', es: 'es-ES' }[parts[0]] || null;
  }
  function savedLanguage() {
    try { return localStorage.getItem(storageKey); } catch { return null; }
  }
  function rememberLanguage(value) {
    try { localStorage.setItem(storageKey, value); } catch { /* Storage may be disabled. */ }
  }
  function preferredLanguage() {
    const choices = [new URLSearchParams(location.search).get('lang'), savedLanguage(),
      ...(navigator.languages || [navigator.language])];
    for (const choice of choices) {
      const language = normalizeLanguage(choice);
      if (language && Object.hasOwn(data, language)) return language;
    }
    return 'ja';
  }
  let locale = preferredLanguage();
  function paragraph(text) {
    const p = document.createElement('p');
    p.textContent = text;
    return p;
  }
  function renderEditorial(c) {
    const article = $('#description');
    const notice = $('#catalog-preview');
    if (notice) notice.textContent = c.previewNote;
    const fragment = document.createDocumentFragment();
    const lede = paragraph(c.paragraphs[0]);
    lede.className = 'story-lede';
    fragment.append(lede);
    const samples = [
      ['cherry-mint.jpg', 'MINT 400', 1600, 1066],
      ['tower-midnight.jpg', 'MIDNIGHT 400', 1600, 1066],
      ['plane-ridge.jpg', 'RIDGE 100', 1600, 1200]
    ];
    samples.forEach(([file, stock, width, height], index) => {
      const section = document.createElement('section');
      section.className = 'story story-' + index;
      const text = document.createElement('div');
      text.className = 'story-copy';
      const heading = document.createElement('h2');
      const parts = c.paragraphs[index + 1].split('\n');
      if (parts.length > 1) parts.shift();
      heading.textContent = c.display.headings[index];
      text.append(heading, paragraph(parts.join('\n')));
      const figure = document.createElement('figure');
      const image = document.createElement('img');
      image.src = '/emulsion/assets/' + file;
      image.width = width; image.height = height;
      image.alt = c.display.imageAlts[index + 1]; image.loading = 'lazy'; image.decoding = 'async';
      const caption = document.createElement('figcaption');
      caption.textContent = stock + ' · EMULSION';
      figure.append(image, caption);
      section.append(text, figure);
      fragment.append(section);
    });
    const club = document.createElement('section');
    club.className = 'club';
    const heading = document.createElement('h2');
    heading.textContent = 'Emulsion Club';
    const parts = c.paragraphs[4].split('\n');
    if (parts.length > 1) parts.shift();
    const text = document.createElement('div');
    text.append(paragraph(parts.join('\n')), paragraph(c.paragraphs[5]));
    club.append(heading, text);
    fragment.append(club);
    article.replaceChildren(fragment);
  }
  function render() {
    const c = data[locale], u = c.ui;
    select.setAttribute('aria-label', c.display.language);
    document.querySelector('meta[name="description"]').content = support ? u[3] : c.promo;
    document.documentElement.lang = locale;
    select.value = locale;
    document.title = (support ? u[1] : c.title) + ' — Emulsion';
    $('#title').textContent = support ? u[1] : c.display.heroTitle;
    $('#intro').textContent = support ? u[3] : c.promo;
    $('#support-link').textContent = u[1];
    $('#support-link').href = '/emulsion/support.html?lang=' + locale;
    $('#privacy-link').textContent = u[5];
    $('#terms-link').textContent = u[6];
    $('.brand').href = '/emulsion/?lang=' + locale;
    if (support) {
      $('#contact-label').textContent = u[2];
      $('#about-link').textContent = u[7];
      $('#about-link').href = '/emulsion/?lang=' + locale;
    } else {
      $('#app-store-link span').textContent = c.display.appStore;
      $('#explore-link span').textContent = c.display.explore;
      $('#nav-samples').textContent = c.display.explore;
      $('#closing').textContent = c.display.closing;
      const masthead = $('.masthead span');
      masthead.style.whiteSpace = 'pre-line';
      masthead.textContent = c.display.masthead;
      $('.hero-photo img').alt = c.display.imageAlts[0];
      $('.hero-photo figcaption span:last-child').textContent = c.display.sample;
      $('#release-status').textContent = u[4] + ' · iPhone / iPad';
      if ($('#description').hasAttribute('data-editorial')) renderEditorial(c);
      else $('#description').replaceChildren(...c.paragraphs.map(paragraph));
    }
  }
  select.addEventListener('change', () => {
    locale = select.value;
    rememberLanguage(locale);
    render();
    const url = new URL(location.href);
    url.searchParams.set('lang', locale);
    history.replaceState(null, '', url);
  });
  window.addEventListener('popstate', () => {
    locale = preferredLanguage();
    render();
  });
  render();
})();
