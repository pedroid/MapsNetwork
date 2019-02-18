var appMaps = "https://script.google.com/macros/s/AKfycbxnaDdmZ6X1Z6IYXPVIEjYdbPMMYpM4BvZB_5VzGIN0G1sn-NE/exec";
var appLandmarks = "https://script.google.com/macros/s/AKfycbxuKSxzloYTYXGLHmLtAN5xCPTSHQBHlGF4IBcYbm2L8WjiwopC/exec";

Vlocal2cursor_set = [];
icon_div_set = [];
var curr_icon;
var curr_cursor_id;
var cursor2pointer_x = 15;
var cursor2pointer_y = 23;

search_set = {};
var location_search;
var ToVisualize = function(){
	//$(location).attr('href', 'visualization.html?MapID='+search_set.MapID+'&StoryID='+search_set.StoryID);
	$(location).attr("href","visualization.html?"+location_search);
}
var circularnav;
$(document).ready(function() {
	circularnav = document.getElementsByClassName("ss-icon")[0];
	circularnav.addEventListener("click", clickSet, false);

	circularnav.addEventListener("keydown", function (e) {
		if (e.keyCode === 13) {  
			clickSet();
		}
	});
	$('#new_nav').draggable();
	
	
	load();
});


//nav
function clickSet() {
	 circularnav.classList.toggle("closed")
	 circularnav.classList.toggle("clicked");
	 /*
	  if (circularnav.classList.contains("closed")) {
		// freshly closed button
		var pseudoBefore = window.getComputedStyle(
			document.querySelector('.ss-icon'), ':before'		
		).animation;
	  }
	  */
}


//end of nav

function parse_arguments(input_arguments){
	var arguments_set = [];
	return arguments_set;
}

