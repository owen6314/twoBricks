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
	if(level === 1)
	{
		for(let i = 0; i < this.num; i++)
		{
			if(this.isAlive[i] === false)
			{
				this.isAlive[i] = true;
				this.row[i] = Math.floor(Math.random() * 4);
				this.x[i] = mapWidth;
				this.y[i] = tunnel.y[this.row[i]];
				this.width[i] = unit / 2;
				this.height[i] = unit;
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
