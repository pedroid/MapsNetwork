function protagonist_change_direction(direction) {

    const interval = 100; //100 ms of interval for the setInterval()
    const diff_x = 41; //diff as a variable for position offset
	const diff_y = 42; //diff as a variable for position offset
	var position_x = 0; //start position for the image slicer
	//var position_y = -2*diff_y; //-diff_y: SE, -2*diff_y: E
  if (direction == "ES"){
    position_y = -diff_y;
  } elseif (direction == "E"){
    position_y = -2*diff_y;
  }
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