var load = function(){
	var map_offset;
	var xPos;
	var yPos;
	var Vglobal2local_x = xPos;
	var Vglobal2local_y = yPos;

	if(window.location.search == ""){

	}else{
		var search_tmp = window.location.search.split("?")[1];
		var search_set_tmp = search_tmp.split('&');
		for (id_set in search_set_tmp){
			search_set[search_set_tmp[id_set].split("=")[0]] = parseInt(search_set_tmp[id_set].split("=")[1]);
		}
		location_search = window.location.search.split("?")[1];
		var query=location_search.split("&")[0];
		$('#edit').attr("href","edit.html?"+location_search);
		
		input_arguments = location_search.split("&");
		num_arguments = input_arguments.length;
		arguments_set = parse_arguments(input_arguments);
		arguments_set['location_x'] = location_search.split("&")[1].split("=")[1];
		arguments_set['location_y'] = location_search.split("&")[2].split("=")[1];
		arguments_set['StoryID'] = location_search.split("&")[3].split("=")[1];
		arguments_set['MapID'] = query.split("=")[1];
		
		//location_x = location_search.split("&")[1].split("=")[1];
		//location_y = location_search.split("&")[2].split("=")[1];
		//StoryID = location_search.split("&")[3].split("=")[1];
		//MapID = query.split("=")[1];
		
		Vlocal2cursor_x = arguments_set['location_x'];
		Vlocal2cursor_y = arguments_set['location_y'];
		
		//if($(window).width()>$('#range').width()){
		//	$('#map').offset({left:1200/2-location_x,top:800/2-location_y});
		//}else{
			$('#map').offset({left:$( window ).width()/2-Vlocal2cursor_x,top:$( window ).height()/2-Vlocal2cursor_y});
		//}
		map_offset = $("#map").offset();
		Vglobal2local_x = map_offset.left;
		Vglobal2local_y = map_offset.top;
		$.get(
			appMaps,{
				"command":"commandGetMapImageSrc",
				"MapID":arguments_set['MapID']
			},function (data) {
				//console.log(data);
				//console.log('Vlocal2cursor_x:'+Vlocal2cursor_x);
				$('#range img').attr("src",data);

			}
		)
		$.get(
			appLandmarks,{
				"command":"commandGetLandmarks",
				"MapID":arguments_set['MapID'],
				"StoryID":arguments_set['StoryID']
			},function (data) {
				//console.log(data);
				var landmarks_set_tmp = data.split("|");
				//console.log(landmarks_set_tmp[0]);
				landmarks_set_tmp.pop();
				for(var i=0;i<landmarks_set_tmp.length;i++){
						icon_div_set.push({
							"id":"icon_div_"+i,
							"LandmarkID":parseInt(landmarks_set_tmp[i].split(',')[0]),
							"LandmarkName":landmarks_set_tmp[i].split(',')[1],
							"HyperlinkLandmarkID":parseInt(landmarks_set_tmp[i].split(',')[4]),
							"HyperlinkMapID":parseInt(landmarks_set_tmp[i].split(',')[5]),
							"StoryID":parseInt(landmarks_set_tmp[i].split(',')[8]),
							"MEMO":landmarks_set_tmp[i].split(',')[9]
						})
						//console.log(landmarks_set_tmp[i].split(',')[9]);
						if (parseInt(landmarks_set_tmp[i].split(',')[4]) != 0) {
							$('#icon_layer').append("<div id=\""+icon_div_set[i].id+"\" class=\"icon\"><img id=\"icon\" src=\"assets/landmark.png\"/></div>");
						}else{
							$('#icon_layer').append("<div id=\""+icon_div_set[i].id+"\" class=\"icon\"><img id=\"icon\" src=\"assets/info.png\"/></div>");
						}
						Vlocal2cursor_set.push({
							"x":parseInt(landmarks_set_tmp[i].split(",")[2]),
							"y":parseInt(landmarks_set_tmp[i].split(",")[3])
						})
						$('#'+icon_div_set[i].id).css({ 'left': Vglobal2local_x+Vlocal2cursor_set[i].x + 'px', 'top': Vglobal2local_y+Vlocal2cursor_set[i].y + 'px' });

				}
				//console.log(landmarks_set_tmp);

				for(var i=0;i<Vlocal2cursor_set.length;i++){
					var HyperlinkMapID = landmarks_set_tmp[i].split(",")[5];
					//console.log(i+':'+HyperlinkMapID);

				  icon_div_set[i].HyperlinkMapID = HyperlinkMapID;
					//console.log('test:'+icon_div_set[i].HyperlinkMapID);
					if(icon_div_set[i].HyperlinkMapID==0){
						//console.log(icon_div_set[i].MEMO);
						$('#'+icon_div_set[i].id).click(
							{param:i,param_x:tmp,param_y:tmp2},
							function(e){
									$('#memo_div').show();
									$('#memo_div_content').text(icon_div_set[e.data.param].MEMO);
									//console.log(e.data.param+':'+icon_div_set[e.data.param].MEMO);
							}
						)
					}else{
						var tmp = landmarks_set_tmp[i].split(",")[6];
						var tmp2 = landmarks_set_tmp[i].split(",")[7];
//					        console.log(i);

						$('#'+icon_div_set[i].id).click(
							{param:i,param_x:tmp,param_y:tmp2},
							function(e){

									$(location).attr('href', 'map.html?MapID='+icon_div_set[e.data.param].HyperlinkMapID+'&location_x='+e.data.param_x+'&location_y='+e.data.param_y+'&StoryID='+icon_div_set[e.data.param].StoryID);

									//console.log(e.data.param+':'+icon_div_set[e.data.param].HyperlinkMapID);
							}
						)

					}



				}
			}
		)

	}


	$("#map").draggable({
        drag: function(){
//			console.log(Vlocal2cursor_set[0].x);
//			console.log(Vlocal2cursor_set[0].y);
            var offset = $(this).offset();
            var Vglobal2local_x = offset.left;
            var Vglobal2local_y = offset.top;

			for(var i=0;i<Vlocal2cursor_set.length;i++){
				$('#'+icon_div_set[i].id).css({ 'left': Vglobal2local_x+Vlocal2cursor_set[i].x + 'px', 'top': Vglobal2local_y+Vlocal2cursor_set[i].y + 'px' });
			}

	   },
		containment:$(this).parent().parent()
	});

	document.onmouseup = function(e){

		var offset = $('#map').offset();
		//Vglobal2local
		var Vglobal2local_x = offset.left;
		var Vglobal2local_y = offset.top;
		//Vglobal2pointer
		var Vglobal2pointer_x = e.pageX;
		var Vglobal2pointer_y = e.pageY;
		//Vlocal2pointer = Vlocal2global + Vglobal2pointer
		//console: Vlocal2pointer
		console.log('Vlocal2mice_pointer:'+'x:'+(Vglobal2pointer_x-Vglobal2local_x)+';y:'+(Vglobal2pointer_y-Vglobal2local_y));
		//cursor_set[0].cursor_x = cursorX-xPos;
		//cursor_set[0].cursor_y = cursorY-yPos;
		//console.log('Vlocal2cursor[0]:'+'x:'+Vlocal2cursor_set[0].x+';y:'+Vlocal2cursor_set[0].y);

	}
	$( window ).resize(function() {
		console.log($( window ).width());
	});
}

var tID; //we will use this variable to clear the setInterval()
function stopAnimate() {
    clearInterval(tID);
} //end of stopAnimate()
function animateScript() {
    console.log('test');
    const interval = 100; //100 ms of interval for the setInterval()
    const diff_x = 41; //diff as a variable for position offset
	const diff_y = 42; //diff as a variable for position offset
	var position_x = 0; //start position for the image slicer
	var position_y = -2*diff_y; //-diff_y: SE, -2*diff_y: E
    tID = setInterval(() => {
        document.getElementById("protagonist").style.backgroundPosition =
            `-${position_x}px ${position_y}px`;
        //we use the ES6 template literal to insert the variable "position"
        if (position_x < 328) {
            position_x = position_x + diff_x;
        }
        //we increment the position by 256 each time
        else {
            position_x = 41;
        }

        //reset the position to 256px, once position exceeds 1536px
    }, interval); //end of setInterval
} //end of animateScript()
