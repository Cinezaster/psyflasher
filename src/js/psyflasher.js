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
	var state = 0;
	var cursorX, cursorY;
	var mouseControl = false;

	function init(){
		canvasToFullscreen();
		beginState();
	}

	/**
	* Click on the canvas to toggle the flashing
	*/
	$(canvas).click(function(){
		state++;
		switchState();
	});

	$( window ).resize(function() {
		canvasToFullscreen();
	});

	/**
	*Set canvas fullscreen	
	*/
	function canvasToFullscreen () {
		$(canvas).attr({
			width: window.outerWidth,
			height: window.outerHeight
		});
	}

	/**
	* Get mouse position for manual control
	*/
	document.onmousemove = function(e){
		cursorX = e.pageX;
		cursorY = e.pageY;
	};

	function switchState(){
		switch (state) {
			case 0:
				stopFlashing();
				beginState();
				break;
			case 1:
				startFlashing();
				break;
			case 2:
				mouseControl = true;
				break;
			case 3:
				mouseControl = false;
				state = 0;
				switchState();
				break;
		}
	}

	function beginState() {
		paint('rgb(255,255,255)');
		context.fillStyle = 'black';
		context.font = "bold 30px Verdana";
		context.fillText("PSY-Flasher", 100,70);
		context.font = "17px Verdana";
		context.fillText("First click: auto mode", 100,100);
		context.fillText("Second click: manual mode", 100,130);
		context.fillText("Third click: back at start", 100,160);
		context.fillStyle = 'grey';
		context.font = "10px Verdana";
		context.fillText("By Cinezaster", 100,190);
		var gradient = context.createRadialGradient(50,120,1,50,120,80);
		var gradientQuality = 15;
		for (var i = gradientQuality - 1; i > 0; i--) {
			gradient.addColorStop(i*(1/(gradientQuality)),hslToRgbString(i*(360/gradientQuality)));
		}
		context.fillStyle = gradient;
		context.fillRect(10,48,80,143);

	}

	/**
	* Stop the flashing
	*/
	function stopFlashing () {
		clearInterval(interval);
	}

	/**
	 * Start the flashing
	 * by setting interval
	 */
	function startFlashing () {
		interval = setInterval(function () {
			flash();
		},intervalTime/2);
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
		paint(hslToRgbString(c));
	}

	/**
	 * Assumes c is a color in the set [0,360]
	 * It paints a fullcanvas rect with that color
	 *
	 * @param	Number c 	The hue
	 */
	function paint (c) {
		context.fillStyle = c;
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

    init();
});