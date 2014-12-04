$(function(){
	var canvas = $('.flasher')[0];
	var context = canvas.getContext('2d');
	var color = 1; // Boolean state
	var colorHue = 0; //
	var colorOffset = 120; // between 1 and 360
	var interval;
	var intervalMin = 40; //40 Milliseconds = periode of 25Hz 
	var intervalMax = 125; //125 Milliseconds = periode of 8Hz
	var intervalTime = intervalMax; // start with 8Hz wave
	var modifier = 0.5;
	var running = false;
	var cursorX, cursorY;
	var mouseControl = false;

	/**
	*Set canvas fullscreen	
	*/
	$(canvas).attr({
		width: window.outerWidth,
		height: window.outerHeight
	});

	/**
	* Click on the canvas to toggle the flashing
	*/
	$(canvas).click(function(){
		if (!running) {
			startFlashing();
		} else {
			stopFlashing();
		}
	});

	/**
	* Get mouse position for manual control
	*/
	document.onmousemove = function(e){
		cursorX = e.pageX;
		cursorY = e.pageY;
	};

	/**
	* Stop the flashing
	*/
	function stopFlashing () {
		clearInterval(interval);
		running = false;
	}

	/**
	 * Start the flashing
	 * by setting interval
	 */
	function startFlashing () {
		interval = setInterval(function () {
			flash();
		},intervalTime/2);
		running = true;
	}

	/**
	 * Flash and alternate between colors using colorOffset
	 */
	function flash() {
		var c;
		if (color) {
			color--;
			//set primary color
			c = colorHue;
			colorHue = (colorHue >= 360)? colorHue-360:colorHue+1;
		} else {
			color++;
			// calculate second color
			c = colorHue + colorOffset;
			
			if (!mouseControl){
				intervalTime = intervalTime + modifier;

				// takes care of sweeping through 8 and 25Hz
				if (intervalTime > intervalMax || intervalTime < intervalMin) {
					modifier = -modifier;
				}
			} else {
				intervalTime = mapToRange(cursorY, 0, window.outerHeight, intervalMin, intervalMax);
				colorOffset = mapToRange(cursorX, 0, window.outerWidth, 10,350);
			}
			clearInterval(interval);
			interval = setInterval(function () {
				flash();
			},intervalTime/2);
		}
		paint(c);
	}

	/**
	 * Assumes c is a color in the set [0,360]
	 * It paints a fullcanvas rect with that color
	 *
	 * @param	Number c 	The hue
	 */
	function paint (c) {
		context.fillStyle = hslToRgbString(c);
		context.fillRect(0,0,canvas.width,canvas.height);
	}

	
	/**
	 * Assumes h is contained in the set [0, 360] and
	 * returns r, g, and b in a rgb() String
	 *
	 * @param   Number  h       The hue
	 * @return  String          The rgb(r,g,b) representation
	 */
	function hslToRgbString(h){
		var hue = h/360;
        var r = hue2rgb(hue + 1/3);
        var g = hue2rgb(hue);
        var b = hue2rgb(hue - 1/3);

	    return "rgb(" + Math.round(r * 255)+","+ Math.round(g * 255)+","+ Math.round(b * 255) + ")";
	}

	function hue2rgb(t){
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return 6 * t;
        if(t < 1/2) return 1;
        if(t < 2/3) return (2/3 - t) * 6;
        return 0;
    }

    function mapToRange(value, oldMin, oldMax, newMin, newMax) {
    	var oldRange = oldMax - oldMin;
    	var newRange = newMax - newMin;
    	return (((value - oldMin)* newRange)/ oldRange) + newMin;
    }
});