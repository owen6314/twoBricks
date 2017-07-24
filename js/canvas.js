//绘图函数
function drawMap()
{
	//BGGradient = BGContext.createLinearGradient(0,0,BGWidth,BGHeight);
	gameContext.fillStyle = "black";
	gameContext.fillRect(0,0,mapWidth,mapHeight);
}
//用户道具栏和分数
function drawUserStatus()
{
	let fontSize = unit / 3;
	let font = fontSize + "px " + "Courier New";
	gameContext.font = font;
	gameContext.fillStyle = "white";
	gameContext.fillText("Player1", mapWidth / 8, mapHeight / 16);
	gameContext.fillText("Player2", mapWidth * 3 / 4, mapHeight / 16);
	gameContext.fillText("Score:" + Math.floor(score1 / 100),mapWidth / 8, mapHeight / 8);
	gameContext.fillText("Score:" + Math.floor(score2 / 100),mapWidth * 3 / 4, mapHeight / 8);
	//道具栏
	gameContext.fillStyle = "rgba(255,255,255,0.2)"
	gameContext.fillRect(mapWidth / 8 + unit / 4, mapHeight / 6, unit, unit);
	gameContext.fillRect(mapWidth * 3 / 4 + unit / 4, mapHeight / 6, unit,unit);
	//gameContext.drawImage(img,mapWidth / 8 + unit / 4, mapHeight / 6);

}

//确定地图的长度和宽度，以及相关的单元的大小和位置
function responsiveUpdate()
{
	//先确定单元长度，之后用单元长度更新其他元素的位置和大小
	mapWidth = window.innerWidth;
	mapHeight = window.innerHeight;
	mapWidth = mapWidth > mapHeight ? mapHeight : mapWidth;
	mapHeight = mapWidth;
	gameCanvas.width = mapWidth;
	gameCanvas.height = mapHeight;

	oldUnit = unit;
	unit = mapWidth / 12;
	//全局常量
	globalSpeed = globalSpeed / oldUnit * unit;
	//隧道
	tunnel.width = tunnel.width / oldUnit * unit;
	tunnel.height = tunnel.height / oldUnit * unit;
	for(let i = 0; i < tunnel.num; i++)
	{
		tunnel.x[i] = tunnel.x[i] / oldUnit * unit;
		tunnel.y[i] = tunnel.y[i] / oldUnit * unit;
	}

	//方块
	for(let i = 0; i < square.num; i++)
	{
		square.x[i] = square.x[i] / oldUnit * unit;
		square.y[i] = square.y[i] / oldUnit * unit;
		square.a[i] = square.a[i] / oldUnit * unit;
		square.speed[i] = square.speed[i] / oldUnit * unit;
	}

	//障碍物
	for(let i = 0; i < fixedObstacle.num; i++)
	{
		if(fixedObstacle.isAlive[i])
		{
			fixedObstacle.x[i] = fixedObstacle.x[i] / oldUnit * unit;
			fixedObstacle.y[i] = fixedObstacle.y[i] / oldUnit * unit;
			fixedObstacle.width[i] = fixedObstacle.width[i] / oldUnit * unit;
			fixedObstacle.height[i] = fixedObstacle.height[i] / oldUnit * unit;
		}
	}

}
