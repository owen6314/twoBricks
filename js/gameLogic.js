var gameCanvas, gameContext;
var mapWidth, mapHeight;
var unit,oldUnit; //单位，游戏区域宽度的1/12
var keys = [];
//物体类
var tunnel;
var fixedObstacle;
var square;
var isTwoPlayer = true;

var globalSpeed = 1;  //全局速度
var obstacleTimeRecorder; //控制障碍产生的计时器
var level;        //关卡

window.quantum = {}

quantum.prepare = function()
{
	gameCanvas = document.getElementById("gameCanvas");
	gameContext = gameCanvas.getContext("2d");

	mapWidth = window.innerWidth;
	mapHeight = window.innerHeight;
	mapWidth = mapWidth > mapHeight ? mapHeight : mapWidth;
	mapHeight = mapWidth;
	gameCanvas.width = mapWidth;
	gameCanvas.height = mapHeight;
	unit = mapWidth / 12;

	drawMap();
	tunnel = new tunnelObject();
	tunnel.init();
	tunnel.drawTunnel();
	square = new squareObject();
	square.init();
	square.drawSquare();
	fixedObstacle = new fixedObstacleObject();
	fixedObstacle.init();

	level = 1;
	obstacleTimeRecorder = Date.now();
	quantum.gameLoop();
}

quantum.gameLoop = function()
{
	requestAnimationFrame(quantum.gameLoop);

	drawMap();
	tunnel.drawTunnel();
	square.updateSquare();
	square.drawSquare();
	quantum.generateObstacle();
	fixedObstacle.updateFixedObstacle();
	fixedObstacle.drawFixedObstacle();
}

quantum.generateObstacle = function()
{
	if(level === 1)
	{
		if(Date.now() - obstacleTimeRecorder >= 3000)
		{
			obstacleTimeRecorder = Date.now();
			fixedObstacle.born();
		}
	}
}
quantum.prepare();
window.onresize = function()
{
	responsiveUpdate();
}

window.addEventListener("keydown", function (e) 
{
	//38向上，40向下，回车13，空格32，w87，s83
	e.preventDefault();
	//回车
	keys[e.keyCode] = true;
	/*
	if(isPaused === false && isStopped === false)
	{
    	keysDown[e.keyCode] = true;
	}*/
}, false);