(()=>{
'use strict';
const lang=document.documentElement.lang.slice(0,2);
const words=({cs:['Zvětšit fotografii','Zavřít','Předchozí fotografie','Další fotografie','Fotografie'],en:['Enlarge photo','Close','Previous photo','Next photo','Photo'],pl:['Powiększ zdjęcie','Zamknij','Poprzednie zdjęcie','Następne zdjęcie','Zdjęcie'],de:['Foto vergrößern','Schließen','Vorheriges Foto','Nächstes Foto','Foto']})[lang]||['Enlarge photo','Close','Previous photo','Next photo','Photo'];
const groups=['#chalupa','#pokoje','#pobyt','#okoli','#galerie'].map(s=>Array.from(document.querySelectorAll(s+' img')));
if(!groups.some(g=>g.length))return;
const dialog=document.createElement('dialog');dialog.className='lena-lightbox';dialog.setAttribute('aria-label',words[4]);
dialog.innerHTML='<button type="button" class="lb-close">×</button><button type="button" class="lb-prev">‹</button><figure><img alt=""><figcaption aria-live="polite"></figcaption></figure><button type="button" class="lb-next">›</button>';
document.body.append(dialog);
const close=dialog.querySelector('.lb-close'),prev=dialog.querySelector('.lb-prev'),next=dialog.querySelector('.lb-next'),photo=dialog.querySelector('img'),caption=dialog.querySelector('figcaption');
close.setAttribute('aria-label',words[1]);prev.setAttribute('aria-label',words[2]);next.setAttribute('aria-label',words[3]);
let group=[],index=0,trigger,oldOverflow;
function show(i){index=(i+group.length)%group.length;const source=group[index];photo.src=source.src;photo.alt=source.alt;caption.textContent=source.alt+' · '+(index+1)+' / '+group.length;}
function open(g,i,img){group=g;trigger=img;prev.hidden=next.hidden=g.length<2;show(i);oldOverflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.showModal();close.focus();}
groups.forEach(g=>g.forEach((img,i)=>{img.tabIndex=0;img.setAttribute('role','button');img.setAttribute('aria-haspopup','dialog');img.setAttribute('aria-label',words[0]+': '+img.alt);img.classList.add('lena-photo-trigger');img.addEventListener('click',()=>open(g,i,img));img.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(g,i,img);}});}));
close.onclick=()=>dialog.close();prev.onclick=()=>show(index-1);next.onclick=()=>show(index+1);
dialog.addEventListener('close',()=>{document.body.style.overflow=oldOverflow;trigger?.focus({preventScroll:true});});
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();show(index-1);}if(e.key==='ArrowRight'){e.preventDefault();show(index+1);}});
let touch;
photo.addEventListener('touchstart',e=>{touch=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null;},{passive:true});
photo.addEventListener('touchend',e=>{if(!touch)return;const dx=e.changedTouches[0].clientX-touch.x,dy=e.changedTouches[0].clientY-touch.y;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)show(index+(dx<0?1:-1));touch=null;},{passive:true});
})();
