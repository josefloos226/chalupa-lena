// Cloudflare Worker for Chalupa LENA. Deploy separately from GitHub Pages.
// Secrets: RESEND_API_KEY; optional TURNSTILE_SECRET (recommended for public deployment).
const ORIGINS = ['https://josefloos226.github.io','https://chalupa-lena.cz','https://www.chalupa-lena.cz'];
const FROM = 'Chalupa LENA <info@chalupa-lena.cz>';
const TO = 'info@chalupa-lena.cz';
const json = (data,status=200,origin='') => new Response(JSON.stringify(data), {status,headers:{'Content-Type':'application/json; charset=utf-8','Access-Control-Allow-Origin':origin,'Vary':'Origin','Cache-Control':'no-store'}});
const esc = s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export default {async fetch(request,env){
 const origin=request.headers.get('Origin')||'';
 if(!ORIGINS.includes(origin)) return json({success:false,error:'Origin not allowed'},403,'');
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'86400','Vary':'Origin'}});
 if(request.method!=='POST')return json({success:false},405,origin);
 if(!env.RESEND_API_KEY)return json({success:false,error:'Service not configured'},503,origin);
 const length=Number(request.headers.get('Content-Length')||0);if(length>20000)return json({success:false},413,origin);
 let form;try{form=await request.formData()}catch{return json({success:false},400,origin)}
 if(String(form.get('_honey')||'').trim())return json({success:true},200,origin);
 const name=String(form.get('Jméno a příjmení')||'').trim().slice(0,160);
 const email=String(form.get('email')||'').trim().slice(0,254);
 const phone=String(form.get('Telefon')||'').trim().slice(0,100);
 const dates=String(form.get('Termín pobytu')||'').trim().slice(0,200);
 const guests=Number(form.get('Počet hostů'));
 const message=String(form.get('Zpráva')||'').trim().slice(0,4000);
 const consent=String(form.get('Souhlas se zpracováním údajů')||'');
 if(!name||!/^\S+@\S+\.\S+$/.test(email)||!Number.isInteger(guests)||guests<1||guests>12||consent!=='Ano')return json({success:false,error:'Invalid form'},400,origin);
 if(env.TURNSTILE_SECRET){const token=String(form.get('cf-turnstile-response')||'');if(!token)return json({success:false,error:'Verification required'},400,origin);const verify=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret:env.TURNSTILE_SECRET,response:token})});const v=await verify.json();if(!v.success)return json({success:false,error:'Verification failed'},400,origin)}
 const send=async (payload)=>{const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{'Authorization':`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify(payload)});if(!r.ok){console.error('Resend status',r.status);throw new Error('Email delivery API failed')}return r.json()};
 const rows=[['Jméno a příjmení',name],['E-mail',email],['Telefon',phone],['Termín pobytu',dates],['Počet hostů',String(guests)],['Zpráva',message]];
 const table=rows.map(([k,v])=>`<tr><th align="left" style="padding:8px;border-bottom:1px solid #ddd">${esc(k)}</th><td style="padding:8px;border-bottom:1px solid #ddd;white-space:pre-wrap">${esc(v)}</td></tr>`).join('');
 try{
   await send({from:FROM,to:[TO],reply_to:email,subject:'Nová nezávazná poptávka – Chalupa LENA',html:`<h2>Nová poptávka Chalupa LENA</h2><table>${table}</table>`});
   await send({from:FROM,to:[email],subject:'Chalupa LENA | Potvrzení přijetí poptávky',html:`<p>Dobrý den,</p><p>děkujeme za váš zájem o pobyt v <strong>Chalupě LENA</strong>.</p><p>Vaši nezávaznou poptávku jsme přijali a zpracováváme ji. Co nejdříve se vám ozveme s informací o dostupnosti termínu a dalšími podrobnostmi.</p><p>Tento e-mail potvrzuje pouze přijetí poptávky, nikoliv rezervaci.</p><p>S přáním krásného dne,<br><strong>Josef a Petra</strong><br>Chalupa LENA<br><a href="https://www.chalupa-lena.cz">www.chalupa-lena.cz</a><br>info@chalupa-lena.cz</p>`});
   return json({success:true},200,origin);
 }catch(e){console.error('Submission failed',String(e));return json({success:false,error:'Email delivery failed'},502,origin)}
}};
