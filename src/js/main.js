/* ===========================================================================
   Josephine Shen — site behaviour
   ---------------------------------------------------------------------------
   All visible text lives in ../content/content.json. This file only reads from
   that JSON and wires the interactions: language toggle (EN / 中), the
   expanding accordion lists (Themes / Artefacts / Projects), and the font-load
   gate. To change wording, edit content.json — not this file.
   =========================================================================== */

   import content from '../content/content.json';
   import '../styles/main.css';
   import './bg.js';   /* +bg : background shader (self-initialising) */

   const { ui, contact, themes, artefacts, projects } = content;

   /* current language — starts in English, persists in localStorage */
   let lang = 'en';
   try { lang = localStorage.getItem('lang') || 'en'; } catch (e) {}

   /* ---- helpers ------------------------------------------------------------- */
   const t = (entry) => (entry && entry[lang] != null ? entry[lang] : '');

   /* Build one accordion <li>. `item` has {title, venue, yr?, hot?, url?, body}.
      The .drop-body is clipped with max-height:0 in CSS; the open height is
      measured and applied as an inline pixel value by wireDropdowns(). */
   function dropItem(item) {
     const li = document.createElement('li');
     const hot = item.hot ? ' is-hot' : '';
     const yr = item.yr ? `<span class="yr">${item.yr}</span>` : '';
     const more = item.url
       ? `<a class="more" href="${item.url}">${lang === 'zh' ? '阅读全文 →' : 'Read in full →'}</a>`
       : '';
     li.innerHTML = `
       <button class="tag tag-drop${hot}" type="button" aria-expanded="false">
         <span class="tag-text">${t(item.title)}</span>
         <span class="venue">${t(item.venue)}</span>
         ${yr}
         <span class="drop-mark" aria-hidden="true">＋</span>
       </button>
       <div class="drop-body">
         <div class="drop-inner">
           <p>${t(item.body)}</p>
           ${more}
         </div>
       </div>`;
     return li;
   }

   function renderList(id, items) {
     const ol = document.getElementById(id);
     if (!ol) return;
     ol.innerHTML = '';
     items.forEach((it) => ol.appendChild(dropItem(it)));
   }

   /* Wire accordion open/close. One row open at a time across the whole page.
      Open = measure the body's natural height and set it as max-height (px);
      close = set max-height back to 0. A single measured property animating at
      a single speed — no fighting between competing transitions/units. */
   function wireDropdowns() {
     const buttons = Array.from(document.querySelectorAll('.tag-drop'));

     const close = (btn) => {
       btn.setAttribute('aria-expanded', 'false');
       const body = btn.nextElementSibling;
       if (body && body.classList.contains('drop-body')) body.style.maxHeight = '0px';
     };
     const open = (btn) => {
       btn.setAttribute('aria-expanded', 'true');
       const body = btn.nextElementSibling;
       if (body && body.classList.contains('drop-body')) {
         body.style.maxHeight = `${body.scrollHeight}px`;
       }
     };

     buttons.forEach((btn) => {
       btn.addEventListener('click', () => {
         const willOpen = btn.getAttribute('aria-expanded') !== 'true';
         buttons.forEach(close);          // collapse everything first
         if (willOpen) open(btn);         // then expand the clicked one
       });
     });
   }

   /* ---- apply a language --------------------------------------------------- */
   function setLang(next) {
     lang = next;
     document.documentElement.lang = lang === 'zh' ? 'zh' : 'en';
     document.title = t(content.siteTitle);

     const meta = document.querySelector('meta[name="description"]');
     if (meta) meta.setAttribute('content', t(content.metaDescription));

     // fixed [data-i18n] text. SVG <text> nodes don't take innerHTML reliably,
     // so use textContent for those (their content is plain text anyway).
     document.querySelectorAll('[data-i18n]').forEach((el) => {
       const key = el.getAttribute('data-i18n');
       if (!ui[key] || ui[key][lang] == null) return;
       const val = ui[key][lang];
       if (el instanceof SVGElement) el.textContent = val.replace(/<[^>]*>/g, '');
       else el.innerHTML = val;
     });

     // section marginalia (CSS reads .row[data-marg]::after { content: attr(data-marg) })
     document.querySelectorAll('[data-marg-key]').forEach((el) => {
       const key = el.getAttribute('data-marg-key');
       if (ui[key] && ui[key][lang] != null) el.setAttribute('data-marg', ui[key][lang]);
     });

     // email (static, but label text depends on nothing — fill href + text)
     document.querySelectorAll('[data-email]').forEach((el) => {
       el.textContent = contact.email;
       if (el.tagName === 'A') el.setAttribute('href', `mailto:${contact.email}`);
     });

     // re-render the lists in the new language, then re-wire (this also wipes
     // any inline max-height, since the <li>s are rebuilt — all start closed)
     renderList('themesList', themes);
     renderList('artefactsList', artefacts);
     renderList('projectsList', projects);
     wireDropdowns();

     // toggle button state
     const btn = document.getElementById('langToggle');
     btn.querySelector('.seg.en').classList.toggle('on', lang === 'en');
     btn.querySelector('.seg.zh').classList.toggle('on', lang === 'zh');

     try { localStorage.setItem('lang', lang); } catch (e) {}
   }

   /* ---- boot --------------------------------------------------------------- */
   function init() {
     setLang(lang);

     document.getElementById('langToggle').addEventListener('click', () => {
       setLang(lang === 'en' ? 'zh' : 'en');
     });

     // reveal once fonts are ready (avoids fallback-font reflow); safety net at 2s
     let revealed = false;
     const reveal = () => {
       if (revealed) return;
       revealed = true;
       document.body.classList.remove('fonts-loading');
     };
     if (document.fonts && document.fonts.ready) {
       document.fonts.ready.then(reveal);
     }
     setTimeout(reveal, 2000);
   }

   if (document.readyState === 'loading') {
     document.addEventListener('DOMContentLoaded', init);
   } else {
     init();
   }