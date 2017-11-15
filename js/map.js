var appMaps = "https://script.google.com/macros/s/AKfycbxnaDdmZ6X1Z6IYXPVIEjYdbPMMYpM4BvZB_5VzGIN0G1sn-NE/exec";
var appLandmarks = "https://script.google.com/macros/s/AKfycbxuKSxzloYTYXGLHmLtAN5xCPTSHQBHlGF4IBcYbm2L8WjiwopC/exec";
var cursor_set = [];

icon_div_set = [];
icon_div_set.push({
	"id":"icon_div",
})
icon_div_set.push({
	"id":"icon_div2",
})
icon_div_set.push({
	"id":"icon_div3",
})

var cursor2pointer_x = -15;
var cursor2pointer_y = -45;
$(document).ready(function() {
	var offset;
	var xPos;
	var yPos;
	if(window.location.search == ""){
		
	}else{
		var location_search = window.location.search.split("?")[1];
		var query=location_search.split("&")[0];
		MapID = query.split("=")[1];
		location_x = location_search.split("&")[1].split("=")[1];
		location_y = location_search.split("&")[2].split("=")[1];
		if($(window).width()>1800){
			$('#map').offset({left:1200/2-location_x,top:800/2-location_y});
		}else{
			$('#map').offset({left:$( window ).width()/2-location_x,top:$( window ).height()/2-location_y});
		}
		offset = $("#map").offset();
		xPos = offset.left;
		yPos = offset.top;
		$.get(
			appMaps,{
				"command":"commandGetMapImageSrc",
				"MapID":MapID
			},function (data) {
				console.log(data);
				console.log('location_x'+location_x);
				$('#range img').attr("src",data);
				
			}
		)
		$.get(
			appLandmarks,{
				"command":"commandGetLandmarks",
				"MapID":MapID
			},function (data) {
				var landmarks_set_tmp = data.split("|");
				landmarks_set_tmp.pop();
				for(var i=0;i<landmarks_set_tmp.length;i++){
					$('#icon_layer').append("<div id=\""+icon_div_set[i].id+"\" class=\"icon\"><img id=\"icon\" src=\"assets/icon.png\"/></div>");
					cursor_set.push({
						"cursor_x":parseInt(landmarks_set_tmp[i].split(",")[2]), 
						"cursor_y":parseInt(landmarks_set_tmp[i].split(",")[3])
					})
					$('#'+icon_div_set[i].id).css({ 'left': xPos+cursor_set[i].cursor_x+cursor2pointer_x + 'px', 'top': yPos+cursor_set[i].cursor_y+cursor2pointer_y + 'px' });
					
				}
				console.log(landmarks_set_tmp);

				for(var i=0;i<cursor_set.length;i++){
					var HyperlinkMapID = landmarks_set_tmp[i].split(",")[5];
					console.log(i+':'+HyperlinkMapID);
					//$(icon_div_set[i].id).draggable();
				        icon_div_set[i].HyperlinkMapID = HyperlinkMapID;	
					console.log('test:'+icon_div_set[i].HyperlinkMapID);
					if(icon_div_set[i].HyperlinkMapID==0){
						console.log('nothing');
					}else{
						var tmp = landmarks_set_tmp[i].split(",")[6];
						var tmp2 = landmarks_set_tmp[i].split(",")[7];
					        console.log(i);	
						$('#'+icon_div_set[i].id).click({param:i,param_x:tmp,param_y:tmp2},function(e){
							
							$(location).attr('href', 'map.html?MapID='+icon_div_set[e.data.param].HyperlinkMapID+'&location_x='+e.data.param_x+'&location_y='+e.data.param_y);
						//console.log(e.data.param+':'+icon_div_set[e.data.param].HyperlinkMapID);	
						})
					}
						
						
					
				}				
			}
		)
	  
	}


	$("#map").draggable({
        drag: function(){
            var offset = $(this).offset();
            var xPos = offset.left;
            var yPos = offset.top;
            $('#posX').text('x: ' + xPos);
            $('#posY').text('y: ' + yPos);
			for(var i=0;i<cursor_set.length;i++){
				$('#'+icon_div_set[i].id).css({ 'left': xPos+cursor_set[i].cursor_x+cursor2pointer_x + 'px', 'top': yPos+cursor_set[i].cursor_y+cursor2pointer_y + 'px' });
			}
	   },
		containment:$(this).parent().parent()	
	}); 
	#('#map").touch(
		{
			animate: false,
			sticky: false,
			dragx: true,
			dragy: true,
			rotate: false,
			resort: true,
			scale: false
		}
	);
	
	document.onmouseup = function(e){
		var offset = $('#map').offset();
		var xPos = offset.left;
		var yPos = offset.top;
		cursorX = e.pageX;
		cursorY = e.pageY;
		console.log('x:'+(cursorX-xPos)+';y:'+(cursorY-yPos));
	}
	$( window ).resize(function() {
		console.log($( window ).width());
	});
});
