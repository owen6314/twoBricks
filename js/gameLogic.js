var gameCanvas, gameContext;
var mapWidth, mapHeight;
var unit,oldUnit; //单位，游戏区域宽度的1/12
var keys = [];
//物体类
var tunnel;
var fixedObstacle;
var square;
var util;

var globalSpeed;  //全局速度
var obstacleTimeRecorder; //控制障碍产生的计时器
var utilTimeRecorder;
var level;        //关卡
var score1,score2; //两个玩家的得分
var isTwoPlayer = true;
var isPaused,isOver;
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

	//变量初始化在prepare中
	level = 1;
	score1 = 0;
	score2 = 0;
	isPaused = false;
	isOver = false;
	globalSpeed = 2;
	drawMap();

	tunnel = new tunnelObject();
	tunnel.init();
	tunnel.drawTunnel();
	square = new squareObject();
	square.init();
	square.drawSquare();
	fixedObstacle = new fixedObstacleObject();
	fixedObstacle.init();
	util = new utilObject();
	util.init();

	obstacleTimeRecorder = Date.now();
	utilTimeRecorder = Date.now();
	quantum.gameLoop();
}

quantum.gameLoop = function()
{
	requestAnimationFrame(quantum.gameLoop);

	drawMap();
	drawUserStatus();
	tunnel.drawTunnel();
	square.updateSquare();
	square.drawSquare();
	quantum.generateObstacle();
	fixedObstacle.updateFixedObstacle();
	fixedObstacle.drawFixedObstacle();
	quantum.generateUtil();
	util.updateUtil();
	util.drawUtil();

	quantum.updateScore();
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
quantum.generateUtil = function()
{
	if(level === 1)
	{
		if(Date.now() - utilTimeRecorder >= 2000)
		{
			utilTimeRecorder = Date.now();
			util.born();
		}
	}
}
quantum.updateScore = function()
{
	if(!square.isBlocked[0])
		score1++;
	if(!square.isBlocked[1])
		score2++;

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
	
	//keysDown的处理在square.js中
	if(isPaused === false && isOver === false)
	{
    	keys[e.keyCode] = true;
	}
}, false);