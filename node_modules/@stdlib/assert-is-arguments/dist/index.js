"use strict";var t=function(r,e){return function(){return e||r((e={exports:{}}).exports,e),e.exports}};var s=t(function(P,n){
var l=require('@stdlib/utils-native-class/dist');function m(r){return l(r)==="[object Arguments]"}n.exports=m
});var a=t(function(d,o){
var q=s(),u;function p(){return q(arguments)}u=p();o.exports=u
});var g=t(function(w,c){
var A=require('@stdlib/assert-has-own-property/dist'),f=require('@stdlib/assert-is-enumerable-property/dist'),h=require('@stdlib/assert-is-array/dist'),b=require('@stdlib/math-base-assert-is-integer/dist'),v=require('@stdlib/constants-uint32-max/dist');function y(r){return r!==null&&typeof r=="object"&&!h(r)&&typeof r.length=="number"&&b(r.length)&&r.length>=0&&r.length<=v&&A(r,"callee")&&!f(r,"callee")}c.exports=y
});var x=a(),j=s(),C=g(),i;x?i=j:i=C;module.exports=i;
/** @license Apache-2.0 */
//# sourceMappingURL=index.js.map
