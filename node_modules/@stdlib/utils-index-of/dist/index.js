"use strict";var v=function(i,r){return function(){return r||i((r={exports:{}}).exports,r),r.exports}};var l=v(function(h,a){
var u=require('@stdlib/assert-is-nan/dist'),f=require('@stdlib/assert-is-collection/dist'),g=require('@stdlib/assert-is-string/dist').isPrimitive,o=require('@stdlib/assert-is-integer/dist').isPrimitive,s=require('@stdlib/error-tools-fmtprodmsg/dist');function q(i,r,t){var n,e;if(!f(i)&&!g(i))throw new TypeError(s('1UR2O',i));if(n=i.length,n===0)return-1;if(arguments.length===3){if(!o(t))throw new TypeError(s('1UR2z',t));if(t>=0){if(t>=n)return-1;e=t}else e=n+t,e<0&&(e=0)}else e=0;if(u(r)){for(;e<n;e++)if(u(i[e]))return e}else for(;e<n;e++)if(i[e]===r)return e;return-1}a.exports=q
});var m=l();module.exports=m;
/** @license Apache-2.0 */
//# sourceMappingURL=index.js.map
