/* Preserve a section anchor when switching languages. */
document.querySelectorAll('.lena-language-switch a').forEach(function(link){
 link.addEventListener('click',function(){if(location.hash) link.hash=location.hash;});
});
