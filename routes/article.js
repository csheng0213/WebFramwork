/**
 * Created by liulei_dev on 2016/2/26.
 */
var article = require('../modules/article');
function Article() {

}

Article.prototype.article = function *(next) {

    var title = this.query.title;
    yield this.render("/article", {title: "技术文章分享"});
};

module.exports = new Article();
