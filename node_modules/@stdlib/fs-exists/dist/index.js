"use strict";var i=function(t,e){return function(){return e||t((e={exports:{}}).exports,e),e.exports}};var a=i(function(h,f){
var s=require("fs"),n;typeof s.access=="function"?n=s.access:n=s.stat;function l(t,e){n(t,x);function x(r){return e.length===2?r?e(r,!1):e(null,!0):e(!r)}}f.exports=l
});var o=i(function(g,y){
var u=require("fs"),c;typeof u.accessSync=="function"?c=u.accessSync:c=u.statSync;function p(t){try{c(t)}catch(e){return!1}return!0}y.exports=p
});var q=require('@stdlib/utils-define-nonenumerable-read-only-property/dist'),v=a(),S=o();q(v,"sync",S);module.exports=v;
/** @license Apache-2.0 */
//# sourceMappingURL=index.js.map
