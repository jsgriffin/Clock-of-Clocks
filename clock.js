var bgCanvas = null;
var bgContext = null;
var fgCanvas = null;
var fgContext = null;
var numClocks = 24;
var width = 100;
var height = 100;
var padding = 8;
var timeouts = new Array(new Array(3), new Array(3), new Array(3), new Array(3), new Array(3), new Array(3), new Array(3), new Array(3));
var targets = new Array(new Array(3), new Array(3), new Array(3), new Array(3), new Array(3), new Array(3), new Array(3), new Array(3));
var current =  [[{hour: 0, minute: 0}, {hour: 0, minute: 0}, {hour: 0, minute: 0}], 
				[{hour: 0, minute: 0}, {hour: 0, minute: 0}, {hour: 0, minute: 0}], 
				[{hour: 0, minute: 0}, {hour: 0, minute: 0}, {hour: 0, minute: 0}], 
				[{hour: 0, minute: 0}, {hour: 0, minute: 0}, {hour: 0, minute: 0}], 
				[{hour: 0, minute: 0}, {hour: 0, minute: 0}, {hour: 0, minute: 0}], 
				[{hour: 0, minute: 0}, {hour: 0, minute: 0}, {hour: 0, minute: 0}], 
				[{hour: 0, minute: 0}, {hour: 0, minute: 0}, {hour: 0, minute: 0}], 
				[{hour: 0, minute: 0}, {hour: 0, minute: 0}, {hour: 0, minute: 0}]];

var arrangements = {
	0: {
		0: {hour: 3, minute: 30},
		1: {hour: 9, minute: 30},
		2: {hour: 12, minute: 30},
		3: {hour: 12, minute: 30},
		4: {hour: 12, minute: 15},
		5: {hour: 9, minute: 0}
	},
	1: {
		0: {hour: 7, minute: 35},
		1: {hour: 6, minute: 30},
		2: {hour: 7, minute: 35},
		3: {hour: 12, minute: 30},
		4: {hour: 7, minute: 35},
		5: {hour: 12, minute: 0}		
	},
	2: {
		0: {hour: 3, minute: 15},
		1: {hour: 9, minute: 30},
		2: {hour: 6, minute: 15},
		3: {hour: 12, minute: 45},
		4: {hour: 12, minute: 15},
		5: {hour: 9, minute: 45}		
	},
	3: {
		0: {hour: 3, minute: 15},
		1: {hour: 9, minute: 30},
		2: {hour: 3, minute: 15},
		3: {hour: 9, minute: 30},
		4: {hour: 3, minute: 15},
		5: {hour: 12, minute: 45}		
	},
	4: {
		0: {hour: 6, minute: 30},
		1: {hour: 6, minute: 30},
		2: {hour: 12, minute: 15},
		3: {hour: 9, minute: 30},
		4: {hour: 7, minute: 35},
		5: {hour: 12, minute: 0}		
	},
	5: {
		0: {hour: 3, minute: 30},
		1: {hour: 9, minute: 45},
		2: {hour: 12, minute: 15},
		3: {hour: 9, minute: 30},
		4: {hour: 3, minute: 15},
		5: {hour: 12, minute: 45}		
	},
	6: {
		0: {hour: 6, minute: 30},
		1: {hour: 7, minute: 35},
		2: {hour: 12, minute: 15},
		3: {hour: 9, minute: 30},
		4: {hour: 12, minute: 15},
		5: {hour: 9, minute: 0}		
	},
	7: {
		0: {hour: 3, minute: 15},
		1: {hour: 9, minute: 30},
		2: {hour: 7, minute: 35},
		3: {hour: 12, minute: 30},
		4: {hour: 7, minute: 35},
		5: {hour: 12, minute: 0}		
	},
	8: {
		0: {hour: 6, minute: 15},
		1: {hour: 9, minute: 30},
		2: {hour: 6, minute: 15},
		3: {hour: 9, minute: 30},
		4: {hour: 12, minute: 15},
		5: {hour: 12, minute: 45}		
	},
	9: {
		0: {hour: 6, minute: 15},
		1: {hour: 9, minute: 30},
		2: {hour: 12, minute: 15},
		3: {hour: 9, minute: 30},
		4: {hour: 7, minute: 35},
		5: {hour: 12, minute: 0}		
	}
};

