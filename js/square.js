var squareObject = function()
{
	this.num;
	this.x = [];
	this.y = [];
	this.row = []; //所在管道
	this.a = []; //边长
	this.color = [];
	this.speed = [];
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
		this.x[i] = unit;
		this.y[i] = tunnel.y[this.row[i]] + unit / 4;
		this.a[i] = unit / 2;
	}

}
squareObject.prototype.updateSquare = function()
{
	//w和s控制方块1
	//w
	if(87 in keys)
	{
		if(this.row[0] !== 0 && this.row[1] !== this.row[0] - 1)
		{
			this.row[0]--;
			this.y[0] = tunnel.y[this.row[0]] + unit / 4;
		}
		delete keys[87];
	}
	//s
	if(83 in keys)
	{
		if(this.row[0] !== 3 && this.row[1] !== this.row[0] + 1)
		{
			this.row[0]++;
			this.y[0] = tunnel.y[this.row[0]] + unit / 4;
		}
		delete keys[83];		
	}
		//向上
	if(38 in keys)
	{
		if(this.row[1] !== 0 && this.row[0] !== this.row[1] - 1)
		{
			this.row[1]--;
			this.y[1] = tunnel.y[this.row[1]] + unit / 4;
		}
		delete keys[38];
	}
	//向下
	if(40 in keys)
	{
		if(this.row[1] !== 3 && this.row[0] !== this.row[1] + 1)
		{
			this.row[1]++;
			this.y[1] = tunnel.y[this.row[1]] + unit / 4;
		}
		delete keys[40];
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