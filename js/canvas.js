var speedUpImg,speedDownImg,reverseImg,invisibleImg,changeImg,gunImg;
//加载道具图片
function initUtilImg()
{
	speedUpImg = new Image();
	speedUpImg.src = "img/speed.jpg";
	speedDownImg = new Image();
	speedDownImg.src = "img/slowdown.gif";
	reverseImg = new Image();
	reverseImg.src = "img/reverse.gif";
	invisibleImg = new Image();
	invisibleImg.src = "img/invisible.gif";
	changeImg = new Image();
	changeImg.src = "img/change.gif";
	gunImg = new Image();
	gunImg.src = "img/gun.gif";
}
//绘图函数
function initBackground()
{
	//背景的星星
    var stars = 800;
    var $stars = $('.stars');
    var r = 800;
    for (var i = 0; i < stars; i++)
     {
        var $star = $('<div/>').addClass('star');
        $stars.append($star);
    }
    $('.star').each(function () {
        var cur = $(this);
        var s = 0.2 + Math.random() * 1;
        var curR = r + Math.random() * 300;
        cur.css({
            transformOrigin: '0 0 ' + curR + 'px',
            transform: ' translate3d(0,0,-' + curR + 'px) rotateY(' + Math.random() * 360 + 'deg) rotateX(' + Math.random() * -50 + 'deg) scale(' + s + ',' + s + ')'
        });
    });        
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
	//绘制玩家1和玩家2拥有道具
	switch(square.util[0])
	{
		case 1:
			gameContext.drawImage(speedUpImg,mapWidth / 8 + unit / 2, mapHeight / 6 + unit / 4,unit / 2,unit / 2);
			break;
		case 2:
			gameContext.drawImage(speedDownImg,mapWidth / 8 + unit / 2, mapHeight / 6 + unit / 4,unit / 2,unit / 2);
			break;
		case 3:
			gameContext.drawImage(reverseImg,mapWidth / 8 + unit / 2, mapHeight/6 + unit / 4,unit / 2,unit / 2);
			break;
		case 4:
			gameContext.drawImage(invisibleImg,mapWidth / 8 + unit / 2, mapHeight/6 + unit / 4,unit / 2,unit / 2);
			break;
		case 5:
			gameContext.drawImage(changeImg,mapWidth / 8 + unit / 2, mapHeight/6 + unit / 4,unit / 2,unit / 2);
			break;
		case 6:
			gameContext.drawImage(gunImg,mapWidth / 8 + unit / 2, mapHeight/6 + unit / 4,unit / 2,unit / 2);
			break;
		default:
			break;
	}
	switch(square.util[1])
	{
		case 1:
			gameContext.drawImage(speedUpImg,mapWidth * 3 / 4 + unit / 2, mapHeight / 6 + unit / 4,unit / 2,unit / 2);
			break;
		case 2:
			gameContext.drawImage(speedDownImg,mapWidth * 3 / 4 + unit / 2, mapHeight / 6 + unit / 4,unit / 2,unit / 2);
			break;
		case 3:
			gameContext.drawImage(reverseImg,mapWidth * 3 / 4 + unit / 2, mapHeight / 6 + unit / 4,unit / 2,unit / 2);
			break;
		case 4:
			gameContext.drawImage(invisibleImg,mapWidth * 3 / 4 + unit / 2, mapHeight/6 + unit / 4,unit / 2,unit / 2);
			break;
		case 5:
			gameContext.drawImage(changeImg,mapWidth * 3 / 4 + unit / 2, mapHeight/6 + unit / 4,unit / 2,unit / 2);
			break;
		case 6:
			gameContext.drawImage(gunImg,mapWidth * 3 / 4 + unit / 2, mapHeight/6 + unit / 4,unit / 2,unit / 2);
			break;
		default:
			break;
	}

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
