var through = require('through');
var Vinyl = require('vinyl');
var log = require('fancy-log');
const colors = require('ansi-colors');

function buildWebXML(stream, params) {

  var webXML = '<web-app version="2.5"' +
    ' xmlns="http://java.sun.com/xml/ns/javaee"' +
    ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
    ' xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd">\n' +
    '<display-name>' + params.displayName + '</display-name>\n' +
    '<welcome-file-list>' +
    '<welcome-file>' + params.welcomeFile + '</welcome-file>' +
    '</welcome-file-list>\n' +
    '<error-page>\n<error-code>404</error-code>\n<location>' + '/index.html</location>\n</error-page>\n</web-app>\n';

  var webXMLFile = new Vinyl({
    contents: new Buffer(webXML),
    path: 'WEB-INF/web.xml'
  });
  stream.emit('data', webXMLFile);
}

module.exports = function (options) {

  var passThrough = function (file) {
    return this.queue(file);
  };

  var onEnd = function () {
    log(colors.cyan('building web.xml ...'))
    buildWebXML(this, options);
    log(colors.cyan('web.xml built.'))
    log(colors.cyan('building META-INF ...'))
    this.emit('data', new Vinyl({ path: 'META-INF/', contents: null, stat: { isDirectory: function () { return true; } } }));
    log(colors.cyan('META-INF built.'))
    this.emit('end');
  };

  return through(passThrough, onEnd);
};
