"use strict";var o=function(r,i){return function(){return i||r((i={exports:{}}).exports,i),i.exports}};var v=o(function(l,u){
var s=require('@stdlib/assert-is-string/dist').isPrimitive,t=require('@stdlib/error-tools-fmtprodmsg/dist'),n=/[-\/\\^$*+?.()|[\]{}]/g;function g(r){var i,a,e;if(!s(r))throw new TypeError(t('1TZB7',r));if(r[0]==="/")for(i=r.length,e=i-1;e>=0&&r[e]!=="/";e--);return e===void 0||e<=0?r.replace(n,"\\$&"):(a=r.substring(1,e),a=a.replace(n,"\\$&"),r=r[0]+a+r.substring(e),r)}u.exports=g
});var p=v();module.exports=p;
/** @license Apache-2.0 */
//# sourceMappingURL=index.js.map
