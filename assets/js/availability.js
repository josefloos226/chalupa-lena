
(()=>{
 const root=document.getElementById('lenaAvailability'); if(!root)return;
 const pl=document.documentElement.lang==='pl';
 const en=document.documentElement.lang==='en';
 const names=pl?['Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec','Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień']:en?['January','February','March','April','May','June','July','August','September','October','November','December']:['Leden','Únor','Březen','Duben','Květen','Červen','Červenec','Srpen','Září','Říjen','Listopad','Prosinec'];
 const wd=pl?['PN','WT','ŚR','CZ','PT','SO','ND']:en?['MO','TU','WE','TH','FR','SA','SU']:['PO','ÚT','ST','ČT','PÁ','SO','NE'];
 const now=new Date();
 const currentMonth=new Date(now.getFullYear(),now.getMonth(),1);
 let start=new Date(currentMonth);
 // Obsazenost podle dodaných snímků k 21. 10. 2026; budoucí iCal synchronizace s eChalupy.
 // První den pobytu = příjezd (odpoledne obsazeno), poslední = odjezd (dopoledne obsazeno).
 const stays=[
  ['2026-10-12','2026-10-18'],
  ['2026-10-19','2026-10-28'],
  ['2026-10-29','2026-11-01'],
  ['2026-12-18','2026-12-21'],
  ['2026-12-28','2027-01-02'],
  ['2027-03-21','2027-03-25'],
  ['2027-03-26','2027-04-05'],
  ['2027-05-05','2027-05-09'],
  ['2027-05-12','2027-05-16'],
  ['2027-06-26','2027-07-01']
 ];
 const iso=(y,m,d)=>`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
 function stateFor(y,m,d){
   const k=iso(y,m,d);
   for(const [a,b] of stays){
     if(k===a && k===b) return 'busy';
     if(k===a) return 'arrival';
     if(k===b) return 'departure';
     if(k>a && k<b) return 'busy';
   }
   return 'free';
 }
 function render(){
   root.innerHTML='';
   for(let i=0;i<(window.matchMedia('(max-width:760px)').matches?1:6);i++){
     const dt=new Date(start.getFullYear(),start.getMonth()+i,1),y=dt.getFullYear(),m=dt.getMonth();
     const box=document.createElement('article'); box.className='availability-month';
     const h=document.createElement('h3'); h.textContent=`${names[m]} ${y}`; box.appendChild(h);
     const wh=document.createElement('div'); wh.className='availability-weekdays';
     wd.forEach(x=>{const e=document.createElement('span');e.textContent=x;wh.appendChild(e)}); box.appendChild(wh);
     const days=document.createElement('div'); days.className='availability-days';
     const offset=(new Date(y,m,1).getDay()+6)%7;
     for(let e=0;e<offset;e++){const q=document.createElement('span');q.className='availability-day empty';days.appendChild(q)}
     const count=new Date(y,m+1,0).getDate();
     for(let d=1;d<=count;d++){
       const state=stateFor(y,m,d),q=document.createElement('span');
       q.className=`availability-day ${state}`; q.textContent=d;
       q.title=pl?(state==='free'?'Wolne':state==='arrival'?'Przyjazd – zajęte od popołudnia':state==='departure'?'Wyjazd – zajęte do rana':'Zajęte'):en?(state==='free'?'Available':state==='arrival'?'Check-in – booked from the afternoon':state==='departure'?'Check-out – booked until the morning':'Booked'):(state==='free'?'Volný termín':state==='arrival'?'Příjezd – odpoledne obsazeno':state==='departure'?'Odjezd – dopoledne obsazeno':'Obsazeno');
       days.appendChild(q);
     }
     box.appendChild(days); root.appendChild(box);
   }
   const prev=document.querySelector('.availability-prev');
   if(prev){const atCurrent=start.getFullYear()===currentMonth.getFullYear()&&start.getMonth()===currentMonth.getMonth();prev.disabled=atCurrent;prev.setAttribute('aria-disabled',String(atCurrent));}
 }
 document.querySelector('.availability-prev')?.addEventListener('click',()=>{
   const candidate=new Date(start.getFullYear(),start.getMonth()-1,1);
   if(candidate>=currentMonth){start=candidate;render()}
 });
 document.querySelector('.availability-next')?.addEventListener('click',()=>{start=new Date(start.getFullYear(),start.getMonth()+1,1);render()});
 let mobileCalendar=window.matchMedia('(max-width:760px)');
 if(mobileCalendar.addEventListener) mobileCalendar.addEventListener('change',render);
 else if(mobileCalendar.addListener) mobileCalendar.addListener(render);
 render();
})();
