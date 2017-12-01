var appStories = "https://script.google.com/macros/s/AKfycbx4wTmlKCrNV-gkG3J6A2hNOTubo-um1YZG-zDrhruuql-dN9SS/exec";
var appMaps = "https://script.google.com/macros/s/AKfycbxnaDdmZ6X1Z6IYXPVIEjYdbPMMYpM4BvZB_5VzGIN0G1sn-NE/exec";
$('.show-list').click(function(){
	$('.wrapper').addClass('list-mode');
});

$('.hide-list').click(function(){
	$('.wrapper').removeClass('list-mode');
});

$(function(){
  $.get(appMaps,
    {
      "command":"commandGetAllMaps"
    },
    function(data){
      console.log(data);
      var maps_set_tmp = data.split('||');
      maps_set_tmp.pop();
      for(var i=0;i<maps_set_tmp.length;i++){
        var map_tmp = maps_set_tmp[i];
          var MapID = map_tmp.split('$$')[0];
          var MapTitle = map_tmp.split('$$')[1];
          var MapImageSrc = map_tmp.split('$$')[2];
          $('.container').append("<div class=\"box\"><div>"+MapTitle+"</div><div></div></div>");
      }
    })

});
