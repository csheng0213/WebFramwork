/**
 * Created by liulei_dev on 2016/1/6.
 */
var mongoose = require('./db');
// 引入 mongoose 模块
var userSchema = new mongoose.Schema({
    name: String,
    age: Number
});
var Info = mongoose.model('Info', userSchema);
//创建了一个名为 User 的 model

var co = require('co');
var thunkify = require('thunkify');
var find = thunkify(function () {
    Info.find.apply(Info, arguments)
});
var findOne = thunkify(function () {
    Info.findOne.apply(Info, arguments)
});

module.exports = {
    model: Info,
    getOneInfo: function *(){
        var infos = yield findOne();
        return infos;
    },
    getInfos: function *(){
        var infos = yield find();
        return infos;
    }
};