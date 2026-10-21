Chalupa LENA – V3.8.7 – Google Analytics 4

Measurement ID: G-7X0S3GPS47
All pages include analytics consent banner (CZ/EN). Google tag is not downloaded until Analytics is permitted.
Consent decision is saved in localStorage. Footer provides Cookie settings for renewal/revocation.
Google advertising-related consent states always remain denied.
Events (only after Analytics consent): page_view (GA4), lena_enquiry_open (click to inquiry), generate_lead (ONLY after Cloudflare Worker returned success).
Form contents and personal data are NOT included in GA events.

To deploy:
- Extract this ZIP and copy the CONTENTS of the chalupa-lena folder to the root of your local GitHub repo.
- Commit and Push origin from GitHub Desktop.
- Test https://www.chalupa-lena.cz in private window: reject analytics -> verify no network request to googletagmanager.com/gtag/js. Accept -> Google Analytics realtime should show a visit.
- Send a REAL inquiry only if needed; if testing, mark it clearly as a test, and ensure live workflow is not disrupted.
- In GA4 admin, mark the generate_lead event as a key event after it appears.
- Check that Google Map embed and privacy documentation are consistent with your final compliance requirements; this cookie notice is not full legal counsel.
