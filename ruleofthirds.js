/****************************************
	Rule of Thirds
	by Johnny
	
****************************************/

var map = [
[1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
[1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
[1, 1, 0, 0, 0, 0, 0, 0, 1, 1], 
[1, 1, 0, 0, 0, 0, 0, 0, 1, 1], 
[1, 1, 0, 0, 0, 0, 0, 0, 1, 1], 
[1, 1, 0, 0, 0, 0, 0, 0, 1, 1], 
[1, 1, 0, 0, 0, 0, 0, 0, 1, 1], 
[1, 1, 0, 0, 0, 0, 0, 0, 1, 1], 
[1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
[1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

var $ = function(id) {return document.getElementById(id); };

var groundImage = new Image(); groundImage.src = "grass.png";
var wallImage = new Image(); wallImage.src = "dirt.png";
var monsterImage = new Image(); monsterImage.src = "romneye.png";
var rockImage = new Image(); rockImage.src = "art/I_Rock01.png";
var potionImage = new Image(); potionImage.src = "art/P_Green01.png";
var iceImage = new Image(); iceImage.src = "art/S_Ice01.png";
var hatImage = new Image(); hatImage.src = "art/C_Hat03.png";
var chestImage = new Image(); chestImage.src = "art/I_Chest01.png";
var necklaceImage = new Image(); necklaceImage.src = "art/Ac_Necklace01.png";

var currentImage;
var nextImage;

var score = 0;

var look = {
	x: 5,
	y: 5
};

var monsters = [

dragon = {
	name: "Dragon",
	color: "#FF00FF",
	x: 2,
	y: 2,
}

];

generateNextObject();
currentImage = nextImage;

var mapWidth;
var mapHeight;
var MapScale = 32;
var turn = 1;
var nextObjectID;
var currentID;

var lookMode = true;

current = look;

function init() {
	mapWidth = map[0].length;
	mapHeight = map.length;
	
	bindKeys();
		
	currentID = nextObjectID
	currentImage = nextImage;
	generateNextObject();
	
	initialMap();
	
	drawMap();		
	gameCycle();
}

function bindKeys() {
	document.onkeydown = function(e) {
		switch (e.keyCode) {
			
			case 104:
			case 38: move(current, 0, -1);	break;
			case 98:
			case 40: move(current, 0, 1);	break;
			case 100:
			case 37: move(current, -1, 0);	break;
			case 102:
			case 39: move(current, 1, 0);	break;
			
			case 101: move(current, 0, 0);	break;
			case 99: move(current, 1, 1);	break;
			case 97: move(current, -1, 1);	break;
			case 105: move(current, 1, -1);	break;
			case 103: move(current, -1, -1);	break;
		}
		
		switch (e.keyCode) {						
			case 13: place(look.x, look.y);	break;
		}
	};
}

function gameCycle() {
	drawMap();
	setTimeout(gameCycle, 1000 / 60);
}

function generateNextObject() {
	var r = rand(0,100);
	//console.log(r);
	
	if (r < 60) {
		nextImage = hatImage;
		nextObjectID = 2;
		} else if (r < 80) {
		nextImage = potionImage;
		nextObjectID = 3;
		
		} else if (r < 95) {
		nextImage = iceImage;
		nextObjectID = 4;
		
		} else {
		nextImage = rockImage;
		nextObjectID = 5;
	}
	//console.log("ID " + nextObjectID);
}

function initialMap() {
	var r = rand(6, 15);
	//console.log(r);
	
	while (r > 0) {
		var randx = rand(2, 7)
		var randy = rand(2, 7)
		
		generateNextObject()
		map[randy][randx] = currentID;
		
		currentID = nextObjectID
		currentImage = nextImage;
		generateNextObject();
		
		r--
	}
}

function place(x, y) {
	var wall = map[y][x];
	if (wall == 0) {
		map[y][x] = currentID;
	} else return
	
	combine(currentID, x, y);
	
	currentID = nextObjectID
	currentImage = nextImage;
	generateNextObject();
	
	for (var i = 0; i < monsters.length; i++) {
		move(monsters[i], rand(-1,1), rand(-1,1));
	};
	
	turn++;
}

function combine(currentID, x, y) {
	var places = [];
	
	//check for an initial hit of at least 2
	var f = places.length;	
	check(currentID, x, y, places)
	
	//look for extra matches if you found >1 before
	if (f < 1) {
		check(currentID, x, y-1, places);
		check(currentID, x, y+1, places);
		check(currentID, x-1, y, places);
		check(currentID, x+1, y, places);
	}
	
	if (places.length > 2) {
		console.log('remove that shit');
		//console.log(places);
		for (var i = 0; i < places.length; i++) {
			console.log(places[i]);
			if (currentID != 7) map[places[i].slice(1,8)][places[i].slice(0,1)] = 0;
		}
		
		if (currentID == 6) {
			currentID = 7;
			map[y][x] = 7;
			combine(currentID,x,y);
			} else if (currentID == 7) {
			
			} else {
			currentID = 6;
			map[y][x] = 6;
			combine(currentID,x,y);
		}
		//remove things in places
	}
}

function check(currentID, x, y, places) {
	var center = map[y][x];
	var wallUP = map[y-1][x];
	var wallDOWN = map[y+1][x];
	var wallLEFT = map[y][x-1];
	var wallRIGHT = map[y][x+1];
	var toPush;
	
	if (center == currentID) {
		toPush = new Array(x, y);
		if (indexOfArray(toPush, places) == -1) places.push(toPush);
		
		if (wallUP == currentID) {
			toPush = new Array(x, y-1);
			if (indexOfArray(toPush, places) == -1) places.push(toPush);
		}
		if (wallDOWN == currentID) {
			toPush = new Array(x, y+1);
			if (indexOfArray(toPush, places) == -1) places.push(toPush);
		}
		if (wallLEFT == currentID) {
			toPush = new Array(x-1, y);
			if (indexOfArray(toPush, places) == -1) places.push(toPush);
		}
		if (wallRIGHT == currentID) {
			toPush = new Array(x+1, y);
			if (indexOfArray(toPush, places) == -1) places.push(toPush);
		}
	}
	//console.log(places.length);
}

function indexOfArray(val, array) {
	var
	hash = {},
	indexes = {},
	i, j;
	for(i = 0; i < array.length; i++) {
		hash[array[i]] = i;
	}
	return (hash.hasOwnProperty(val)) ? hash[val] : -1;
};

function move(object, x, y) {	
	var newX = object.x + x; // calculate new player position
	var newY = object.y + y;
	
	if (isBlocking(object, newX, newY)) { // are we allowed to move to the new position?
		return; // nope!
	}
	
	//don't monsters overlap
	for (var i = 0; i < monsters.length; i++) {
		for (var j = 0; j < monsters.length; j++) {
			if (i != j) {
				if (object == monsters[i]) {
					if ((newX == monsters[j].x) && (newY == monsters[j].y)) {
						return;
					}
				}
			}
		}
	}
	
	object.x = newX; // set new position
	object.y = newY;
}

function isBlocking(object, x, y) {
	// first make sure that we cannot move outside the boundaries of the level
	if (y < 0 || y >= mapHeight || x < 0 || x >= mapWidth) return true;
	
	// return true if the map block is not 0, ie. if there is a blocking wall.
	if (object != look) return (map[Math.floor(y)][Math.floor(x)] !== 0);	
}

function drawMap() {
	var Map = $("map"); // the actual map
	var MapCtr = $("mapcontainer"); // the container div element
	var MapObjects = $("mapobjects"); // the canvas used for drawing the objects on the map (player character, etc)
	var Stats = $("stats");
	
	Map.width = mapWidth * MapScale; // resize the internal canvas dimensions 
	Map.height = mapHeight * MapScale; // of both the map canvas and the object canvas
	MapObjects.width = Map.width;
	MapObjects.height = Map.height;
	Stats.width = Map.width;
	Stats.height = Map.height;
	
	//draw 'blank' background
	var ctx = Map.getContext("2d");
	var objectCtx = MapObjects.getContext("2d");
	var stats = Stats.getContext("2d");
	
	stats.fillStyle = 'white';
	stats.font = '18px Monospace';
	stats.fillText('Turn ' + turn, 0,18); 
	stats.fillText('Score ' + score, 0,18*2); 
	
	stats.fillText('Up next', 0,18*5); 
	stats.drawImage(nextImage, 0, 18*5.2);
	//draw walls
	drawWalls(ctx, objectCtx)
	
	for (i = 0; i < monsters.length; i++) {
		drawObject(monsters[i]);
	}	
	
	//draw look
	drawLook(objectCtx);
	
}

function drawLook(objectCtx) {
	var Stats = $("stats");
	var stats = Stats.getContext("2d");
	var wall = map[look.y][look.x];
	
	for (var i = 0; i < monsters.length; i++) {
		if (((look.x) == monsters[i].x)&&((look.y) == monsters[i].y)) { 
			var lookMonster = true;
			var lookname = monsters[i].name;
		}
	};
	
	if (lookMode) {
		objectCtx.drawImage(currentImage, look.x * MapScale, look.y * MapScale);
		objectCtx.fillStyle = "rgba(0,0,0,.2)";
		objectCtx.fillRect(look.x * MapScale, look.y * MapScale, MapScale, MapScale);
		objectCtx.fillStyle = 'black';
		objectCtx.font = '12px Monospace';
		objectCtx.fillText((look.x) + ', ' + (look.y), look.x * MapScale, look.y * MapScale); 	
		
		if (lookMonster) {
			stats.fillText(lookname, 0,18*10);
			} else if (wall == 0) {
			stats.fillText('This is the ground.', 0,18*10); 
			} else if (wall == 1) {
			stats.fillText('This is a wall.', 0,18*10);			
			} else if (wall == 2) {
			stats.fillText('This is a hat.', 0,18*10); 
			} else if (wall == 3) {
			stats.fillText('This is a potion.', 0,18*10); 
			} else if (wall == 4) {
			stats.fillText('This is a block of ice.', 0,18*10); 
			} else if (wall == 5) {
			stats.fillText('This is a rock.', 0,18*10); 
			} else if (wall == 6) {
			stats.fillText('This is a chest.', 0,18*10); 
			} else if (wall == 7) {
			stats.fillText('This is a necklace.', 0,18*10); 
			} else if (wall == 8) {
			stats.fillText('This is a 8.', 0,18*10); 
			} 		
	}
}

function drawWalls(ctx, objectCtx) {
	for (var y = 0; y < mapHeight; y++) {
		for (var x = 0; x < mapWidth; x++) {
			var wall = map[y][x];
			
			if (wall == 0) { ctx.drawImage(groundImage, x * MapScale, y * MapScale);
				} else if (wall == 1) { ctx.drawImage(wallImage, x * MapScale, y * MapScale);
				} else if (wall == 2) { 
				ctx.drawImage(groundImage, x * MapScale, y * MapScale);
				objectCtx.drawImage(hatImage, x * MapScale, y * MapScale);
				} else if (wall == 3) { 
				ctx.drawImage(groundImage, x * MapScale, y * MapScale);
				objectCtx.drawImage(potionImage, x * MapScale, y * MapScale);
				} else if (wall == 4) { 
				ctx.drawImage(groundImage, x * MapScale, y * MapScale);
				objectCtx.drawImage(iceImage, x * MapScale, y * MapScale);
				} else if (wall == 5) { 
				ctx.drawImage(groundImage, x * MapScale, y * MapScale);
				objectCtx.drawImage(rockImage, x * MapScale, y * MapScale);
				} else if (wall == 6) { 
				ctx.drawImage(groundImage, x * MapScale, y * MapScale);
				objectCtx.drawImage(chestImage, x * MapScale, y * MapScale);
				} else if (wall == 7) { 
				ctx.drawImage(groundImage, x * MapScale, y * MapScale);
				objectCtx.drawImage(necklaceImage, x * MapScale, y * MapScale);
			} 
		}
	}
}

function drawObject(object) {
	var MapObjects = $("mapobjects");
	var objectCtx = MapObjects.getContext("2d");
	
	objectCtx.drawImage(monsterImage, object.x * MapScale, object.y * MapScale);
}

//a not shitty random function
function rand (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

init();										