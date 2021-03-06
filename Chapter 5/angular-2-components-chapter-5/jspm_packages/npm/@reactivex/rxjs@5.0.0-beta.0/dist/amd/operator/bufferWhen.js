/* */ 
"format cjs";
(function(Buffer, process) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  define(["require", "exports", '../Subscriber', '../util/tryCatch', '../util/errorObject'], function(require, exports, Subscriber_1, tryCatch_1, errorObject_1) {
    function bufferWhen(closingSelector) {
      return this.lift(new BufferWhenOperator(closingSelector));
    }
    exports.bufferWhen = bufferWhen;
    var BufferWhenOperator = (function() {
      function BufferWhenOperator(closingSelector) {
        this.closingSelector = closingSelector;
      }
      BufferWhenOperator.prototype.call = function(subscriber) {
        return new BufferWhenSubscriber(subscriber, this.closingSelector);
      };
      return BufferWhenOperator;
    })();
    var BufferWhenSubscriber = (function(_super) {
      __extends(BufferWhenSubscriber, _super);
      function BufferWhenSubscriber(destination, closingSelector) {
        _super.call(this, destination);
        this.closingSelector = closingSelector;
        this.openBuffer();
      }
      BufferWhenSubscriber.prototype._next = function(value) {
        this.buffer.push(value);
      };
      BufferWhenSubscriber.prototype._error = function(err) {
        this.buffer = null;
        this.destination.error(err);
      };
      BufferWhenSubscriber.prototype._complete = function() {
        var buffer = this.buffer;
        this.destination.next(buffer);
        this.buffer = null;
        this.destination.complete();
      };
      BufferWhenSubscriber.prototype.openBuffer = function() {
        var prevClosingNotification = this.closingNotification;
        if (prevClosingNotification) {
          this.remove(prevClosingNotification);
          prevClosingNotification.unsubscribe();
        }
        var buffer = this.buffer;
        if (buffer) {
          this.destination.next(buffer);
        }
        this.buffer = [];
        var closingNotifier = tryCatch_1.tryCatch(this.closingSelector)();
        if (closingNotifier === errorObject_1.errorObject) {
          var err = closingNotifier.e;
          this.buffer = null;
          this.destination.error(err);
        } else {
          this.add(this.closingNotification = closingNotifier._subscribe(new BufferClosingNotifierSubscriber(this)));
        }
      };
      return BufferWhenSubscriber;
    })(Subscriber_1.Subscriber);
    var BufferClosingNotifierSubscriber = (function(_super) {
      __extends(BufferClosingNotifierSubscriber, _super);
      function BufferClosingNotifierSubscriber(parent) {
        _super.call(this, null);
        this.parent = parent;
      }
      BufferClosingNotifierSubscriber.prototype._next = function() {
        this.parent.openBuffer();
      };
      BufferClosingNotifierSubscriber.prototype._error = function(err) {
        this.parent.error(err);
      };
      BufferClosingNotifierSubscriber.prototype._complete = function() {
        this.parent.openBuffer();
      };
      return BufferClosingNotifierSubscriber;
    })(Subscriber_1.Subscriber);
  });
})(require('buffer').Buffer, require('process'));
