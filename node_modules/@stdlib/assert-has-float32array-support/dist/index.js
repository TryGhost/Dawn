"use strict";var t=function(a,r){return function(){return r||a((r={exports:{}}).exports,r),r.exports}};var o=t(function(F,e){
var l=typeof Float32Array=="function"?Float32Array:null;e.exports=l
});var i=t(function(A,s){
var n=require('@stdlib/assert-is-float32array/dist'),p=require('@stdlib/constants-float64-pinf/dist'),u=o();function y(){var a,r;if(typeof u!="function")return!1;try{r=new u([1,3.14,-3.14,5e40]),a=n(r)&&r[0]===1&&r[1]===3.140000104904175&&r[2]===-3.140000104904175&&r[3]===p}catch(f){a=!1}return a}s.exports=y
});var c=i();module.exports=c;
/** @license Apache-2.0 */
//# sourceMappingURL=index.js.map
