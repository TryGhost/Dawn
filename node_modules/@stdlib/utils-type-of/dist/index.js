"use strict";var t=function(e,r){return function(){return r||e((r={exports:{}}).exports,r),r.exports}};var u=t(function(I,o){
var d=/./;o.exports=d
});var a=t(function(P,s){
var x=require('@stdlib/utils-global/dist'),i=x(),m=i.document&&i.document.childNodes;s.exports=m
});var c=t(function(z,n){
var b=Int8Array;n.exports=b
});var p=t(function(B,f){
var L=u(),N=a(),h=c();function j(){return typeof L=="function"||typeof h=="object"||typeof N=="function"}f.exports=j
});var y=t(function(D,l){
var w=require('@stdlib/utils-constructor-name/dist');function C(e){var r;return e===null?"null":(r=typeof e,r==="object"?w(e).toLowerCase():r)}l.exports=C
});var q=t(function(F,v){
var E=require('@stdlib/utils-constructor-name/dist');function O(e){return E(e).toLowerCase()}v.exports=O
});var R=p(),g=y(),k=q(),A=R()?k:g;module.exports=A;
/** @license Apache-2.0 */
//# sourceMappingURL=index.js.map
