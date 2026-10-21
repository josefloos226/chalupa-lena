
/* LENA V3.3 – single submission to Cloudflare Worker (Resend). */
(function () {
  const form = document.getElementById('lenaInquiryForm');
  if (!form) return;
  const endpoint = 'https://chalupa-lena-form.josef-loos226.workers.dev/';
  const status = document.getElementById('formStatus');
  const button = form.querySelector('button[type="submit"]');
  const en = document.documentElement.lang === 'en';
  let sending = false;

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    const formData = new FormData(form);
    if (String(formData.get('_honey') || '').trim()) return;
    const name = String(formData.get('Jméno a příjmení') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('Telefon') || '').trim();
    const dates = String(formData.get('Termín pobytu') || '').trim();
    const guests = String(formData.get('Počet hostů') || '').trim();
    const message = String(formData.get('Zpráva') || '').trim();

    // Send one form-urlencoded POST; aliases keep the existing Worker compatible.
    const payload = new URLSearchParams({
      name, email, phone, dates, guests, message,
      language: en ? 'en' : 'cs', lang: en ? 'en' : 'cs',
      jmeno: name, termin: dates, pocet_hostu: guests, zprava: message,
      'Jméno a příjmení': name, 'Telefon': phone,
      'Termín pobytu': dates, 'Počet hostů': guests, 'Zpráva': message,
      'Souhlas se zpracováním údajů': 'Ano'
    });
    sending = true;
    button.disabled = true;
    const originalText = button.textContent;
    button.textContent = en ? 'Sending your enquiry…' : 'Odesíláme poptávku…';
    status.className = 'full formStatus';
    status.replaceChildren();
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload.toString()
      });
      let result = null;
      try { result = await response.json(); } catch (_) { /* HTTP status still applies */ }
      if (!response.ok || (result && result.ok === false)) throw new Error('Submission failed');
      form.reset();
      if (typeof window.lenaTrackEvent === 'function') {
        window.lenaTrackEvent('generate_lead', { method: 'website_enquiry', language: en ? 'en' : 'cs' });
      }
      status.className = 'full formStatus formStatus--success lenaFormFeedback';
      status.innerHTML = '<span class="lenaFormFeedback__icon" aria-hidden="true">✓</span>' +
        '<span class="lenaFormFeedback__body"><strong>' + (en ? 'Thank you for your enquiry!' : 'Děkujeme za vaši poptávku!') + '</strong>' +
        '<span>' + (en ? 'We have received your enquiry and will get back to you shortly. Your booking is not confirmed yet.' : 'Vaši nezávaznou poptávku jsme úspěšně přijali. Na váš e-mail jsme odeslali potvrzení a co nejdříve se vám ozveme.') + '</span></span>';
    } catch (error) {
      status.className = 'full formStatus formStatus--error';
      status.textContent = en ? 'Your enquiry could not be sent. Please try again or email info@chalupa-lena.cz.' : 'Poptávku se nepodařilo odeslat. Zkuste to prosím znovu nebo nám napište na info@chalupa-lena.cz.';
    } finally {
      sending = false;
      button.disabled = false;
      button.textContent = originalText;
    }
  });
})();
