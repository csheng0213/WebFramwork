/**
 * Created by liulei_dev on 2016/1/25.
 */
var article = require('../modules/article');
function Main() {

}

Main.prototype.addArticle = function *(next) {
    var docs = yield article.findall();
    this.body = docs;
};

module.exports = new Main();