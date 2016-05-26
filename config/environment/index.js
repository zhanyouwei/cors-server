/**
 * @author: Jason.占友伟 zhanyouwei@icloud.com
 * Created on 16/3/21.
 * 配置文件入口
 */
'use strict';

var path = require('path');
var _ = require('lodash');

//获取环境变量值
function requiredProcessEnv(name) {
  return process.env[name] || 'development';
}

// 初始化基础配置数据
var all = {
  env: requiredProcessEnv('NODE_ENV'),
  port: process.env.PORT || 9000
};

module.exports = _.merge(
  all,
  require('./' + requiredProcessEnv('NODE_ENV') + '.js') || {});
