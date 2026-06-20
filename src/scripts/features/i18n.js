/**
 * i18n.js — Hệ thống đa ngôn ngữ FR / EN
 * Cơ chế: data-i18n="key" trên element → dùng key để tra bản dịch.
 * Ngôn ngữ lưu trong localStorage('lang'), mặc định 'fr'.
 */

export const translations = {
  fr: {
    // Nav
    'nav.home':    'ACCUEIL',
    'nav.menu':    'LA CARTE DES METS',
    'nav.gallery': 'GALERIE',
    'nav.about':   'À PROPOS',

    // Hero
    'hero.eyebrow':  'Genève · Cuisine de Hong Kong · depuis 1996',
    'hero.tagline':  'La vraie cuisine Chinois, au fil des saisons.',
    'hero.cta.menu': 'Voir la carte',

    // Hours strip
    'hours.eyebrow': 'Bienvenue',
    'hours.title':   "Horaires d'ouverture",
    'hours.desc':    'Une table vous attend, midi et soir, sept jours sur sept. Réservez par téléphone\u00a0:',
    'hours.mon': 'Lundi',
    'hours.tue': 'Mardi',
    'hours.wed': 'Mercredi',
    'hours.thu': 'Jeudi',
    'hours.fri': 'Vendredi',
    'hours.sat': 'Samedi',
    'hours.sun': 'Dimanche',

    // Slider
    'slider.title': 'La carte des mets',
    'slider.menus':   'Menus',
    'slider.entrees': 'Entrées',
    'slider.dimsum':  'Dim Sum',
    'slider.potages': 'Potages et soupes',
    'slider.poulet':  'Poulet',
    'slider.boeuf':   'Bœuf',

    // Takeaway
    'takeaway.eyebrow': 'À emporter',
    'takeaway.title':   'Restaurant Les 4 Saisons, chez vous',
    'takeaway.desc':    'Commandez à emporter et savourez nos plats à la maison.',

    // About teaser
    'about.eyebrow': 'Notre histoire',
    'about.title':   'Une histoire de famille',
    'about.desc':    "Après être arrivés de Hong Kong en 1991, les frères Chung ont travaillé quelques années dans plusieurs restaurants chinois de la région genevoise avant d'ouvrir leur propre établissement. C'est en 1996 que l'histoire du restaurant Les 4 Saisons commence…",
    'about.btn':     'Plus sur Les 4 Saisons',

    // About page
    'about.page.eyebrow':  'Notre philosophie',
    'about.page.title':    'Une histoire de famille',
    'about.page.p1':       "Notre philosophie est simple : proposer une cuisine chinoise authentique, avec un accent particulier sur les saveurs de Hong Kong. Nous nous laissons guider par les saisons pour vous offrir des plats spéciaux, toujours faits maison avec des produits d'une fraîcheur irréprochable.",
    'about.page.p2':       "Plus qu'un simple repas, nous souhaitons vous offrir une expérience. Laissez-vous séduire par notre cuisine et l'ambiance chaleureuse de notre établissement.",
    'about.hours.title':   "Horaires d'ouverture",
    'about.contact.title': 'Contacter Les 4 Saisons',
    'about.form.title':    'Réserver une table…',
    'about.form.nom':      'Nom',
    'about.form.prenom':   'Prénom',
    'about.form.email':    'E-mail',
    'about.form.objet':    'Objet de la réservation',
    'about.form.message':  'Message…',
    'about.form.submit':   'Envoyer',
    'about.notice.title':  'Fonctionnalité indisponible',
    'about.notice.desc':   "La réservation en ligne est actuellement en cours de mise à jour. Pour réserver une table, veuillez nous contacter directement au numéro de téléphone suivant :",

    // Gallery page
    'gallery.title': 'Galerie',
    'gallery.sub':   'Un aperçu de nos plats et de notre ambiance',

    // Footer
    'footer.follow':  'Suivez-nous',
    'footer.privacy': 'Politique de confidentialité',
    'footer.credit':  'Réalisé par Cain',

    // 404
    '404.title': 'Page introuvable',
    '404.desc':  "La page que vous cherchez n'existe pas ou a été déplacée.",
    '404.btn':   "Retour à l'accueil",
  },

  en: {
    // Nav
    'nav.home':    'HOME',
    'nav.menu':    'OUR MENU',
    'nav.gallery': 'GALLERY',
    'nav.about':   'ABOUT US',

    // Hero
    'hero.eyebrow':  'Geneva · Hong Kong Cuisine · since 1996',
    'hero.tagline':  'Authentic Chinese cuisine, with the seasons.',
    'hero.cta.menu': 'View the menu',

    // Hours strip
    'hours.eyebrow': 'Welcome',
    'hours.title':   'Opening Hours',
    'hours.desc':    'A table awaits you, at lunch and dinner, seven days a week. Book by phone:',
    'hours.mon': 'Monday',
    'hours.tue': 'Tuesday',
    'hours.wed': 'Wednesday',
    'hours.thu': 'Thursday',
    'hours.fri': 'Friday',
    'hours.sat': 'Saturday',
    'hours.sun': 'Sunday',

    // Slider
    'slider.title': 'Our menu',
    'slider.menus':   'Set menus',
    'slider.entrees': 'Starters',
    'slider.dimsum':  'Dim Sum',
    'slider.potages': 'Soups',
    'slider.poulet':  'Chicken',
    'slider.boeuf':   'Beef',

    // Takeaway
    'takeaway.eyebrow': 'Takeaway',
    'takeaway.title':   'Restaurant Les 4 Saisons, at home',
    'takeaway.desc':    'Order takeaway and enjoy our dishes at home.',

    // About teaser
    'about.eyebrow': 'Our story',
    'about.title':   'A family story',
    'about.desc':    'After arriving from Hong Kong in 1991, the Chung brothers worked for several years in various Chinese restaurants in the Geneva area before opening their own establishment. It was in 1996 that the story of restaurant Les 4 Saisons began…',
    'about.btn':     'More about Les 4 Saisons',

    // About page
    'about.page.eyebrow':  'Our philosophy',
    'about.page.title':    'A family story',
    'about.page.p1':       'Our philosophy is simple: to offer authentic Chinese cuisine, with a particular focus on the flavours of Hong Kong. We are guided by the seasons to bring you special dishes, always home-made with the freshest ingredients.',
    'about.page.p2':       'More than just a meal, we want to offer you an experience. Let yourself be charmed by our cuisine and the warm atmosphere of our restaurant.',
    'about.hours.title':   'Opening Hours',
    'about.contact.title': 'Contact Les 4 Saisons',
    'about.form.title':    'Book a table…',
    'about.form.nom':      'Last name',
    'about.form.prenom':   'First name',
    'about.form.email':    'E-mail',
    'about.form.objet':    'Subject',
    'about.form.message':  'Message…',
    'about.form.submit':   'Send',
    'about.notice.title':  'Feature unavailable',
    'about.notice.desc':   'Online booking is currently being updated. To reserve a table, please contact us directly by phone:',

    // Gallery page
    'gallery.title': 'Gallery',
    'gallery.sub':   'A glimpse of our dishes and atmosphere',

    // Footer
    'footer.follow':  'Follow us',
    'footer.privacy': 'Privacy policy',
    'footer.credit':  'Made by Cain',

    // 404
    '404.title': 'Page not found',
    '404.desc':  'The page you are looking for does not exist or has been moved.',
    '404.btn':   'Back to home',
  },
};

