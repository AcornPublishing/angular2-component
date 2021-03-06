/* */ 
"format cjs";
(function(Buffer) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  define(["require", "exports", '../Subscriber'], function(require, exports, Subscriber_1) {
    function bufferCount(bufferSize, startBufferEvery) {
      if (startBufferEvery === void 0) {
        startBufferEvery = null;
      }
      return this.lift(new BufferCountOperator(bufferSize, startBufferEvery));
    }
    exports.bufferCount = bufferCount;
    var BufferCountOperator = (function() {
      function BufferCountOperator(bufferSize, startBufferEvery) {
        this.bufferSize = bufferSize;
        this.startBufferEvery = startBufferEvery;
      }
      BufferCountOperator.prototype.call = function(subscriber) {
        return new BufferCountSubscriber(subscriber, this.bufferSize, this.startBufferEvery);
      };
      return BufferCountOperator;
    })();
    var BufferCountSubscriber = (function(_super) {
      __extends(BufferCountSubscriber, _super);
      function BufferCountSubscriber(destination, bufferSize, startBufferEvery) {
        _super.call(this, destination);
        this.bufferSize = bufferSize;
        this.startBufferEvery = startBufferEvery;
        this.buffers = [[]];
        this.count = 0;
      }
      BufferCountSubscriber.prototype._next = function(value) {
        var count = (this.count += 1);
        var destination = this.destination;
        var bufferSize = this.bufferSize;
        var startBufferEvery = (this.startBufferEvery == null) ? bufferSize : this.startBufferEvery;
        var buffers = this.buffers;
        var len = buffers.length;
        var remove = -1;
        if (count % startBufferEvery === 0) {
          buffers.push([]);
        }
        for (var i = 0; i < len; i++) {
          var buffer = buffers[i];
          buffer.push(value);
          if (buffer.length === bufferSize) {
            remove = i;
            destination.next(buffer);
          }
        }
        if (remove !== -1) {
          buffers.splice(remove, 1);
        }
      };
      BufferCountSubscriber.prototype._error = function(err) {
        this.destination.error(err);
      };
      BufferCountSubscriber.prototype._complete = function() {
        var destination = this.destination;
        var buffers = this.buffers;
        while (buffers.length > 0) {
          var buffer = buffers.shift();
          if (buffer.length > 0) {
            destination.next(buffer);
          }
        }
        destination.complete();
      };
      return BufferCountSubscriber;
    })(Subscriber_1.Subscriber);
  });
})(require('buffer').Buffer);
