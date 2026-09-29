/* LET Center prototype script
   - SQ/EN language switch (Albanian text lives in index.html, English in EN below)
   - Mobile menu, CTA topic preselect, contact form validation (front-end only)
   - Scroll reveals (skipped when the visitor prefers reduced motion)
   In WordPress, Polylang replaces the EN dictionary and the form posts to the REST API. See CLAUDE.md. */
(function(){
  /* ------------------------------------------------------------------
     FORM DELIVERY (GitHub Pages is static and cannot send email itself)
     Leave endpoint empty for demo mode (shows success, sends nothing).
     Formspree:  endpoint: 'https://formspree.io/f/XXXXXXXX'
     Web3Forms:  endpoint: 'https://api.web3forms.com/submit',
                 extra: { access_key: 'YOUR-ACCESS-KEY' }
     ------------------------------------------------------------------ */
  var FORM = { endpoint: '', extra: {} };

  var EN = {
    'skip':'Skip to content',
    'addr':'Prishtina, Kosovo',
    'hours':'Monday - Friday, 07:00 - 17:00',
    'nav.programs':'Programs','nav.activities':'Activities','nav.camp':'Summer Camp','nav.gallery':'Gallery','nav.contact':'Contact',
    'cta.enroll':'Enroll your child',
    'hero.chip':'Enrollment is open',
    'hero.title':'Strong roots, branches reaching for dreams.',
    'hero.text':'An education center in Prishtina for children from birth to fifth grade. Personal care, qualified staff and a day full of learning and play.',
    'hero.see':'See our programs',
    'age.03':'0-3 years','age.34':'3-4 years','age.45':'4-5 years','age.56':'5-6 years','age.pre':'Pre-primary 5-6','age.school':'Grades I-V',
    'badge.music':'Music therapy','badge.care':'Pediatrician and psychologist',
    'trust.1t':'Qualified staff','trust.1p':'Dedicated educators for every age group.',
    'trust.2t':'Psychologist sessions','trust.2p':'Support for your child\u2019s emotional development.',
    'trust.3t':'Pediatric checkups','trust.3p':'Regular health checkups at the center.',
    'trust.4t':'MASHT pre-primary','trust.4p':'Full preparation for first grade.',
    'prog.title':'Growing up together with your child',
    'prog.text':'From first steps to fifth grade, every program builds on what your child has already learned.',
    'unit.years':'years','unit.grades':'grades','more':'Learn more',
    'prog.1t':'Nursery','prog.1p':'Gentle care, a calm routine and sensory play for the very first steps.',
    'prog.2t':'Kindergarten','prog.2p':'Making friends, language, music and free play.',
    'prog.3t':'Early learning','prog.3p':'Learning through play: numbers, letters, nature and creativity.',
    'prog.4t':'Pre-primary','prog.4p':'Full preparation for first grade: reading, counting and independence.','prog.tag':'Mandatory under MASHT',
    'prog.5t':'After-school care','prog.5p':'After school: supervised homework and free activities.',
    'act.title':'Every semester, activities that spark curiosity',
    'act.text':'Alongside the daily program, children take part in these activities with specialized coaches and teachers.',
    'act.1t':'Coding and computer science','act.1p':'Programming logic through games and small projects.',
    'act.2t':'Music therapy','act.2p':'Rhythm, songs and instruments for expression and calm.',
    'act.3t':'Chess hour','act.3p':'Focus, patience and strategic thinking from an early age.',
    'act.4t':'English','act.4p':'English through play, songs and everyday conversation.',
    'act.5t':'Gymnastics and karate','act.5p':'Movement, discipline and confidence in every session.',
    'act.6t':'Dance','act.6p':'Coordination, music and lots of joy together.',
    'code.text':'Technology classes where children learn to think like creators: logic, coding games and their first computer projects.',
    'code.t1':'Logic','code.t2':'Coding games','code.t3':'First projects','code.t4':'At summer camp too','code.cta':'Ask about LET Code',
    'camp.title':'A summer full of swimming, English and code',
    'camp.text':'Swimming lessons build confidence and teach children water safety. English becomes a game, and every week we meet future creators in our technology classes.',
    'camp.c1':'Swimming and water safety','camp.c2':'English through play','camp.c3':'LET Code for Kids every week','camp.cta':'Notify me about enrollment',
    'gal.title':'Life at LET','gal.text':'We share our everyday moments on Facebook every week.','gal.cta':'Follow us on Facebook',
    'gal.1':'Autumn party','gal.2':'Chess hour','gal.3':'Gymnastics','gal.4':'Dance',
    'form.title':'Contact us',
    'form.intro':'Questions about our programs or enrollment, or would you like to visit the center? Write to us and we\u2019ll get back to you as soon as possible.',
    'form.topic':'Subject','topic.general':'General question','topic.enroll':'Enrollment','topic.visit':'Visit the center','topic.other':'Other',
    'form.email':'Email','form.email.ph':'name@example.com',
    'form.name':'Full name','form.name.ph':'Your name','form.phone':'Phone number',
    'form.age':'Child\u2019s age (optional)','form.age.ph':'Choose age','form.interest':'I\u2019m interested in','int.full':'Full-day program',
    'form.msg':'Your message','form.msg.ph':'Type your question or message.',
    'form.privacy':'Add your email or phone. We only use your details to reply to you.','form.send':'Send message',
    'form.fail':'Your message could not be sent. Please call us at +383 48 166 143 or email letcenterks@gmail.com.',
    'form.ok':'Thank you! Your message has been sent. We\u2019ll get back to you soon.',
    'foot.about':'Learning Education Tree. An education and care center for children in Prishtina, Kosovo.',
    'foot.p1':'Nursery 0-3 years','foot.p2':'Kindergarten 3-4 years','foot.p3':'Early learning 4-5','foot.p4':'Pre-primary 5-6 years','foot.p5':'After-school care I-V',
    'foot.center':'Center',
    'map.title':'Find us in Prishtina','map.hint':'Click for the full map','map.dir':'Get directions','map.open':'Open in Google Maps','map.open.aria':'Open LET Center\u2019s location in Google Maps','foot.rights':'All rights reserved.','foot.privacy':'Privacy policy',
    'aria.fb':'LET Center on Facebook','aria.ig':'LET Center on Instagram','aria.home':'LET Center, home','aria.nav':'Main navigation','aria.why':'Why LET Center'
  };
  var META = {
    sq:{title:'LET Center | Learning Education Tree, Prishtinë, Kosovë',desc:'LET Center: qendër edukative në Prishtinë, Kosovë, për fëmijë 0-6 vjeç dhe qendrim ditor për klasat I-V.',open:'Hap menunë',close:'Mbyll menunë',errName:'Shkruani emrin dhe mbiemrin.',errContact:'Shkruani një email ose numër telefoni të vlefshëm.',errMsg:'Shkruani mesazhin tuaj.',switchTo:'EN',switchAria:'Switch to English',switchLang:'en'},
    en:{title:'LET Center | Learning Education Tree, Prishtina, Kosovo',desc:'LET Center: an education center in Prishtina, Kosovo, for children aged 0-6 and after-school care for grades I-V.',open:'Open menu',close:'Close menu',errName:'Please enter your full name.',errContact:'Please enter a valid email or phone number.',errMsg:'Please write your message.',switchTo:'SQ',switchAria:'Kalo në shqip',switchLang:'sq'}
  };

  // Capture the Albanian source text straight from the page
  var SQ = {};
  var textEls = document.querySelectorAll('[data-i18n]');
  var phEls = document.querySelectorAll('[data-i18n-ph]');
  var ariaEls = document.querySelectorAll('[data-i18n-aria]');
  textEls.forEach(function(el){ var k = el.getAttribute('data-i18n'); if (!(k in SQ)) SQ[k] = el.textContent; });
  phEls.forEach(function(el){ SQ[el.getAttribute('data-i18n-ph')] = el.getAttribute('placeholder'); });
  ariaEls.forEach(function(el){ SQ[el.getAttribute('data-i18n-aria')] = el.getAttribute('aria-label'); });

  var current = 'sq';
  var langBtn = document.getElementById('lang-btn');
  var langLabel = document.getElementById('lang-label');
  var menuBtn = document.querySelector('.menu-btn');
  var panel = document.getElementById('mobile-nav');

  function t(k){ return (current === 'en' ? EN[k] : SQ[k]) || SQ[k] || ''; }

  function applyLang(lang){
    current = lang === 'en' ? 'en' : 'sq';
    var m = META[current];
    document.documentElement.lang = current;
    document.title = m.title;
    var d = document.querySelector('meta[name="description"]'); if (d) d.setAttribute('content', m.desc);
    textEls.forEach(function(el){ el.textContent = t(el.getAttribute('data-i18n')); });
    phEls.forEach(function(el){ el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph'))); });
    ariaEls.forEach(function(el){ el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'))); });
    langLabel.textContent = m.switchTo;
    langBtn.setAttribute('aria-label', m.switchAria);
    langBtn.setAttribute('lang', m.switchLang);
    menuBtn.setAttribute('aria-label', panel.classList.contains('open') ? m.close : m.open);
    document.querySelectorAll('.err').forEach(function(e){ if (e.textContent && e.dataset.key) e.textContent = m[e.dataset.key]; });
    try { localStorage.setItem('let-lang', current); } catch (e) {}
  }

  langBtn.addEventListener('click', function(){ applyLang(current === 'en' ? 'sq' : 'en'); });

  var start = 'sq';
  try {
    var q = new URLSearchParams(location.search).get('lang');
    var saved = localStorage.getItem('let-lang');
    if (q === 'en' || q === 'sq') start = q; else if (saved === 'en' || saved === 'sq') start = saved;
  } catch (e) {}
  if (start === 'en') applyLang('en');

  // Mobile menu
  function setMenu(open){
    panel.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', open ? META[current].close : META[current].open);
    menuBtn.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
  }
  menuBtn.addEventListener('click', function(){ setMenu(!panel.classList.contains('open')); });
  panel.addEventListener('click', function(e){ if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && panel.classList.contains('open')) { setMenu(false); menuBtn.focus(); } });

  // CTA buttons preselect the matching interest in the form
  document.querySelectorAll('[data-interest]').forEach(function(a){
    a.addEventListener('click', function(){ document.getElementById('interest').value = a.getAttribute('data-interest'); });
  });

  // Form validation (front-end only; connect to a real endpoint when building)
  var form = document.getElementById('enroll-form');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var ok = true, m = META[current];
    function check(input, errId, valid, key){
      var err = document.getElementById(errId);
      input.setAttribute('aria-invalid', valid ? 'false' : 'true');
      err.dataset.key = key;
      err.textContent = valid ? '' : m[key];
      if (!valid && ok) { input.focus(); ok = false; }
    }
    var f = form.elements;
    var email = f.email.value.trim(), phone = f.phone.value.trim();
    var emailOK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), phoneOK = /^[+0-9 ()-]{8,}$/.test(phone);
    var contactOK = (emailOK || phoneOK) && (!email || emailOK) && (!phone || phoneOK);
    check(f.name, 'err-name', f.name.value.trim().length >= 3, 'errName');
    check(email || !phone ? f.email : f.phone, 'err-contact', contactOK, 'errContact');
    if (contactOK) { f.email.setAttribute('aria-invalid','false'); f.phone.setAttribute('aria-invalid','false'); }
    check(f.message, 'err-msg', f.message.value.trim().length >= 3, 'errMsg');
    if (!ok) return;

    var btn = form.querySelector('button[type="submit"]');
    var success = document.getElementById('success');
    var failure = document.getElementById('failure');
    failure.classList.remove('show');

    // Honeypot: bots fill hidden fields, people do not
    if (f._gotcha && f._gotcha.value) { success.classList.add('show'); btn.disabled = true; return; }

    if (!FORM.endpoint) { success.classList.add('show'); btn.disabled = true; return; } // demo mode

    var data = new FormData(form);
    var topicLabel = f.topic.options[f.topic.selectedIndex].text;
    data.append('_subject', '[LET] ' + topicLabel + ', ' + f.name.value.trim());
    data.append('language', current);
    if (email) data.append('_replyto', email);
    Object.keys(FORM.extra).forEach(function(k){ data.append(k, FORM.extra[k]); });

    btn.disabled = true;
    btn.setAttribute('aria-busy', 'true');
    fetch(FORM.endpoint, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
      .then(function(r){ if (!r.ok) throw new Error('HTTP ' + r.status); success.classList.add('show'); form.reset(); })
      .catch(function(){ failure.classList.add('show'); btn.disabled = false; })
      .then(function(){ btn.removeAttribute('aria-busy'); });
  });


  // Scroll reveals: only when motion is allowed and IntersectionObserver exists
  var motionOK = window.matchMedia && window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
  if (motionOK && 'IntersectionObserver' in window) {
    var targets = document.querySelectorAll('.section-head, .trust-item, .act, .code-copy, .code-art, .mosaic figure, .camp-copy, .gal-grid figure, .enroll-card, .map-card, .grow');
    var staggerParents = ['trust-item', 'act', 'gal-grid', 'mosaic'];
    targets.forEach(function(el){
      el.classList.add('reveal');
      var p = el.parentElement;
      if (p && (el.classList.contains('trust-item') || el.classList.contains('act') || p.classList.contains('gal-grid') || p.classList.contains('mosaic'))) {
        var i = Array.prototype.indexOf.call(p.children, el);
        el.style.transitionDelay = (i * 90) + 'ms';
      }
    });
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add('in');
        io.unobserve(el);
        // Hand hover effects back to normal once the entrance is done
        setTimeout(function(){ el.classList.remove('reveal', 'in'); el.style.transitionDelay = ''; }, 1800);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function(el){ io.observe(el); });
  }

  try { document.getElementById('year').textContent = new Date().getFullYear(); } catch (e) {}
})();
