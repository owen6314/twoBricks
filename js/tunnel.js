//隧道类,固定
var tunnelObject = function()
{
	this.num;
	this.x = [];
	this.y = [];
	this.width;
	this.height;
	this.color = [];
};
tunnelObject.prototype.init = function()
{
	this.num = 4;
	this.width = BGWidth;
	this.height = BGHeight / 12;
	for(let i = 0; i < this.num; i++)
	{
		this.x[i] = mapX;
		this.y[i] = (2 * i + 4) * mapHeight / 12;
	}
	this.color[0] = "rgba(255,0,0,0.2)";
	this.color[1] = "rgba(0,255,0,0.2)";
	this.color[2] = "rgba(0,0,255,0.2)";
	this.color[3] = "rgba(255,0,255,0.2)";

};
tunnelObject.prototype.drawTunnel = function()
{
	for(let i = 0; i < this.num; i++)
	{
		BGContext.fillStyle = this.color[i];
		BGContext.fillRect(this.x[i], this.y[i], this.width,this.height);
	}
};