/* LENA V3.6.4: iOS-safe mobile menu links.
   Defer closing the checkbox overlay until after the browser handles the link. */
(function(){
  function initMenuClose(){
    var checkbox=document.getElementById('menu-check');
    var menu=document.querySelector('.mobile-menu');
    if(!checkbox || !menu) return;
    menu.addEventListener('click',function(event){
      var link=event.target.closest('a[href]');
      if(!link) return;
      window.setTimeout(function(){
        checkbox.checked=false;
        checkbox.dispatchEvent(new Event('change',{bubbles:true}));
      },80);
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initMenuClose);
  else initMenuClose();
})();

/* V2.34 TEST — floating desktop header */
(function(){
  function initFloatingLenaHeader(){
    var nav=document.querySelector('nav.main-nav.lena-nav');
    if(!nav) return;
    var spacer=document.createElement('div');
    spacer.className='lena-header-spacer';
    nav.parentNode.insertBefore(spacer,nav);
    var floating=false;
    function update(){
      var next=window.innerWidth>=1121 && window.scrollY>72;
      if(next===floating) return;
      floating=next;
      document.body.classList.toggle('lena-header-floating',floating);
    }
    update();
    window.addEventListener('scroll',update,{passive:true});
    window.addEventListener('resize',update,{passive:true});
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initFloatingLenaHeader);
  else initFloatingLenaHeader();
})();
