var squareObject = function()
{
	this.num;
	this.x = [];
	this.y = [];
	this.row = []; //所在管道
	this.a = []; //边长
	this.color = [];
	this.speed = [];

	this.isBlocked = [];
	this.isSpeedUp = [];
	//道具,0无，1加速，2减速，3颠倒，4隐身，5互换
	this.util = [];
}
//所有的属性都要在init中初始化
squareObject.prototype.init = function(num)
{
	if(isTwoPlayer)
		this.num = 2;
	else
		this.num = 1;
	for(let i = 0; i < this.num ; i++)
	{
		if(i === 0)
		{
			this.row[i] = 0;
			this.color[i] = "white";
		}
		else if(i === 1)
		{
			this.row[i] = 3;
			this.color[i] = "yellow";
		}
		this.x[i] = mapWidth / 2;
		this.y[i] = tunnel.y[this.row[i]] + unit / 4;
		this.a[i] = unit / 2;
		this.speed[i] = globalSpeed;
		this.isBlocked[i] = false;
		this.util[i] = 0;
		this.isSpeedUp[i] = false;
	}

}
squareObject.prototype.updateSquare = function()
{
	this.jump();
	this.goAhead();
	this.getUtil();
	//玩家1使用道具用d，玩家2使用道具用m
	if(68 in keys)
	{
		this.useUtil(0);
		delete keys[68];
	}
	if(77 in keys)
	{
		this.useUtil(1);
		delete keys[77];
	}
}
squareObject.prototype.jump = function()
{
	//上下运动
	//w和s控制方块1
	//w
	if(87 in keys)
	{
		if(this.row[0] !== 0 && this.canJumpTo(0,this.row[0] - 1))
		{
			this.row[0]--;
			this.y[0] = tunnel.y[this.row[0]] + unit / 4;
		}
		delete keys[87];
	}
	//s
	if(83 in keys)
	{
		if(this.row[0] !== 3 && this.canJumpTo(0,this.row[0] + 1))
		{
			this.row[0]++;
			this.y[0] = tunnel.y[this.row[0]] + unit / 4;
		}
		delete keys[83];		
	}
	//控制方块2
		//向上
	if(38 in keys)
	{
		if(this.row[1] !== 0 && this.canJumpTo(1,this.row[1] - 1))
		{
			this.row[1]--;
			this.y[1] = tunnel.y[this.row[1]] + unit / 4;
		}
		delete keys[38];
	}
	//向下
	if(40 in keys)
	{
		if(this.row[1] !== 3 && this.canJumpTo(1,this.row[1] + 1))
		{
			this.row[1]++;
			this.y[1] = tunnel.y[this.row[1]] + unit / 4;
		}
		delete keys[40];
	}
}
squareObject.prototype.goAhead = function()
{
	//向前运动
	for(let i = 0; i < this.num; i++)
	{
		this.x[i] = this.x[i] - globalSpeed;
		if(this.canGoAhead(i))
		{
			this.x[i] += this.speed[i];
			this.isBlocked[i] = false;
		}
		else
		{
			this.isBlocked[i] = true;
		}
	}
	//调整速度，使得方块总体上位于地图中央
	if(this.x[0] < mapWidth / 3 && this.x[1] < mapWidth / 3)
	{
		this.speed[0] = globalSpeed + 0.3;
		this.speed[1] = globalSpeed + 0.3;　
	}
	else if(this.x[0] > 2*mapWidth / 3 && this.x[1] > 2* mapWidth / 3)
	{
		this.speed[0] = globalSpeed - 0.3;
		this.speed[1] = globalSpeed - 0.3;　
	}
	else
	{
		this.speed[0] = globalSpeed;
		this.speed[1] = globalSpeed;
	}
}

