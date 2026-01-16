"use strict";var t=function(e,r){return function(){return r||e((r={exports:{}}).exports,r),r.exports}};var o=t(function(B,u){
var s=typeof Buffer=="function"?Buffer:null;u.exports=s
});var n=t(function(m,i){
var a=require('@stdlib/assert-is-buffer/dist'),f=o();function c(){var e,r;if(typeof f!="function")return!1;try{typeof f.from=="function"?r=f.from([1,2,3,4]):r=new f([1,2,3,4]),e=a(r)&&r[0]===1&&r[1]===2&&r[2]===3&&r[3]===4}catch(p){e=!1}return e}i.exports=c
});var l=n();module.exports=l;
/** @license Apache-2.0 */
//# sourceMappingURL=index.js.map
