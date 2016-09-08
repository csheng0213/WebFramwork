/**
 * Created by liulei_dev on 2016/1/6.
 */
var mongoose = require('./db');
// 引入 mongoose 模块
var userSchema = new mongoose.Schema({
    name: {type: String, match: /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/},
    password: String
});
var User = mongoose.model('User', userSchema);
//创建了一个名为 User 的 model

var co = require('co');
var thunkify = require('thunkify');
var find = thunkify(function () {
    User.find.apply(User, arguments)
});
var findOne = thunkify(function () {
    User.findOne.apply(User, arguments)
});

module.exports = {
    model: User,
    addUser: function *(name, password) {
        var newUser = new User({
            name: name,
            password: password
        });

        try {
            yield newUser.save();
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
        
    },
    thereIs: function *(name) {
        return co(function *() {
            try {
                var user = yield find({name: name});
                return !!user.length;
            } catch (err) {
                console.log(err);
            }
        })
    },
    pwRight: function *(name, password) {
        return co(function *() {
            try {
                var user = yield findOne({name: name});
                return user.password == password;
            } catch (err) {
                console.log(err);
            }
        })
    }

};