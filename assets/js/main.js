

(function(){
  function initMenuClose(){
    var checkbox = document.getElementById('menu-check');
    if(!checkbox) return;

    var label = document.querySelector('label[for="menu-check"]');
    var menu = document.querySelector('.mobile-menu');
    if(!menu) return;

    menu.addEventListener('click', function(e){
      var link = e.target.closest('a');
      if(!link) return;

      /* Close the existing checkbox menu immediately. */
      checkbox.checked = false;
      checkbox.dispatchEvent(new Event('change', {bubbles:true}));

      /* Force a style refresh for iOS/local HTML viewers. */
      void menu.offsetHeight;
    }, true);

    menu.addEventListener('touchend', function(e){
      var link = e.target.closest('a');
      if(!link) return;
      checkbox.checked = false;
      checkbox.dispatchEvent(new Event('change', {bubbles:true}));
    }, true);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initMenuClose);
  } else {
    initMenuClose();
  }
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
