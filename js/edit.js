var appMaps = "https://script.google.com/macros/s/AKfycbxnaDdmZ6X1Z6IYXPVIEjYdbPMMYpM4BvZB_5VzGIN0G1sn-NE/exec";
var appLandmarks = "https://script.google.com/macros/s/AKfycbxuKSxzloYTYXGLHmLtAN5xCPTSHQBHlGF4IBcYbm2L8WjiwopC/exec";

Vlocal2cursor_set = {};
icon_div_set = {};
var curr_icon;
var curr_cursor_id;
var cursor2pointer_x = 15;
var cursor2pointer_y = 23;

var STATEIDLE = 0;
var STATEADDLANDMARK = 1;
var currstate = STATEIDLE;

function addLandmark(){
	currstate = STATEADDLANDMARK;
	$('body').css( 'cursor', 'crosshair' );

}

function SaveLandmark(){
	$.get(
		appLandmarks,{
		  "command":"commandEditLandmark",
		  "LandmarkID":parseInt($('#edit_div').attr('landmark_id')),
		  "LandmarkName":$('#edit_div_content_landmark_name').text(),
		  "HyperlinkLandmarkID":parseInt($('#edit_div_content_landmark_hyperlink_landmark_id').text()),
		},function (data) {
			  var id_to_edit = parseInt($('#edit_div').attr('landmark_id'));
				icon_div_set[id_to_edit].LandmarkName = $('#edit_div_content_landmark_name').text();
				icon_div_set[id_to_edit].HyperlinkLandmarkID = $('#edit_div_content_landmark_hyperlink_landmark_id').text();

		}
	)
}
function DeleteLandmark(){
	console.log('test');
	$.get(
		appLandmarks,{
		  "command":"commandDeleteLandmark",
		  "LandmarkID":parseInt($('#edit_div').attr('landmark_id')),
		},function (data) {
			$('#icon_div_'+parseInt($('#edit_div').attr('landmark_id'))).remove()

		}
	)
}
$(document).ready(function() {
	$('#edit_div').hide();
	var map_offset;
	var xPos;
	var yPos;
	var Vglobal2local_x = xPos;
	var Vglobal2local_y = yPos;

	if(window.location.search == ""){

	}else{
		var location_search = window.location.search.split("?")[1];
		var query=location_search.split("&")[0];
		$('#map_link').attr("href","map.html?"+location_search);

		MapID = query.split("=")[1];
		location_x = location_search.split("&")[1].split("=")[1];
		Vlocal2cursor_x = location_x;
		location_y = location_search.split("&")[2].split("=")[1];
		Vlocal2cursor_y = location_y;
		StoryID = location_search.split("&")[3].split("=")[1];
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
				"MapID":MapID
			},function (data) {
				//console.log(data);
				//console.log('Vlocal2cursor_x:'+Vlocal2cursor_x);
				$('#range img').attr("src",data);

			}
		)
		$.get(
			appLandmarks,{
				"command":"commandGetLandmarks",
				"MapID":MapID,
				"StoryID":StoryID
			},function (data) {
				//console.log(data);

				var landmarks_set_tmp = data.split("|");
				console.log(landmarks_set_tmp[0]);
				landmarks_set_tmp.pop();
				for(var i=0;i<landmarks_set_tmp.length;i++){
						var LandmarkID = landmarks_set_tmp[i].split(",")[0];
						icon_div_set[LandmarkID] = {
							"id":"icon_div_"+LandmarkID,
							"LandmarkID":parseInt(landmarks_set_tmp[i].split(',')[0]),
							"LandmarkName":landmarks_set_tmp[i].split(',')[1],
							"HyperlinkLandmarkID":parseInt(landmarks_set_tmp[i].split(',')[4]),
							"HyperlinkMapID":parseInt(landmarks_set_tmp[i].split(',')[5])
						}
						$('#icon_layer').append("<div id=\""+icon_div_set[LandmarkID].id+"\" class=\"icon\"><img id=\"icon\" src=\"assets/icon.png\"/></div>");
						Vlocal2cursor_set[LandmarkID] = {
							"x":parseInt(landmarks_set_tmp[i].split(",")[2]),
							"y":parseInt(landmarks_set_tmp[i].split(",")[3])
						};
						$('#'+icon_div_set[LandmarkID].id).css({ 'left': Vglobal2local_x+Vlocal2cursor_set[LandmarkID].x + 'px', 'top': Vglobal2local_y+Vlocal2cursor_set[LandmarkID].y + 'px' });

				}
				console.log(landmarks_set_tmp);

				for(var i in Vlocal2cursor_set){
					//var HyperlinkMapID = landmarks_set_tmp[i].split(",")[5];
					//console.log(i+':'+HyperlinkMapID);
					$('#'+icon_div_set[i].id).draggable(

						{
							drag: function(e, ui){
								var tmp = ui.helper.attr('id');
								console.log(tmp);
								curr_cursor_id = parseInt(tmp.split('_').pop());
								map_offset = $("#map").offset();
								Vglobal2local_x = map_offset.left;
								Vglobal2local_y = map_offset.top;
								var icon_offset = $(this).offset();
								var Vglobal2cursor_x = icon_offset.left;
								var Vglobal2cursor_y = icon_offset.top;;
								//console.log(Vglobal2cursor_x);
								//console.log(Vglobal2cursor_y);
								//console.log(Vglobal2local_x);
								//console.log(Vglobal2local_y);
								//Vlocal2cursor = Vlocal2global + Vglobal2cursor
								Vlocal2cursor_set[curr_cursor_id].x = -Vglobal2local_x + Vglobal2cursor_x;
								Vlocal2cursor_set[curr_cursor_id].y = -Vglobal2local_y + Vglobal2cursor_y;
								//console.log(Vlocal2cursor_set[0].x);
								//console.log(Vlocal2cursor_set[0].y);
								//cursor_set[0].cursor_x = xPos;
								//cursor_set[0].cursor_y = yPos;
								//cursor_set[i].cursor_x = 1;
								//cursor_set[i].cursor_y = 2;



						   },containment:
							 		$(this).parent().parent(),
							stop:
								function(e, ui){
										//connsole.log(ui.helper.attr('id'))
										var curr_landmarks_set_id = ui.helper.attr('id').split('_').pop();
										console.log(curr_landmarks_set_id);
										var offset = $('#map').offset();
										//Vglobal2local
										var Vglobal2local_x = offset.left;
										var Vglobal2local_y = offset.top;
										var Vglobal2cursor_x = $('#'+ui.helper.attr('id')).offset().left;
										var Vglobal2cursor_y = $('#'+ui.helper.attr('id')).offset().top;
										console.log('Vglobal2cursor_x:'+Vglobal2cursor_x+';Vglobal2cursor_y:'+Vglobal2cursor_y);

										var Vlocal2cursor_x = Vglobal2cursor_x-Vglobal2local_x;
										var Vlocal2cursor_y = Vglobal2cursor_y-Vglobal2local_y;
										console.log("Vlocal2curor_x:"+(Vlocal2cursor_x+cursor2pointer_x)+"Vlocal2curor_y:"+(Vlocal2cursor_y+cursor2pointer_y));
										$.get(
											appLandmarks,{
												"command":"commandEditLandmark",
											  "LandmarkID":icon_div_set[curr_landmarks_set_id].LandmarkID,
											  "LandmarkName":icon_div_set[curr_landmarks_set_id].LandmarkName,
											  "MapID":MapID,
											  "location_x":Vlocal2cursor_x,
											  "location_y":Vlocal2cursor_y,
											  "HyperlinkLandmarkID":icon_div_set[curr_landmarks_set_id].HyperlinkLandmarkID,
											  "StoryID":StoryID
											},function (data) {


											}
										)

									}
						}

					);
				  //icon_div_set[i].HyperlinkMapID = HyperlinkMapID;
					//console.log('test:'+icon_div_set[i].HyperlinkMapID);
					if(icon_div_set[i].HyperlinkMapID==0){
						console.log('nothing');
						$('#'+icon_div_set[i].id).click(
							{param:i},
							function(e){
								 $('#edit_div_content_landmark_name').text(icon_div_set[e.data.param].LandmarkName);
								 if($('#edit_div').is(':visible')){
									 $('#edit_div').hide()
								 }else{
									$('#edit_div').show();
								}
									console.log(e.data.param+':'+icon_div_set[e.data.param].HyperlinkMapID);
							}
						)
					}else{
						//var tmp = landmarks_set_tmp[i].split(",")[6];
						//var tmp2 = landmarks_set_tmp[i].split(",")[7];
					  //      console.log(i);

						$('#'+icon_div_set[i].id).click(
							{param:i},
							function(e){
									$('#edit_div_content_landmark_name').text(icon_div_set[e.data.param].LandmarkName);
									$('#edit_div_content_landmark_hyperlink_landmark_id').text(icon_div_set[e.data.param].HyperlinkLandmarkID);
									$('#edit_div').attr('landmark_id',e.data.param)
									if($('#edit_div').is(':visible')){
 									 $('#edit_div').hide()
 								 }else{
 									$('#edit_div').show();
 								}
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
			//console.log(icon_div_set);
			for(var i in Vlocal2cursor_set){
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
		var Vlocal2mice_pointer_x = Vglobal2pointer_x-Vglobal2local_x;
		var Vlocal2mice_pointer_y = Vglobal2pointer_y-Vglobal2local_y;
		console.log('Vlocal2mice_pointer:'+'x:'+Vlocal2mice_pointer_x+';y:'+Vlocal2mice_pointer_y);
		var Vlocal2cursor_x = Vlocal2mice_pointer_x-cursor2pointer_x;
		var Vlocal2cursor_y = Vlocal2mice_pointer_y-cursor2pointer_y;
		if(currstate == STATEADDLANDMARK){
			$('#edit_div').show();
			$('#edit_div_content_landmark_name').text("new landmark");
			$('#edit_div_content_landmark_hyperlink_landmark_id').text("");
			$('body').css( 'cursor', 'auto' );
			var num_icon_div_set = Object.keys(icon_div_set).length;

			var Vlocal2pointer_x

			$.get(
				appLandmarks,{
					  "command":"commandAddLandmark",
					  "LandmarkName":"newLandmark",
					  "MapID":MapID,
					  "location_x":Vlocal2cursor_x,
					  "location_y":Vlocal2cursor_y,
					  "HyperlinkLandmarkID":0,
					  "StoryID":StoryID
				},function(data){
					//console.log(data);
					icon_div_set[data] = {
						"id":"icon_div_"+data,
						"LandmarkID":parseInt(data),
						"LandmarkName":"newLandmark",
						"MapID":MapID,
						"HyperlinkLandmarkID":data,
						"HyperlinkMapID":MapID


					}
					$('#edit_div').attr('landmark_id',data);
					Vlocal2cursor_set[data] = {
						"x":Vlocal2cursor_x,
						"y":Vlocal2cursor_y
					};
					$('#icon_layer').append("<div id=\""+icon_div_set[data].id+"\" class=\"icon\"><img id=\"icon\" src=\"assets/icon.png\"/></div>");
					$('#'+icon_div_set[data].id).css({ 'left': Vglobal2local_x+Vlocal2cursor_set[data].x + 'px', 'top': Vglobal2local_y+Vlocal2cursor_set[data].y + 'px' });
					$('#'+icon_div_set[data].id).draggable(

								{
									drag: function(e, ui){
										var tmp = ui.helper.attr('id');
										//console.log(tmp);
										curr_cursor_id = parseInt(tmp.split('_').pop());
										map_offset = $("#map").offset();
										Vglobal2local_x = map_offset.left;
										Vglobal2local_y = map_offset.top;
										var icon_offset = $(this).offset();
										var Vglobal2cursor_x = icon_offset.left;
										var Vglobal2cursor_y = icon_offset.top;;

										Vlocal2cursor_set[curr_cursor_id].x = -Vglobal2local_x + Vglobal2cursor_x;
										Vlocal2cursor_set[curr_cursor_id].y = -Vglobal2local_y + Vglobal2cursor_y;




								   },containment:
											$(this).parent().parent(),
									stop:
										function(e, ui){
												console.log(ui.helper.attr('id'))
												var curr_landmarks_set_id = ui.helper.attr('id').split('_').pop();
												//console.log(curr_landmarks_set_id);
												var offset = $('#map').offset();
												//Vglobal2local
												var Vglobal2local_x = offset.left;
												var Vglobal2local_y = offset.top;
												var Vglobal2cursor_x = $('#'+ui.helper.attr('id')).offset().left;
												var Vglobal2cursor_y = $('#'+ui.helper.attr('id')).offset().top;

												console.log('Vglobal2cursor_x:'+Vglobal2cursor_x+';Vglobal2cursor_y:'+Vglobal2cursor_y);

												var Vlocal2cursor_x = Vglobal2cursor_x-Vglobal2local_x;
												var Vlocal2cursor_y = Vglobal2cursor_y-Vglobal2local_y;
												//console.log("Vlocal2curor_x:"+Vlocal2cursor_x+cursor2pointer_x+"Vlocal2curor_y:"+Vlocal2cursor_y+cursor2pointer_y);
												console.log(icon_div_set);
												console.log(data);
												console.log(icon_div_set[data].LandmarkID);
												$.get(
													appLandmarks,{
													  "command":"commandEditLandmark",
													  "LandmarkID":icon_div_set[data].LandmarkID,
													  "LandmarkName":icon_div_set[data].LandmarkName,
													  "MapID":MapID,
													  "location_x":Vlocal2cursor_x,
													  "location_y":Vlocal2cursor_y,
													  "HyperlinkLandmarkID":0,//icon_div_set[curr_landmarks_set_id].HyperlinkLandmarkID,
													  "StoryID":StoryID
													},function (data) {
														console.log('test');

													}
												)

												if(icon_div_set[data].HyperlinkMapID==0){
															//console.log('nothing');
															$('#'+icon_div_set[icon_div_set.length-1].id).click(
																{param:i},
																function(e){
																	 $('#edit_div_content_title').text(icon_div_set[icon_div_set.length-1].LandmarkName);
																		$('#edit_div').show();
																		//console.log(e.data.param+':'+icon_div_set[icon_div_set.length-1].HyperlinkMapID);
																}
															)
												}else{


													$('#'+icon_div_set[data].id).click(

														function(e){
																$('#edit_div_content_landmark_name').text(icon_div_set[data].LandmarkName);
																$('#edit_div_content_landmark_hyperlink_landmark_id').text(icon_div_set[data].HyperlinkLandmarkID);
																$('#edit_div').show();
																//console.log(e.data.param+':'+icon_div_set[e.data.param].HyperlinkMapID);
														}
													)

												}




											}
								}

					);
				}
			)



			currstate = STATEIDLE;
		}
	}
	$( window ).resize(function() {
		console.log($( window ).width());
	});
});
