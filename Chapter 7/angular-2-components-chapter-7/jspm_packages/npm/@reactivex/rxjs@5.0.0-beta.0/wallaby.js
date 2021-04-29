/* */ 
module.exports = (wallaby) => ({
  files: ['index.js', 'src/**/*.ts', {
    pattern: 'spec/helpers/*.js',
    instrument: false
  }],
  tests: ['spec/**/*-spec.js'],
  compilers: {'**/*.ts': wallaby.compilers.typeScript({
      module: 1,
      target: 1,
      preserveConstEnums: true
    })},
  testFramework: 'jasmine',
  env: {type: 'node'},
  workers: {
    initial: 1,
    regular: 1
  },
  bootstrap: function(w) {
    var Module = require('module').Module;
    if (!Module._originalRequire) {
      var modulePrototype = Module.prototype;
      Module._originalRequire = modulePrototype.require;
      modulePrototype.require = function(filePath) {
        return Module._originalRequire.call(this, filePath.replace('dist/cjs', 'src'));
      };
    }
    require('./spec/helpers/test-helper');
  }
});
