var appStories = "https://script.google.com/macros/s/AKfycbx4wTmlKCrNV-gkG3J6A2hNOTubo-um1YZG-zDrhruuql-dN9SS/exec";

$('.show-list').click(function(){
	$('.wrapper').addClass('list-mode');
});

$('.hide-list').click(function(){
	$('.wrapper').removeClass('list-mode');
});
var NewStory = function(){
	$('#edit_div').show();

}
var ToNewStory = function(){
	$.get(appStories,
    {
      "command":"commandAddStory",
			"StoryName":"test StoryName",
			"EntryMapID":"33",
			"Description":"test description"
    },
    function(data){

		});

}
$(function(){
  $.get(appStories,
    {
      "command":"commandGetStories"
    },
    function(data){
      console.log(data);
      var stories_set_tmp = data.split('||');
      stories_set_tmp.pop();
      for(var i=0;i<stories_set_tmp.length;i++){
        var story_tmp = stories_set_tmp[i];
          var StoryID = story_tmp.split('$$')[0];
          var StoryName = story_tmp.split('$$')[1];
          var EntryMapID = story_tmp.split('$$')[2];
          var Description = story_tmp.split('$$')[3];
          $('.container').append("<div class=\"box\"><div>"+StoryName+"</div><div><a href=\"map.html\?MapID="+EntryMapID+"&location_x=200&location_y=200&StoryID="+StoryID+"\">enter</a></div></div>");
      }
    })

});
