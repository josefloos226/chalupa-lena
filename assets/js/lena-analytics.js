/* Chalupa LENA V3.8.7 – Google Analytics 4, basic Consent Mode v2.
   Google tag is NOT requested before explicit analytics consent. */
(function () {
  'use strict';
  const measurementId = 'G-7X0S3GPS47';
  const key = 'lena_analytics_consent_v1';
  const isEnglish = document.documentElement.lang.toLowerCase().startsWith('en');
  const labels = isEnglish ? {
    title: 'Your privacy matters',
    body: 'We use optional Google Analytics cookies to understand visits and improve the website. Analytics is disabled until you agree.',
    yes: 'Allow analytics', no: 'Reject analytics', info: 'Cookie information', setting: 'Cookie settings', close: 'Close', saved: 'Your choice has been saved.'
  } : {
    title: 'Vaše soukromí je důležité',
    body: 'Volitelné analytické cookies Google Analytics nám pomáhají porozumět návštěvnosti a zlepšovat web. Bez vašeho souhlasu se měření nespustí.',
    yes: 'Povolit analytiku', no: 'Odmítnout analytiku', info: 'Informace o cookies', setting: 'Nastavení cookies', close: 'Zavřít', saved: 'Vaše volba byla uložena.'
  };
  const cookiesUrl = 'cookies.html';
  let loaded = false;

  function getChoice() {
    try { return localStorage.getItem(key); } catch (err) { return null; }
  }
  function saveChoice(value) {
    try { localStorage.setItem(key, value); } catch (err) { /* Consent will not persist if storage is blocked. */ }
  }
  function ensureGtag() {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  }
  function startAnalytics() {
    if (loaded || getChoice() !== 'granted') return;
    loaded = true;
    ensureGtag();
    // Default remains denied for all categories; we do not use advertising.
    window.gtag('consent', 'default', {
      analytics_storage: 'denied', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied'
    });
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('js', new Date());
    window.gtag('config', measurementId, { allow_google_signals: false, allow_ad_personalization_signals: false });
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
    document.head.appendChild(tag);
  }
  function setChoice(value, panel) {
    saveChoice(value);
    if (panel) panel.remove();
    if (value === 'granted') {
      startAnalytics();
    } else if (loaded) {
      // On revocation, cease using Analytics immediately and reload so the tag is no longer loaded.
      if (typeof window.gtag === 'function') {
        window.gtag('consent', 'update', {
          analytics_storage: 'denied', ad_storage: 'denied',
          ad_user_data: 'denied', ad_personalization: 'denied'
        });
      }
      window.location.reload();
    }
  }
  function makeButton(text, className, handler) {
    const button = document.createElement('button');
    button.type = 'button'; button.className = className; button.textContent = text;
    button.addEventListener('click', handler);
    return button;
  }
  function showPanel() {
    if (document.getElementById('lena-cookie-banner')) return;
    const aside = document.createElement('aside');
    aside.id = 'lena-cookie-banner';
    aside.className = 'lena-cookie-banner';
    aside.setAttribute('role', 'region');
    aside.setAttribute('aria-label', labels.setting);
    const content = document.createElement('div');
    content.className = 'lena-cookie-content';
    const title = document.createElement('strong'); title.textContent = labels.title;
    const desc = document.createElement('p'); desc.textContent = labels.body;
    const more = document.createElement('a'); more.href = cookiesUrl; more.textContent = labels.info;
    content.append(title, desc, more);
    const actions = document.createElement('div'); actions.className = 'lena-cookie-actions';
    actions.append(
      makeButton(labels.no, 'lena-cookie-reject', () => setChoice('denied', aside)),
      makeButton(labels.yes, 'lena-cookie-accept', () => setChoice('granted', aside))
    );
    aside.append(content, actions);
    document.body.appendChild(aside);
  }
  function init() {
    document.querySelectorAll('.lena-cookie-settings').forEach((button) => {
      button.addEventListener('click', showPanel);
    });
    if (getChoice() === 'granted') startAnalytics();
    else if (getChoice() !== 'denied') showPanel();

    // Measurement only after consent; never send form contents or personal details.
    document.querySelectorAll('a[href="#kontakt"]').forEach((link) => {
      link.addEventListener('click', () => {
        window.lenaTrackEvent('lena_enquiry_open', { language: isEnglish ? 'en' : 'cs' });
      });
    });
  }
  window.lenaTrackEvent = function (eventName, params) {
    if (getChoice() !== 'granted' || !loaded || typeof window.gtag !== 'function') return;
    window.gtag('event', eventName, params || {});
  };
  window.lenaOpenCookieSettings = showPanel;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