//判断第squareNum个方块能否跳到targetRow行
squareObject.prototype.canJumpTo = function(squareNum,targetRow)
{
	var squareLeft = this.x[squareNum];
	var squareRight = this.x[squareNum] + this.a[squareNum];
	var otherSquareLeft;
	var otherSquareRight;
	//另一个方块
	if(squareNum === 0 && this.row[1] === targetRow)
	{
		otherSquareLeft = this.x[1];
		otherSquareRight = this.x[1] + this.a[1];
		if(!(otherSquareLeft < squareLeft && otherSquareRight < squareLeft || otherSquareLeft > squareRight && otherSquareRight > squareRight))
		{
			return false;
		}
	}
	else if(squareNum === 1 && this.row[0] === targetRow)
	{
		otherSquareLeft = this.x[0];
		otherSquareRight = this.x[0] + this.a[0];
		if(!(otherSquareLeft < squareLeft && otherSquareRight < squareLeft || otherSquareLeft > squareRight && otherSquareRight > squareRight))
		{
			return false;
		}
	}


	//固定障碍
	for(let i = 0; i < fixedObstacle.num;i++)
	{
		if(fixedObstacle.isAlive[i] && fixedObstacle.row[i] === targetRow)
		{
			let obLeft = fixedObstacle.x[i];
			let obRight = fixedObstacle.x[i] + fixedObstacle.width[i];
			if(!(obLeft < squareLeft && obRight < squareLeft || obLeft > squareRight && obRight > squareRight))
			{
				return false;
			}
		}
	}

	return true;
}
//判断第squareNum个方块能否前进
squareObject.prototype.canGoAhead = function(squareNum)
{
	var squareLeft = this.x[squareNum];
	var squareRight = this.x[squareNum] + this.a[squareNum];
	var otherSquareLeft;
	var otherSquareRight;
	//两个方块在同一行
	if(this.row[0] === this.row[1])
	{
		if(squareNum === 0)
		{
			otherSquareLeft = this.x[1];
			otherSquareRight = this.x[1] + this.a[1];
			if(Math.abs(otherSquareLeft - squareRight) < 1)
				return false;
		}
		else if(squareNum === 1)
		{
			otherSquareLeft = this.x[0];
			otherSquareRight = this.x[0] + this.a[0];
			if(Math.abs(otherSquareLeft - squareRight) < 1)
				return false;
		}
	}
	//固定障碍
	for(let i = 0; i < fixedObstacle.num;i++)
	{
		if(fixedObstacle.isAlive[i] && fixedObstacle.row[i] === this.row[squareNum])
		{
			let obLeft = fixedObstacle.x[i];
			let obRight = fixedObstacle.x[i] + fixedObstacle.width[i];
			if(Math.abs(squareRight-obLeft) <= 1)
			{
				return false;
			}
		}
	}

	return true;
}
squareObject.prototype.getUtil = function()
{
	//判断是否得到道具
	var squareLeft;
	var squareRight;
	for(let i = 0; i < this.num; i++)
	{
		squareLeft = this.x[i];
		squareRight = this.x[i] + this.a[i];
		for(let j = 0 ;j < util.num; j++)
		{
			if(util.isAlive[j] && util.row[j] === this.row[i])
			{
				let utilLeft = util.x[j];
				let utilRight = util.x[j] + util.width[j];
				//
				if(!(utilLeft < squareLeft && utilRight < squareLeft || utilLeft > squareRight && utilRight > squareRight))
				{
					util.isAlive[j] = false;
					this.util[i] = Math.floor(Math.random() * totalUtilNum) + 1;
					getUtilSound.play();
				}
			}
		}
	}
}
squareObject.prototype.useUtil = function(squareNum)
{
	//对手的号码
	var rivalNum = 1 - squareNum;
	if(this.util[squareNum] !== 0)
	{
		switch(this.util[squareNum])
		{
			case 1:
				break;
			case 2:
				break;
			case 3:
				break;
			case 4:
				break;
			case 5:
				break;
			default:
				break;
		}
		this.util[squareNum] = 0;
	}
}
squareObject.prototype.drawSquare = function()
{
	for(let i = 0; i < this.num; i++)
	{
		gameContext.fillStyle = this.color[i];
		gameContext.fillRect(this.x[i],this.y[i],this.a[i],this.a[i]);
	}
}