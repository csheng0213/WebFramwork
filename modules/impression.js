/**
 * Created by Administrator on 2016/1/25.
 */
var mongoose = require('./db');
var impressionSchema = mongoose.Schema({
    impression: {type: String},
    author: {type: String}
});
var impressionModel = mongoose.model('friendimpression', impressionSchema);

var co = require('co');
module.exports = {
    model: impressionModel,
    addImpression: function *(impression, author) {
        var newImpression = new impressionModel({
            impression: impression,
            author: author
        });
        co(function *() {
            try {
                yield newImpression.save();
            } catch (err) {
                console.log(err);
            }
        });
    },
    thereIs: function *(impression) {
        return co(function *() {
            try {
                var user = yield find({impression: impression});
                return !!user.length;
            } catch (err) {
                console.log(err);
            }
        })
    },
    find: function *() {
        return co(function *() {
            try {
                var impression = yield impressionModel.find();
                return impression;
            } catch (err) {
                console.log(err);
            }
        })
    },
    delete: function *() {
        return co(function *() {
            try {
                yield impressionModel.remove();
            } catch (err) {
                console.log(err);
            }
        })
    }

};