var through = require('through');
var Vinyl = require('vinyl');
var log = require('fancy-log');
const colors = require('ansi-colors');

module.exports = function () {

  var passThrough = function (file) {
    return this.queue(file);
  };

  var onEnd = function () {
    log(colors.cyan('building META-INF ...'))
    this.emit('data', new Vinyl({ path: 'META-INF/', contents: null, stat: { isDirectory: function () { return true; } } }));
    log(colors.cyan('META-INF built.'))
    this.emit('end');
  };

  return through(passThrough, onEnd);
};
