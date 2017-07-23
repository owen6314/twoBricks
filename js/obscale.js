//障碍物类
//固定障碍物
var fixedObscaleObject = function()
{
	this.num;
	this.isAlive = [];
	this.x = [];
	this.y = [] ;
	this.row = [];
	this.color = [];
	this.type = [];
}

fixedObscaleObject.prototype.init = function()
{
	this.num = 30;
	for(let i = 0; i < this.num; i++)
	{
		this.isAlive[i] = false;
	}
}
fixedObscaleObject.prototype.drawObscale = function()
{

}
//移动障碍物
