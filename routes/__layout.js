/**
 * Created by liulei_dev on 2016/1/22.
 */
var impression = require('../modules/impression');
function Layout() {

}
Layout.prototype.addImoression = function *(next) {
    var tmpimpression = this.query.impression;
    var tmpauthor = this.query.author;
    if (!(yield impression.thereIs(tmpimpression))) {
        yield impression.addImpression(tmpimpression, tmpauthor);
        this.body = true;
    } else {
        this.body = false;
    }
};
Layout.prototype.getImpression = function *(next) {
    var impressions = [];
    var docs = yield impression.find();
    if (docs.length > 10) {
        yield impression.delete();
    }
    for (obj in docs) {
        impressions.push(docs[obj].impression);
    }
    this.body = impressions;
};

module.exports = new Layout();
