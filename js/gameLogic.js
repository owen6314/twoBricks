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
var utilTimeRecorder; //产生道具计时器
var level;        //关卡
var score1,score2; //两个玩家的得分
var isTwoPlayer = true;
var isPaused,isOver;

var bgMusic,getUtilSound,jumpSound;
var slowDownSound, speedUpSound,reverseSound,invisibleSound,changeSound,gunSound;
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
	//调整globalSpeed，更改碰撞检测
	globalSpeed = 2;
	totalUtilNum = 6;
	//道具图初始化
	initUtilImg();
	drawMap();
	//加载音效
	quantum.loadSounds();
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
quantum.loadSounds = function()
{
	/*
	bgMusic = new Audio();
	bgMusic.src = 'sound/bg.mp3';
	bgMusic.load();*/
	getUtilSound = new Audio();
	getUtilSound.src = 'sound/get.wav';
	getUtilSound.load();
	jumpSound = new Audio();
	jumpSound.src = 'sound/flash.wav';
	jumpSound.load();
	speedUpSound = new Audio();
	speedUpSound.src = 'sound/speedUpEffect.wav'
	speedUpSound.load();
	slowDownSound = new Audio();
	slowDownSound.src = 'sound/slowDownEffect.mp3'
	slowDownSound.load();
	reverseSound = new Audio();
	reverseSound.src = 'sound/reverseEffect.mp3'
	reverseSound.load();
	invisibleSound = new Audio();
	invisibleSound.src = 'sound/invisibleEffect.wav';
	invisibleSound.load();
	changeSound = new Audio();
	changeSound.src = ''
	changeSound.load();
	gunSound = new Audio();
	gunSound.src="sound/gunEffect.mp3";
	gunSound.load();
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
		if(Date.now() - obstacleTimeRecorder >= 10000)
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