function drawClockFace(x, y, width, height) {
	// Add the shadow
	bgContext.shadowOffsetX = 0;
	bgContext.shadowOffsetY = 0;
	bgContext.shadowBlur = 10;
	bgContext.shadowColor = '#444444';	
	bgContext.fillStyle = '#FFFFFF';
	bgContext.fillRect(x, y, width, height);
	bgContext.shadowBlur = 0;
	
	// Add the thick frame
	var blackGradient = bgContext.createLinearGradient(0, y, 0, y + height);
	blackGradient.addColorStop(0, '#F2F2F2');
	blackGradient.addColorStop(1, '#C3C3C3');
	bgContext.fillStyle = blackGradient;
	bgContext.fillRect(x, y, width, height);	
	
	// Add the frame highlight
	blackGradient.addColorStop(0, '#999999');
	blackGradient.addColorStop(1, '#777777');
	bgContext.fillStyle = blackGradient;
	bgContext.fillRect(x + 8, y + 8, width - 16, height - 16);
	
	// Draw the clock inner
	bgContext.fillStyle = '#F8F8F8';
	bgContext.fillRect(x + 10, y + 10, width - 20, height - 20);
	
	// Add a highlight
	var whiteGradient = bgContext.createLinearGradient(0, y + 30, 0, y + height);
	whiteGradient.addColorStop(0, '#E8E8E8');
	whiteGradient.addColorStop(1, '#FFFFFF');
	
	bgContext.beginPath();
	bgContext.moveTo(x + 10, y + (height / 2));
	bgContext.lineTo(x + 10, y + height - 10);
	bgContext.lineTo(x + width - 10, y + height - 10);
	bgContext.lineTo(x + width - 10, y + (height / 2));
	bgContext.bezierCurveTo(x + 2*(width / 3), y + (height / 2) - 10, x + (width / 3), y + (height / 2) - 10, x + 10, y + (height / 2));
	bgContext.closePath();
	bgContext.fillStyle = whiteGradient;
	bgContext.fill();
	
	// Add the roman numerals
	/*var fontSize = 24;

	bgContext.fillStyle = '#9C826F';
	bgContext.font = '' + fontSize + 'px times new roman';	
	bgContext.save();
	bgContext.translate(x + (width / 2), y + (height / 2));
		
	var textY = -1 * (width - 60) / 2;	
	var textSize = bgContext.measureText('XII');
	bgContext.fillText('XII', -1 * (textSize.width / 2), textY);
	
	textSize = bgContext.measureText('III');
	bgContext.rotate(Math.PI / 2);
	bgContext.fillText('III', -1 * (textSize.width / 2), textY);

	textSize = bgContext.measureText('VI');
	bgContext.rotate(Math.PI / 2);
	bgContext.fillText('VI', -1 * (textSize.width / 2), textY);
	
	textSize = bgContext.measureText('IX');
	bgContext.rotate(Math.PI / 2);
	bgContext.fillText('IX', -1 * (textSize.width / 2), textY);
	
	bgContext.restore();*/
}

