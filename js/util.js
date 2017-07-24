//待拾取道具类
var utilObject = function()
{
	this.num;
	this.isAlive = [];
	this.x = [];
	this.y = [];
	this.row = [];
	this.width = [];
	this.height = [];
	this.img;
	this.color;
}

utilObject.prototype.init = function()
{
	this.num = 20;
	for(let i = 0; i < this.num; i++)
	{
		this.isAlive[i] = false;
		this.width[i] = unit / 2;
		this.height[i] = unit / 2;
	}
	this.color = "green";
}
//每次道具产生一排4个，先判断能否在这里产生
utilObject.prototype.born = function()
{
	console.info("!");
	let count = 0;
	for(let i = 0; i < this.num; i++)
	{
		if(this.isAlive[i] === false)
		{
			if(this.canPlace(count))
			{
				console.info("can place");
				this.isAlive[i] = true;
				this.row[i] = count;
				this.x[i] = mapWidth;
				this.y[i] = tunnel.y[this.row[i]];
				this.width[i] = unit / 2;
				this.height[i] = unit / 2;
			}
			count++;
			if(count === 4)
				break;
		}
	}
}
utilObject.prototype.updateUtil = function()
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
utilObject.prototype.drawUtil = function()
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
//判读道具能否出现在rowNum行
utilObject.prototype.canPlace = function(targetRow)
{
	var utilLeft = mapWidth;
	var utilRight = mapWidth + this.width[0];
	//检查固定障碍
	for(let i = 0; i < fixedObstacle.num;i++)
	{
		if(fixedObstacle.isAlive[i] && fixedObstacle.row[i] === targetRow)
		{
			let obLeft = fixedObstacle.x[i];
			let obRight = fixedObstacle.x[i] + fixedObstacle.width[i];
			if(!(obLeft < utilLeft && obRight < utilLeft || obLeft > utilRight && obRight > utilRight))
			{
				return false;
			}
		}
	}
	return true;
}