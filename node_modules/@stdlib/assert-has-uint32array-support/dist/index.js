"use strict";var a=function(t,r){return function(){return r||t((r={exports:{}}).exports,r),r.exports}};var n=a(function(A,i){
var p=typeof Uint32Array=="function"?Uint32Array:null;i.exports=p
});var o=a(function(U,s){
var y=require('@stdlib/assert-is-uint32array/dist'),e=require('@stdlib/constants-uint32-max/dist'),u=n();function c(){var t,r;if(typeof u!="function")return!1;try{r=[1,3.14,-3.14,e+1,e+2],r=new u(r),t=y(r)&&r[0]===1&&r[1]===3&&r[2]===e-2&&r[3]===0&&r[4]===1}catch(l){t=!1}return t}s.exports=c
});var f=o();module.exports=f;
/** @license Apache-2.0 */
//# sourceMappingURL=index.js.map