function drawHands(xPos, yPos, hourAngle, minuteAngle) {
	//var hour = new Date().getHours();
	//var minutes = new Date().getMinutes();
	
	var x = padding + (xPos * (width + padding));
	var y = padding + (yPos * (height + padding));
	
	var hoursLength = ((width/2) - 15);
	var minutesLength = hoursLength;
	
	// Add a shadow to the hands
	fgContext.shadowOffsetX = 0;
	fgContext.shadowOffsetY = 0;
	fgContext.shadowBlur = 4;
	fgContext.shadowColor = '#999999';
	
	fgContext.clearRect(x, y, width, height);
	
	fgContext.save();
	
	// Draw the hour hand
	fgContext.fillStyle = '#000000';
	fgContext.translate(x + (width / 2), y + (height / 2));
	fgContext.rotate((hourAngle * Math.PI) / 180);
	fgContext.fillRect(-3, -1 * hoursLength, 6, hoursLength);
	
	fgContext.restore();
	fgContext.save();
	
	// Draw the minute hand
	fgContext.translate(x + (width / 2), y + (height / 2));
	fgContext.rotate((minuteAngle * Math.PI) / 180);
	fgContext.fillRect(-3, -1 * minutesLength, 6, minutesLength);	
	
	fgContext.restore();	
	fgContext.save();
	
	fgContext.shadowBlur = 0;

	// Add the central circle
	fgContext.fillStyle = '#000000';
	fgContext.translate(x + (width / 2), y + (height / 2));
	fgContext.beginPath(); 
	fgContext.arc(0, 0, 4, 0, Math.PI * 2, false); 
	fgContext.closePath();
	fgContext.fill();
	
	// Add the screw head
	fgContext.fillStyle = '#C29428';
	fgContext.beginPath(); 
	fgContext.arc(0, 0, 2, 0, Math.PI * 2, false); 
	fgContext.closePath();
	fgContext.fill();

	fgContext.restore();
	
	current[xPos][yPos] = {hour: hourAngle, minute: minuteAngle};
	
	// Loop if we haven't reached the target angle
	if(!withinRange(hourAngle, targets[xPos][yPos].hour, 0.5) || !withinRange(minuteAngle, targets[xPos][yPos].minute, 0.5)) {
		var hourChange = Math.abs((hourAngle - targets[xPos][yPos].hour) / 40);
		var minuteChange = Math.abs((minuteAngle - targets[xPos][yPos].minute) / 40);
		timeouts[xPos][yPos] = setTimeout('drawHands('+xPos+', '+yPos+', '+((hourAngle + hourChange) % 360)+', '+((minuteAngle + minuteChange) % 360)+')', 5);
	}
}

function withinRange(a, b, range) {
	return (a <= b && ((a + range) >= b)) || (a >= b && ((a - range) <= b));
}

function animateToTime(xPos, yPos, hours, minutes) {
	var hourAngle = (360 / 12) * hours;
	var minuteAngle = (360 / 60) * minutes;
	
	hourAngle = (hourAngle == 0) ? 360 : hourAngle;
	minuteAngle = (minuteAngle == 0) ? 360 : minuteAngle;
	
	targets[xPos][yPos] = {hour: hourAngle, minute: minuteAngle};
	timeouts[xPos][yPos] = setTimeout('drawHands('+xPos+', '+yPos+', '+current[xPos][yPos].hour+', '+current[xPos][yPos].minute+')', 0);
}

function displayTime() {
	var hour = new Date().getHours().toString();
	var minute = new Date().getMinutes().toString();
	var hourL, hourR, minL, minR;
	
	if(hour.length == 1) {
		hourL = '0';
		hourR = hour; 
	} else {
		hourL = hour.substring(0, 1);
		hourR = hour.substring(1, 2);
	}
	
	if(minute.length == 1) {
		minL = '0';
		minR = minute;
	} else {
		minL = minute.substring(0, 1);
		minR = minute.substring(1, 2);
	}
	
	displayNumber(0, hourL);
	displayNumber(1, hourR);
	displayNumber(2, minL);
	displayNumber(3, minR);
}

function displayNumber(position, number) {
	var arrangement = arrangements[number];
	
	for(var i = 0; i < 6; i++) {
		animateToTime((i % 2) + (position * 2), Math.floor(i / 2), arrangement[i].hour, arrangement[i].minute);
	}
}

window.onload = function() {
	bgCanvas = document.getElementById("background");
	bgContext = bgCanvas.getContext('2d');
	
	fgCanvas = document.getElementById("foreground");
	fgContext = fgCanvas.getContext('2d');
	
	for(var i = 0; i < numClocks; i++) {
		var xPos = i % 8;
		var yPos = Math.floor(i/8);
		
		drawClockFace(padding + xPos * (width + padding), padding + yPos * (height + padding), width, height);
	}
	
	displayTime();
	setInterval('displayTime()', 5000);
}