/**
 * 路由控制模块
 * 将对象的函数自动映射为路由：
 * Router.prototype.index -> get:/router/index
 * Router.prototype.post_index -> post:/router/index
 * Router.prototype.put_index -> put:/router/index
 * Router.prototype.delete_index -> delete:/router/index
 * Router.prototype.index_param -> get:/router/index/:param
 * Author: Sweet
 * Date: 2016-1-20
 */
var fs = require('fs');
module.exports = function (router) {
    // automaticly mapping routes
    var router_path = __dirname;
    fs.readdirSync(router_path).forEach(function (file) {
        if (file == 'index.js' || file == 'controller.js') {
            return;
        }
        var methods = ['get', 'post', 'put', 'delete'];
        var routeObj = require(router_path + '/' + file);
        var routeName = '/' + routeObj.constructor.name.toLowerCase() + '/';//constructor构造函数   toLowerCase转换为小写
        for (var key in routeObj) {
            var urlInfo = key.split('_');
            // 从对象的key中获取url映射信息，和http method信息，并自动填充到app中
            // /opinion/XXX，的形式
            var methodIndex = 0;
            var method = '';
            var action = '';
            var param = '';
            if (urlInfo.length == 1) {
                method = methods[methodIndex];
                action = key;
            } else if (urlInfo.length == 2) {
                if (!urlInfo[0]) {
                    continue;
                }
                methodIndex = methods.indexOf(urlInfo[0]);
                if (methodIndex == -1) {
                    method = methods[0];
                    action = urlInfo[0];
                    param = ':' + urlInfo[1];
                } else {
                    method = urlInfo[0];
                    action = urlInfo[1];
                }
            } else if (urlInfo.length == 3) {
                method = urlInfo[0];
                action = urlInfo[1];
                param = ':' + urlInfo[2];
            }
            router[method](routeName + action + '/' + param, routeObj[key]);
            console.log('auto map route -> [%s]%s%s/%s', method, routeName, action, param);
        }
    });
};
//1.exports 是指向的 module.exports 的引用
//2.module.exports 初始值为一个空对象 {}，所以 exports 初始值也是 {}
//3.require() 返回的是 module.exports 而不是 exports

