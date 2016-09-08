/**
 * Created by liulei_dev on 2016/2/26.
 */
var mongoose = require('./db');

var articleSchema = mongoose.Schema({
    text: {type: String},
    abstract: {type: String},
    time: {type: String},
    title: {type: String}
});
var articleModel = mongoose.model('article', articleSchema);

var co = require('co');
var thunkify = require('thunkify');
var find = thunkify(function () {
    articleModel.find.apply(articleModel, arguments)
});
module.exports = {
    findall: function *() {
        return co(function *() {
            try {
                var article = yield find();
                return article;
            } catch (err) {
                console.log(err);
            }
        })
    },
    find: find
};
