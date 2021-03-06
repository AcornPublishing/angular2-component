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
    function buffer(closingNotifier) {
      return this.lift(new BufferOperator(closingNotifier));
    }
    exports.buffer = buffer;
    var BufferOperator = (function() {
      function BufferOperator(closingNotifier) {
        this.closingNotifier = closingNotifier;
      }
      BufferOperator.prototype.call = function(subscriber) {
        return new BufferSubscriber(subscriber, this.closingNotifier);
      };
      return BufferOperator;
    })();
    var BufferSubscriber = (function(_super) {
      __extends(BufferSubscriber, _super);
      function BufferSubscriber(destination, closingNotifier) {
        _super.call(this, destination);
        this.buffer = [];
        this.notifierSubscriber = null;
        this.notifierSubscriber = new BufferClosingNotifierSubscriber(this);
        this.add(closingNotifier._subscribe(this.notifierSubscriber));
      }
      BufferSubscriber.prototype._next = function(value) {
        this.buffer.push(value);
      };
      BufferSubscriber.prototype._error = function(err) {
        this.destination.error(err);
      };
      BufferSubscriber.prototype._complete = function() {
        this.destination.complete();
      };
      BufferSubscriber.prototype.flushBuffer = function() {
        var buffer = this.buffer;
        this.buffer = [];
        this.destination.next(buffer);
        if (this.isUnsubscribed) {
          this.notifierSubscriber.unsubscribe();
        }
      };
      return BufferSubscriber;
    })(Subscriber_1.Subscriber);
    var BufferClosingNotifierSubscriber = (function(_super) {
      __extends(BufferClosingNotifierSubscriber, _super);
      function BufferClosingNotifierSubscriber(parent) {
        _super.call(this, null);
        this.parent = parent;
      }
      BufferClosingNotifierSubscriber.prototype._next = function(value) {
        this.parent.flushBuffer();
      };
      BufferClosingNotifierSubscriber.prototype._error = function(err) {
        this.parent.error(err);
      };
      BufferClosingNotifierSubscriber.prototype._complete = function() {
        this.parent.complete();
      };
      return BufferClosingNotifierSubscriber;
    })(Subscriber_1.Subscriber);
  });
})(require('buffer').Buffer);
