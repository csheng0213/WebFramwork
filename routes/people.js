
var Info = require("../modules/info")
function Peopel()
{
}


Peopel.prototype.getPeopleList = function *(next)
{
	var infos = yield Info.getInfos();
	this.body = JSON.stringify(infos);
}


module.exports = new Peopel();