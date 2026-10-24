/* Preserve a section anchor when switching languages. */
document.querySelectorAll('.lena-language-switch a').forEach(function(link){
 link.addEventListener('click',function(){if(location.hash) link.hash=location.hash;});
});

/* Native mobile picker supports keyboard, touch and screen readers. */
document.querySelectorAll('.lena-language-select').forEach(function(select){
 select.addEventListener('change',function(){
  var target=new URL(select.value,location.href);
  target.hash=location.hash;
  location.assign(target.href);
 });
});
