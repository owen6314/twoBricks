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
	//状态判断
	this.isSpeedUp = [];
	this.isSlowDown = [];
	this.isNormal = [];
	//
	this.isInvisible = [];
	//是否被炸弹击中而停下
	this.isHit = [];
	//道具,0无，1加速，2减速，3颠倒，4隐身，5互换,6火炮
	this.util = [];
}
//preInit只为动画效果，功能性属性不必初始化
squareObject.prototype.preInit = function()
{
	if(isTwoPlayer)
		this.num = 2;
	else
		this.num = 1;
	for(let i = 0; i < this.num ; i++)
	{
		if(i === 0)
		{
			this.row[i] = 1;
			this.color[i] = "white";
		}
		else if(i === 1)
		{
			this.row[i] = 2;
			this.color[i] = "black";
		}
		this.x[i] = mapWidth / 3;
		this.y[i] = tunnel.y[this.row[i]] + unit / 4;
		this.a[i] = unit / 2;
		this.isNormal[i] = true;
	}
}
//所有的属性都要在init中初始化
squareObject.prototype.init = function()
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
			this.color[i] = "black";
		}
		this.x[i] = mapWidth / 2;
		this.y[i] = tunnel.y[this.row[i]] + unit / 4;
		this.a[i] = unit / 2;
		this.speed[i] = globalSpeed;
		this.isBlocked[i] = false;
		this.util[i] = 0;
		this.isSpeedUp[i] = false;
		this.isSlowDown[i] = false;
		this.isNormal[i] = true;
		this.isInvisible[i] = false;
		this.isHit[i] = false;
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
	//方块一正常情况
	if(this.isNormal[0] && !this.isHit[0])	
	{
		if(87 in keys)//w
		{
			if(this.row[0] !== 0 && this.canJumpTo(0,this.row[0] - 1))
			{
				this.row[0]--;
				this.y[0] = tunnel.y[this.row[0]] + unit / 4;
				jumpSound.play();
			}
			
			delete keys[87];
		}
		
		if(83 in keys)//s
		{
			if(this.row[0] !== 3 && this.canJumpTo(0,this.row[0] + 1))
			{
				this.row[0]++;
				this.y[0] = tunnel.y[this.row[0]] + unit / 4;
				jumpSound.play();
			}
			
			delete keys[83];		
		}
	}
	//方块一反向情况
	if(!this.isNormal[0] && !this.isHit[0])	
	{
		if(83 in keys)//s
		{
			if(this.row[0] !== 0 && this.canJumpTo(0,this.row[0] - 1))
			{
				this.row[0]--;
				this.y[0] = tunnel.y[this.row[0]] + unit / 4;
				jumpSound.play();
			}
			delete keys[83];
		}
		
		if(87 in keys)//w
		{
			if(this.row[0] !== 3 && this.canJumpTo(0,this.row[0] + 1))
			{
				this.row[0]++;
				this.y[0] = tunnel.y[this.row[0]] + unit / 4;
				jumpSound.play();
			}
			delete keys[87];		
		}
	}
	//方块2 正常情况
	if(this.isNormal[1] && !this.isHit[1])	
	{
		if(38 in keys)	//向上
		{
			if(this.row[1] !== 0 && this.canJumpTo(1,this.row[1] - 1))
			{
				this.row[1]--;
				this.y[1] = tunnel.y[this.row[1]] + unit / 4;
				jumpSound.play();
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
				jumpSound.play();
			}
			delete keys[40];
		}
	}
	//方块2 异常情况
	if(!this.isNormal[1] && !this.isHit[1])	
	{
		if(40 in keys)	//向上
		{
			if(this.row[1] !== 0 && this.canJumpTo(1,this.row[1] - 1))
			{
				this.row[1]--;
				this.y[1] = tunnel.y[this.row[1]] + unit / 4;
				jumpSound.play();
			}
			delete keys[40];
		}
		//向下
		if(38 in keys)
		{
			if(this.row[1] !== 3 && this.canJumpTo(1,this.row[1] + 1))
			{
				this.row[1]++;
				this.y[1] = tunnel.y[this.row[1]] + unit / 4;
				jumpSound.play();
			}
			delete keys[38];
		}
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
			if(this.isSpeedUp[i])
			{
				this.x[i] = this.x[i] + this.speed[i] + 0.5;
			}
			else if(this.isSlowDown[i])
			{
				this.x[i] = this.x[i] + this.speed[i] - 0.5;
			}
			else
			{
				this.x[i] += this.speed[i];
			}
			this.isBlocked[i] = false;
		}
		else
		{
			this.isBlocked[i] = true;
		}
	}
	//调整速度，使得方块总体上位于地图中央
	/*
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
	}*/
	if(this.x[0] < mapWidth / 3 && this.x[1] < mapWidth / 3)
	{
		this.x[0] += 0.3;
		this.x[1] += 0.3;　
	}
	else if(this.x[0] > 2*mapWidth / 3 && this.x[1] > 2* mapWidth / 3)
	{
		this.x[0] -=  0.3;
		this.x[1] -=  0.3;　
	}
}

