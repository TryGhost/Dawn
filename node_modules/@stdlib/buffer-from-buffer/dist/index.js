"use strict";var i=function(r,e){return function(){return e||r((e={exports:{}}).exports,e),e.exports}};var t=i(function(M,a){
var n=require('@stdlib/assert-is-function/dist'),q=require('@stdlib/buffer-ctor/dist'),m=n(q.from);a.exports=m
});var o=i(function(T,f){
var p=require('@stdlib/assert-is-buffer/dist'),B=require('@stdlib/error-tools-fmtprodmsg/dist'),l=require('@stdlib/buffer-ctor/dist');function c(r){if(!p(r))throw new TypeError(B('0GN3b',r));return l.from(r)}f.exports=c
});var v=i(function(V,s){
var w=require('@stdlib/assert-is-buffer/dist'),d=require('@stdlib/error-tools-fmtprodmsg/dist'),x=require('@stdlib/buffer-ctor/dist');function y(r){if(!w(r))throw new TypeError(d('0GN3b',r));return new x(r)}s.exports=y
});var h=t(),g=o(),E=v(),u;h?u=g:u=E;module.exports=u;
/** @license Apache-2.0 */
//# sourceMappingURL=index.js.map
