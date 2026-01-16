"use strict";var e=function(t,r){return function(){return r||t((r={exports:{}}).exports,r),r.exports}};var n=e(function(A,a){
var o=typeof Int32Array=="function"?Int32Array:null;a.exports=o
});var s=e(function(q,i){
var p=require('@stdlib/assert-is-int32array/dist'),y=require('@stdlib/constants-int32-max/dist'),I=require('@stdlib/constants-int32-min/dist'),u=n();function c(){var t,r;if(typeof u!="function")return!1;try{r=new u([1,3.14,-3.14,y+1]),t=p(r)&&r[0]===1&&r[1]===3&&r[2]===-3&&r[3]===I}catch(v){t=!1}return t}i.exports=c
});var f=s();module.exports=f;
/** @license Apache-2.0 */
//# sourceMappingURL=index.js.map
