"use strict";var a=function(e,r){return function(){return r||e((r={exports:{}}).exports,r),r.exports}};var u=a(function(q,n){
var c=require('@stdlib/utils-native-class/dist'),s=require('@stdlib/regexp-function-name/dist').REGEXP,o=require('@stdlib/assert-is-buffer/dist');function f(e){var r,t,i;if(t=c(e).slice(8,-1),(t==="Object"||t==="Error")&&e.constructor){if(i=e.constructor,typeof i.name=="string")return i.name;if(r=s.exec(i.toString()),r)return r[1]}return o(e)?"Buffer":t}n.exports=f
});var m=u();module.exports=m;
/** @license Apache-2.0 */
//# sourceMappingURL=index.js.map
