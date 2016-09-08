/**
 * Created by Administrator on 2015/12/30.
 */
var koa = require('koa');
var render = require('koa-ejs');
var path = require('path');
var logger = require('koa-logger');
var serve = require('koa-static');
var router = require('koa-router')();
var controller = require('./routes/controller.js')
var routers = require('./routes');
var onerror = require('koa-onerror');
var session = require('koa-session');
var gzip = require('koa-gzip');
var app = koa();
app.keys = ['some secret hurr'];

app.env = process.env.NODE_ENV || 'development';
render(app, {
    root: path.join(__dirname, 'views'),
    layout: '__layout',
    viewExt: 'html',
    cache: ('development' !== app.env),
    debug: ('development' === app.env)
});

routers(router);
//require('./proxy');
if ('development' === app.env) {
    app.use(logger()); // Development style logging middleware
}
onerror(app);

app
    .use(gzip())
    .use(session(app))
    .use(serve(__dirname + '/public'))
    .use(router.routes())
    .use(controller.routes())
    .use(controller.allowedMethods());

app.listen(3000, function () {
    console.log("app listening on port 3000");
});

module.exports = app;