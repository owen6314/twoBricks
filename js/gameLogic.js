var gameCanvas, gameContext;
var BGCanvas, BGContext;
var mapX, mapY,mapWidth, mapHeight; //mapX和mapY是地图相对于背景的偏移量
var BGWidth, BGHeight;
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

var bgMusic,getUtilSound,jumpSound,winSound,evilLaughSound;
var slowDownSound, speedUpSound,reverseSound,invisibleSound,changeSound,gunSound;

window.quantum = {}

quantum.prepare = function()
{
	//创建游戏区域和背景区域
	BGCanvas = document.getElementById("outer")
	BGContext = BGCanvas.getContext("2d");
	gameCanvas = document.getElementById("inner");
	gameContext = gameCanvas.getContext("2d");

	BGWidth = window.innerWidth;
	BGHeight = window.innerHeight;

	mapWidth = window.innerWidth;
	mapHeight = window.innerHeight;
	BGCanvas.width = mapWidth;
	BGCanvas.height = mapHeight;
	//使map为正方形
	mapWidth = mapWidth > mapHeight ? mapHeight : mapWidth;
	mapHeight = mapWidth;
	//map相对于背景的偏移量
	mapX = (BGWidth - mapWidth) / 2;
	mapY = $("#inner").position().top;
	gameCanvas.width = mapWidth;
	gameCanvas.height = mapHeight;
	//unit为单位长度
	unit = mapWidth / 12;

	initBackground();

	level = 0;

	//道具图初始化
	initUtilImg();
	//加载音效
	quantum.loadSounds();
	//初始化元素,tunnel画出来后先被隐藏
	tunnel = new tunnelObject();
	tunnel.init();
	tunnel.drawTunnel();

	square = new squareObject();
	square.preInit();
	//square.drawSquare();
	fixedObstacle = new fixedObstacleObject();
	fixedObstacle.init();

	util = new utilObject();
	util.init();
	
	//动画开始前的准备工作
	$("#leftWall").hide();
	$("#rightWall").hide();
	$("#shadow").hide();
	$("#outer").hide();
	$("#slogan").hide();
	$("#threat").hide();
	//绘制方块
	$("#girl").width(square.a[0]);
	$("#girl").height(square.a[0]);
	$("#girl").css({"left": mapX + square.x[0] + 2 * unit,"top":mapY + (square.y[0] + square.y[1]) / 2});
	square.drawSquare();

	//在三个方块同在的背景界面停留
	//setTimeout(quantum.startAnimation,8000);

	//动画，之后开始游戏
	//setTimeout(quantum.gameInit,31000);

	quantum.gameInit();

}
//开场动画，待完善
quantum.startAnimation = function()
{
	//震动效果
	$("body").effect("shake",{distance:20,times:10});
	//墙进入画面
	setTimeout(function(){$("#leftWall").width(mapX);
	$("#leftWall").height(BGHeight);
	$("#leftWall").slideDown(3000);
	$("#rightWall").width(mapX);
	$("#rightWall").height(BGHeight);
	$("#rightWall").css({"left":mapX + mapWidth,"top":0});
	$("#rightWall").slideDown(3000);
	},2000);
	//墙落下时小方块的上下震动效果
	setTimeout(function(){
		$("#girl,#inner").effect("shake",{direction:"up",distance:20,times:1});
		fallSound.play();
		setTimeout(function(){
			//显示恶魔头像（与"Only one can survive"),粉色方块开始抖动
			$("#threat").css({"left":mapX,"top":unit,"width":mapWidth,"height":unit,"fontSize":unit / 2 + "px"});
			$("#threat").show("fade");
			evilLaughSound.play();
			setTimeout(function(){
				$("#threat").hide("puff");
			},4000);
		},2000);
	},5000);
	//灰色遮罩
	setTimeout(function(){
	$("#shadow").width(BGWidth);
	$("#shadow").height(BGHeight);
	$("#shadow").slideDown(3000);},5000);

	//粉色方块移出屏幕,黑白方块消失,显示标语
	setTimeout(function(){
	$("#girl").animate({left:BGWidth + square.a[0]}, 8000);
	$("#slogan").css({"left":mapX + mapWidth / 2,"top":mapY + mapHeight / 2,"width":mapWidth / 2,"height":mapHeight / 2,"fontSize":unit / 2+"px","color":"white"});
	$("#slogan").show("fade");
	},12000);
	//标语消失
	setTimeout(function(){
		$("#slogan").hide("explode");
	},19000);
	//tunnel
	setTimeout('$("#outer").slideRight()',20000);
}
quantum.gameInit = function()
{
	BGContext.clearRect(0,0,BGWidth,BGHeight);
	gameContext.clearRect(0,0,mapWidth,mapHeight);
	$(".stars").remove();
	$("#inner").hide().slideDown(1000);
	isPaused = false;
	isOver = false;

	//调整globalSpeed，更改碰撞检测
	globalSpeed = 3;
	totalUtilNum = 6;
	score1 = 0;
	score2 = 0;
	level = 1;

	obstacleTimeRecorder = Date.now();
	utilTimeRecorder = Date.now();

	//需要重新初始化
	square.init();
	fixedObstacle.init();
	util.init();
	tunnel.drawTunnel();
	quantum.gameLoop();


	tunnel.drawTunnel();
}

