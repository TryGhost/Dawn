"use strict";var t=function(a,r){return function(){return r||a((r={exports:{}}).exports,r),r.exports}};var o=t(function(v,e){
var i=typeof Float64Array=="function"?Float64Array:null;e.exports=i
});var l=t(function(A,u){
var n=require('@stdlib/assert-is-float64array/dist'),s=o();function p(){var a,r;if(typeof s!="function")return!1;try{r=new s([1,3.14,-3.14,NaN]),a=n(r)&&r[0]===1&&r[1]===3.14&&r[2]===-3.14&&r[3]!==r[3]}catch(c){a=!1}return a}u.exports=p
});var y=l();module.exports=y;
/** @license Apache-2.0 */
//# sourceMappingURL=index.js.map
