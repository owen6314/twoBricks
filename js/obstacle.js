//障碍物类
//固定障碍物
var fixedObstacleObject = function()
{
	this.num;
	this.isAlive = [];
	this.x = [];
	this.y = [];
	this.row = [];
	this.width = [];
	this.height = [];
	this.color;
}

fixedObstacleObject.prototype.init = function()
{
	this.num = 30;
	for(let i = 0; i < this.num; i++)
	{
		this.isAlive[i] = false;
		this.height[i] = unit;
	}
	this.color = "purple";
}
fixedObstacleObject.prototype.born = function()
{
	//每次在几行中产生障碍是随机的,但概率不同
	if(level === 1 || level === 2 || level === 3)
	{
		//count代表有几行出现障碍
		let count;
		
		let r = Math.floor(Math.random() * 10);
		if(r === 9)
			count = 3;
		else if(r >= 5)
			count = 2;
		else
			count = 1;
		let rowCash = [];
		let tempCount = 0;
		for(let i = 0; i < this.num; i++)
		{
			if(this.isAlive[i] === false)
			{
				tempCount++;
				this.isAlive[i] = true;
				let t = Math.floor(Math.random() * 4);
				while(t in rowCash)
					t = Math.floor(Math.random() * 4);
				this.row[i] = t;
				rowCash.push(t);
				this.x[i] = mapWidth;
				this.y[i] = tunnel.y[this.row[i]];
				this.width[i] = unit;
				this.height[i] = unit;
				if(tempCount === count)
					break;
			}

		}
	}
}
fixedObstacleObject.prototype.updateFixedObstacle = function()
{
	for(let i = 0; i < this.num; i++)
	{
		if(this.isAlive[i])
		{
			this.x[i] -= globalSpeed;
			if(this.x[i] + this.width[i] < 0)
			{
				this.isAlive[i] = false;
			}
		}
	}
}
fixedObstacleObject.prototype.drawFixedObstacle = function()
{
	for(let i = 0; i < this.num; i++)
	{
		if(this.isAlive[i])
		{
			gameContext.fillStyle = this.color;
			gameContext.fillRect(this.x[i],this.y[i],this.width[i],this.height[i]);
		}
	}
}
