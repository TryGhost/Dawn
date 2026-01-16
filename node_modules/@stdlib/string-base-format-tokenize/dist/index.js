"use strict";var a=function(e,i){return function(){return i||e((i={exports:{}}).exports,i),i.exports}};var t=a(function(f,p){
var o=/%(?:([1-9]\d*)\$)?([0 +\-#]*)(\*|\d+)?(?:(\.)(\*|\d+)?)?[hlL]?([%A-Za-z])/g;function l(e){var i={mapping:e[1]?parseInt(e[1],10):void 0,flags:e[2],width:e[3],precision:e[5],specifier:e[6]};return e[4]==="."&&e[5]===void 0&&(i.precision="1"),i}function u(e){var i,n,r,s;for(n=[],s=0,r=o.exec(e);r;)i=e.slice(s,o.lastIndex-r[0].length),i.length&&n.push(i),n.push(l(r)),s=o.lastIndex,r=o.exec(e);return i=e.slice(s),i.length&&n.push(i),n}p.exports=u
});var v=t();module.exports=v;
/** @license Apache-2.0 */
//# sourceMappingURL=index.js.map
