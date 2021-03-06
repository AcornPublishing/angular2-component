/* */ 
"format cjs";
let objectTypes = {
    'boolean': false,
    'function': true,
    'object': true,
    'number': false,
    'string': false,
    'undefined': false
};
export let root = (objectTypes[typeof self] && self) || (objectTypes[typeof window] && window);
/* tslint:disable:no-unused-variable */
let freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;
let freeModule = objectTypes[typeof module] && module && !module.nodeType && module;
let freeGlobal = objectTypes[typeof global] && global;
if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
    root = freeGlobal;
}
//# sourceMappingURL=root.js.map