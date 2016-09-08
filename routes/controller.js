/**
 * Created by liulei_dev on 2016/1/25.
 */
var User = require('../modules/user');
var article = require('../modules/article');
var router = require('koa-router')();
var koaBody = require('koa-body')();

var list = {
    reg: function *(next) {
        var params = this.request.body;
        var userName = params.name;
        if (!(yield User.thereIs(userName))) {
            yield User.addUser(userName, params.password);
            this.session.name = userName;
            this.redirect('/');
        } else {
            this.redirect('/reg');
        }
    },
    login: function *(next) {
        var params = this.request.body;
        var username = params.name;
        if (yield User.pwRight(username, params.password)) {
            this.session.name = username;
            this.redirect('/main');
        } else {
            this.redirect('/');
        }
    },
    logout: function *(next) {
        this.session = null;
        this.redirect('/login');
    },
    regRender: function *(next) {
        yield this.render("/register", {title: "用户注册"});
    },
    loginRender: function *(next) {
        yield this.render("/login", {title: "用户登录", layout: false});
    },
    mainRender: function * (next) {
        if (yield User.thereIs(this.session.name)) {
            yield this.render("/main", {title: "主页"});
        } else {
            this.redirect("/");
        }
    },
    myselfRender: function *(next) {
        yield this.render("/myself", {title: "关于我"});
    },
    technologyRender: function *(next) {
        yield this.render("/technology", {title: "技术分享"});
    },
    articleRender: function *(next) {
        var title = this.query.title;
        console.log(title);
        var docs = yield article.find({title: title});
        yield this.render("/article", {title: "技术分享", name: title, article: docs[0].text});
    }
};

router
    .get('/', koaBody, list.loginRender)
    .post('/', koaBody, list.login)
    .get('/main', koaBody, list.mainRender)
    .get('/myself', koaBody, list.myselfRender)
    .get('/technology', koaBody, list.technologyRender)
    .get('/article', koaBody, list.articleRender);
module.exports = router;