/** Lấy ngôn ngữ hiện tại từ localStorage, mặc định 'fr' */
export function getLang() {
  try { return localStorage.getItem('lang') || 'fr'; } catch { return 'fr'; }
}

/** Lưu ngôn ngữ và áp dụng lên trang */
export function setLang(lang) {
  try { localStorage.setItem('lang', lang); } catch {}
  applyLang(lang);
}

/** Áp dụng bản dịch lên tất cả element có data-i18n */
export function applyLang(lang) {
  const t = translations[lang] || translations.fr;
  document.documentElement.setAttribute('lang', lang);

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (!t[key]) return;
    // input/textarea dùng placeholder
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = t[key];
    } else {
      el.textContent = t[key];
    }
  });

  // Cập nhật aria-label nút toggle
  const btn = document.getElementById('lang-toggle');
  if (btn) btn.setAttribute('aria-label', lang === 'fr' ? 'Switch to English' : 'Passer en français');

  // Cập nhật trạng thái active cho 2 nút FR / EN
  document.querySelectorAll('[data-lang-btn]').forEach((b) => {
    b.classList.toggle('active', b.dataset.langBtn === lang);
  });
}

/** Khởi tạo — gọi 1 lần khi DOM ready */
export function initI18n() {
  const lang = getLang();
  applyLang(lang);

  // Gắn sự kiện cho nút FR / EN
  document.querySelectorAll('[data-lang-btn]').forEach((btn) => {
    btn.addEventListener('click', () => setLang(btn.dataset.langBtn));
  });
}
