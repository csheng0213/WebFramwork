
var Info = require("../modules/info")
function Peopel()
{
}


Peopel.prototype.post_getPeopleList = function *(next)
{
	var body = this.request.body
	var infos = yield Info.getInfos();
	this.body = JSON.stringify(infos);
}


module.exports = new Peopel();