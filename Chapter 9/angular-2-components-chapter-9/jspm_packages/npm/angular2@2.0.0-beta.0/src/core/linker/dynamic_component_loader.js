/* */ 
'use strict';
var __extends = (this && this.__extends) || function(d, b) {
  for (var p in b)
    if (b.hasOwnProperty(p))
      d[p] = b[p];
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
    return Reflect.metadata(k, v);
};
var di_1 = require('../di');
var compiler_1 = require('./compiler');
var lang_1 = require('../../facade/lang');
var view_manager_1 = require('./view_manager');
var ComponentRef = (function() {
  function ComponentRef() {}
  Object.defineProperty(ComponentRef.prototype, "hostView", {
    get: function() {
      return this.location.parentView;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ComponentRef.prototype, "hostComponent", {
    get: function() {
      return this.instance;
    },
    enumerable: true,
    configurable: true
  });
  return ComponentRef;
})();
exports.ComponentRef = ComponentRef;
var ComponentRef_ = (function(_super) {
  __extends(ComponentRef_, _super);
  function ComponentRef_(location, instance, componentType, injector, _dispose) {
    _super.call(this);
    this._dispose = _dispose;
    this.location = location;
    this.instance = instance;
    this.componentType = componentType;
    this.injector = injector;
  }
  Object.defineProperty(ComponentRef_.prototype, "hostComponentType", {
    get: function() {
      return this.componentType;
    },
    enumerable: true,
    configurable: true
  });
  ComponentRef_.prototype.dispose = function() {
    this._dispose();
  };
  return ComponentRef_;
})(ComponentRef);
exports.ComponentRef_ = ComponentRef_;
var DynamicComponentLoader = (function() {
  function DynamicComponentLoader() {}
  return DynamicComponentLoader;
})();
exports.DynamicComponentLoader = DynamicComponentLoader;
var DynamicComponentLoader_ = (function(_super) {
  __extends(DynamicComponentLoader_, _super);
  function DynamicComponentLoader_(_compiler, _viewManager) {
    _super.call(this);
    this._compiler = _compiler;
    this._viewManager = _viewManager;
  }
  DynamicComponentLoader_.prototype.loadAsRoot = function(type, overrideSelector, injector, onDispose) {
    var _this = this;
    return this._compiler.compileInHost(type).then(function(hostProtoViewRef) {
      var hostViewRef = _this._viewManager.createRootHostView(hostProtoViewRef, overrideSelector, injector);
      var newLocation = _this._viewManager.getHostElement(hostViewRef);
      var component = _this._viewManager.getComponent(newLocation);
      var dispose = function() {
        if (lang_1.isPresent(onDispose)) {
          onDispose();
        }
        _this._viewManager.destroyRootHostView(hostViewRef);
      };
      return new ComponentRef_(newLocation, component, type, injector, dispose);
    });
  };
  DynamicComponentLoader_.prototype.loadIntoLocation = function(type, hostLocation, anchorName, providers) {
    if (providers === void 0) {
      providers = null;
    }
    return this.loadNextToLocation(type, this._viewManager.getNamedElementInComponentView(hostLocation, anchorName), providers);
  };
  DynamicComponentLoader_.prototype.loadNextToLocation = function(type, location, providers) {
    var _this = this;
    if (providers === void 0) {
      providers = null;
    }
    return this._compiler.compileInHost(type).then(function(hostProtoViewRef) {
      var viewContainer = _this._viewManager.getViewContainer(location);
      var hostViewRef = viewContainer.createHostView(hostProtoViewRef, viewContainer.length, providers);
      var newLocation = _this._viewManager.getHostElement(hostViewRef);
      var component = _this._viewManager.getComponent(newLocation);
      var dispose = function() {
        var index = viewContainer.indexOf(hostViewRef);
        if (index !== -1) {
          viewContainer.remove(index);
        }
      };
      return new ComponentRef_(newLocation, component, type, null, dispose);
    });
  };
  DynamicComponentLoader_ = __decorate([di_1.Injectable(), __metadata('design:paramtypes', [compiler_1.Compiler, view_manager_1.AppViewManager])], DynamicComponentLoader_);
  return DynamicComponentLoader_;
})(DynamicComponentLoader);
exports.DynamicComponentLoader_ = DynamicComponentLoader_;
