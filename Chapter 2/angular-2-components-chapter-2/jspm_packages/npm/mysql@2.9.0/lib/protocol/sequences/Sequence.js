/* */ 
var Util = require('util');
var EventEmitter = require('events').EventEmitter;
var Packets = require('../packets/index');
var ErrorConstants = require('../constants/errors');
var listenerCount = EventEmitter.listenerCount || function(emitter, type) {
  return emitter.listeners(type).length;
};
module.exports = Sequence;
Util.inherits(Sequence, EventEmitter);
function Sequence(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  EventEmitter.call(this);
  options = options || {};
  this._callback = callback;
  this._callSite = null;
  this._ended = false;
  this._timeout = options.timeout;
  this._idleNext = null;
  this._idlePrev = null;
  this._idleStart = null;
  this._idleTimeout = undefined;
  this._repeat = null;
}
Sequence.determinePacket = function(byte) {
  switch (byte) {
    case 0x00:
      return Packets.OkPacket;
    case 0xfe:
      return Packets.EofPacket;
    case 0xff:
      return Packets.ErrorPacket;
  }
};
Sequence.prototype.hasErrorHandler = function() {
  return Boolean(this._callback) || listenerCount(this, 'error') > 1;
};
Sequence.prototype._packetToError = function(packet) {
  var code = ErrorConstants[packet.errno] || 'UNKNOWN_CODE_PLEASE_REPORT';
  var err = new Error(code + ': ' + packet.message);
  err.code = code;
  err.errno = packet.errno;
  err.sqlState = packet.sqlState;
  return err;
};
Sequence.prototype._addLongStackTrace = function(err) {
  if (!this._callSite) {
    return;
  }
  var delimiter = '\n    --------------------\n';
  if (err.stack.indexOf(delimiter) > -1) {
    return;
  }
  err.stack += delimiter + this._callSite.stack.replace(/.+\n/, '');
};
Sequence.prototype.end = function(err) {
  if (this._ended) {
    return;
  }
  this._ended = true;
  if (err) {
    this._addLongStackTrace(err);
  }
  this._callSite = null;
  try {
    if (err) {
      this.emit('error', err);
    }
  } finally {
    try {
      if (this._callback) {
        this._callback.apply(this, arguments);
      }
    } finally {
      this.emit('end');
    }
  }
};
Sequence.prototype['OkPacket'] = function(packet) {
  this.end(null, packet);
};
Sequence.prototype['ErrorPacket'] = function(packet) {
  this.end(this._packetToError(packet));
};
Sequence.prototype.start = function() {};
Sequence.prototype._onTimeout = function _onTimeout() {
  this.emit('timeout');
};
