"use strict";var e=function(a,r){return function(){return r||a((r={exports:{}}).exports,r),r.exports}};var i=e(function(m,t){
var u=typeof Uint8ClampedArray=="function"?Uint8ClampedArray:null;t.exports=u
});var s=e(function(d,p){
var l=require('@stdlib/assert-is-uint8clampedarray/dist'),n=i();function o(){var a,r;if(typeof n!="function")return!1;try{r=new n([-1,0,1,3.14,4.99,255,256]),a=l(r)&&r[0]===0&&r[1]===0&&r[2]===1&&r[3]===3&&r[4]===5&&r[5]===255&&r[6]===255}catch(c){a=!1}return a}p.exports=o
});var y=s();module.exports=y;
/** @license Apache-2.0 */
//# sourceMappingURL=index.js.map
