$(function(){
	var canvas = $('.flasher')[0];
	var context = canvas.getContext('2d');
	var color = 1;
	var color1 = 0;
	var color2 = 120;
	var interval;
	var intervalMin = 50;
	var intervalMax = 125;
	var intervalTime = intervalMin;
	var modifier = 0.5;
	var running = false;
	var cursorX, cursorY;
	var mouseControl = false;

	$(canvas).attr({
		width: window.outerWidth,
		height: window.outerHeight
	});

	$(canvas).click(function(){
		if (!running) {
			start();
			running = true;
		} else {
			stopThePsy();
			running = false;
		}
		
	});

	document.onmousemove = function(e){
		cursorX = e.pageX;
		cursorY = e.pageY;
	};

	function stopThePsy () {
		clearInterval(interval);
	}

	function start () {
		interval = setInterval(function () {flash();},intervalTime/2);
	}

	function flash() {
		var c;
		if (color === 1) {
			c = color1;
			color = 2;
			color1 = (color1 >= 360)? color1-360:color1+1;
		} else {
			c = color2;
			color = 1;
			color2 = (color2 >= 360)? color2-360:color2+1;

			clearInterval(interval);

			if (!mouseControl){
				intervalTime = intervalTime + modifier;

				if (intervalTime > intervalMax || intervalTime < intervalMin) {
					modifier = -modifier;
				}
			} else {
				intervalTime = cursorX;
				//Map(cursorX, 0, window.outerHeight, intervalMin, intervalMax);
			}
			interval = setInterval(function () {
				flash();
			},intervalTime/2);
		}

		paint(c);


	}

	function paint (c) {
		context.fillStyle = hslToRgbString(c);
		context.fillRect(0,0,canvas.width,canvas.height);
	}

	//8 - 25 Hz oscillation = 125 millis 40millis

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
});