//判断第squareNum个方块能否跳到targetRow行
squareObject.prototype.canJumpTo = function(squareNum,targetRow)
{
	if(this.isHit[squareNum])
		return false;
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
	if(this.isInvisible[squareNum])
		return true;
	if(this.isHit[squareNum])
		return false;
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
	let rivalNum = 1 - squareNum;
	if(this.util[squareNum] !== 0)
	{
		switch(this.util[squareNum])
		{
			case 1:
				this.useSpeedUp(squareNum);
				break;
			case 2:
				this.useSlowDown(squareNum);
				break;
			case 3:
				this.useReverse(squareNum);
				break;
			case 4:
				this.useInvisible(squareNum);
				break;
			case 5:
				this.useChange(squareNum);
				break;
			case 6:
				this.useGun(squareNum);
				break;
			default:
				break;
		}
		this.util[squareNum] = 0;
	}
}
squareObject.prototype.useSpeedUp = function(squareNum)
{
	this.isSpeedUp[squareNum] = true;
	speedUpSound.play();
	setTimeout(function(i){square.isSpeedUp[i] = false;}, 3000, squareNum);
}
squareObject.prototype.useSlowDown = function(squareNum)
{
	let rivalNum = 1 - squareNum;
	this.isSlowDown[rivalNum] = true;
	slowDownSound.play();
	setTimeout(function(i){square.isSlowDown[i] = false;}, 3000, rivalNum);
}
squareObject.prototype.useReverse = function(squareNum)
{
	let rivalNum = 1 - squareNum;
	reverseSound.play();
	this.isNormal[rivalNum] = false;
	setTimeout(function(i){square.isNormal[i] = true;}, 3000, rivalNum);
}
squareObject.prototype.useInvisible = function(squareNum)
{
	invisibleSound.play();
	this.isInvisible[squareNum] = true;
	setTimeout(function(i){square.isInvisible[i] = false;}, 3000, squareNum);

}
//停一秒之后再进行change,有动画
squareObject.prototype.useChange = function(squareNum)
{

	let t;
	t = this.x[0];
	this.x[0] = this.x[1];
	this.x[1] = t;
	t = this.y[0];
	this.y[0] = this.y[1];
	this.y[1] = t;
	t = this.row[0];
	this.row[0] = this.row[1];
	this.row[1] = t;

}
squareObject.prototype.useGun = function(squareNum)
{
	let rivalNum = 1 - squareNum;
	if(this.row[rivalNum] === this.row[squareNum] && this.x[squareNum] < this.x[rivalNum])
	{
		gunSound.play();
		this.isHit[rivalNum] = true;
		setTimeout(function(i){square.isHit[i] = false;}, 3000, rivalNum);
	}
}
squareObject.prototype.drawSquare = function()
{
	for(let i = 0; i < this.num; i++)
	{
		if(!this.isInvisible[i])
			gameContext.fillStyle = this.color[i];
		else
		{
			if(i === 0)
				gameContext.fillStyle = "rgba(255,0,0,0.3)"
			else if(i === 1)
				gameContext.fillStyle = "rgba(255,0,0,0.3)"
		}
		gameContext.fillRect(this.x[i],this.y[i],this.a[i],this.a[i]);
		//不正常的情况，红色边框
		if(!this.isNormal[i])
		{
			gameContext.strokeStyle = "red";
			gameContext.strokeRect(this.x[i],this.y[i],this.a[i],this.a[i]);
		}
		//绘制方块上的火炮
		if(this.util[i] === 6)
		{
			gameContext.fillStyle = this.color[i];
			gameContext.fillRect(this.x[i] + this.a[i], this.y[i] + 2 * this.a[i] / 5, 2* this.a[i] / 3, this.a[i] / 5);
		}
	}
}

squareObject.prototype.clearSquare = function()
{
	
	for(let i = 0; i < this.num; i++)
	{
		gameContext.clearRect(this.x[i],this.y[i], this.a[i], this.a[i]);
	}
}