var gameCanvas, gameContext;
var mapWidth, mapHeight;
var unit,oldUnit; //单位，游戏区域宽度的1/12
var tunnel;
var fixedObscale;
var square;
var isTwoPlayer = true;
var keys = [];
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

	quantum.gameLoop();
}

quantum.gameLoop = function()
{
	requestAnimationFrame(quantum.gameLoop);

	drawMap();
	tunnel.drawTunnel();
	square.updateSquare();
	square.drawSquare();
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