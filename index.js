/**
 * @author: Jason.占友伟 zhanyouwei@meitunmama.com
 * Created on 16/2/29.
 */
var http = require('http');
var fs = require('fs');
var querystring = require('querystring');
var markdown = require("markdown").markdown;

var config = require('./config/environment');
var httpUtil = require('./http.util');

var port = config.port || '9000';
var hostUrl = config.API_URL.baseUrl;

http.createServer(function (request, response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  response.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  response.setHeader("X-Powered-By", ' 3.2.1');
  if (request.url !== '/favicon.ico') {
    if (request.url === '/') {
      response.writeHead(200, {'Content-Type': 'text/html;charset=UTF-8'});
      fs.readFile(__dirname + '/README.md', function (err, data) {
        if (err) {
          response.end(err.toString());
        } else {
          var html = '<html>'
            + '<head>'
            + '<title>nodejs</title>'
            + '</head>'
            + '<body>'
            + markdown.toHTML(data.toString('utf8'))
            + '</body>'
            + '</html>';
          response.write(html);
          response.end();
        }
      });
      return;
    }
    response.writeHead(200, {'Content-Type': 'application/json;charset=UTF-8'});
    var requestPost = '';     //定义了一个post变量，用于暂存请求体的信息
    request.on('data', function (chunk) {
      //通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
      requestPost += chunk;
    });
    request.on('end', function () {
      //在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
      switch (request.method) {
        case 'GET':
          var url = "http://" + hostUrl + request.url;
          httpUtil.get(url, function (err, data) {
            if (err) {
              throw err;
            }
            response.end(data);
          });
          break;
        case 'POST':
          var options = {
            hostname: hostUrl.split(':')[0],
            port: hostUrl.split(':')[1],
            path: request.url,
            method: 'POST'
          };
          httpUtil.post(options, requestPost, function (err, data) {
            if (err) {
              throw err;
            }
            response.end(data);
          });
          break;
        case 'OPTIONS':
          response.end();
          break;
        default:
          response.end();
          break;
      }
    });
  }
}).listen(port);

console.log('cors-server running at http://localhost:' + port);