quantum.gameLoop = function()
{
	if(!isPaused && !isOver)
	{
		requestAnimationFrame(quantum.gameLoop);

		gameContext.clearRect(0,0,mapWidth,mapHeight);
		drawUserStatus();
		square.updateSquare();
		square.drawSquare();
		quantum.generateObstacle();
		fixedObstacle.updateFixedObstacle();
		fixedObstacle.drawFixedObstacle();
		quantum.generateUtil();
		util.updateUtil();
		util.drawUtil();

		quantum.updateScore();
		quantum.updateGameStatus();
	}
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
quantum.updateGameStatus = function()
{
	//玩家1失败
	if(square.x[0] + square.a[0] < 0)
	{
		isOver = true;
		winSound.play();
		gameContext.fillStyle = "white";
		gameContext.fillText("Player2 Wins!", mapWidth / 3, unit);
	}
	//玩家2失败
	else if(square.x[1] + square.a[1] < 0)
	{
		isOver = true;
		winSound.play();
		gameContext.fillStyle = "white";
		gameContext.fillText("Player1 Wins!", mapWidth / 3, unit);
	}
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
	winSound = new Audio();
	winSound.src = 'sound/win.wav';
	winSound.load();
	//开场动画时的音效
	evilLaughSound = new Audio();
	evilLaughSound.src = 'sound/evilLaugh.mp3';
	evilLaughSound.load();
	fallSound = new Audio();
	fallSound.src = 'sound/fall.wav';
	fallSound.load();
	//使用道具的音效
	speedUpSound = new Audio();
	speedUpSound.src = 'sound/speedUpEffect.wav';
	speedUpSound.load();
	slowDownSound = new Audio();
	slowDownSound.src = 'sound/slowDownEffect.mp3';
	slowDownSound.load();
	reverseSound = new Audio();
	reverseSound.src = 'sound/reverseEffect.mp3';
	reverseSound.load();
	invisibleSound = new Audio();
	invisibleSound.src = 'sound/invisibleEffect.wav';
	invisibleSound.load();
	changeSound = new Audio();
	changeSound.src = '';
	changeSound.load();
	gunSound = new Audio();
	gunSound.src="sound/gunEffect.mp3";
	gunSound.load();
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
	if(e.keyCode === 32)
	{
		if(isPaused === false)
			isPaused = true;
		else
		{
			isPaused = false;
			quantum.gameLoop();
		}
	}
	if(e.keyCode === 13)
	{
		if(isOver = true)
		{
			isOver = false;
			quantum.gameInit();
		}
	}
	//keysDown的处理在square.js中
	if(isPaused === false && isOver === false)
	{
    	keys[e.keyCode] = true;
	}
}, false);

