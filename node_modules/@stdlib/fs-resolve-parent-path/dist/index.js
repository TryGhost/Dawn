"use strict";var o=function(r,e){return function(){return e||r((e={exports:{}}).exports,e),e.exports}};var d=o(function(L,q){
var T=require('@stdlib/assert-is-plain-object/dist'),V=require('@stdlib/assert-has-own-property/dist'),F=require('@stdlib/assert-is-string/dist').isPrimitive,c=require('@stdlib/error-tools-fmtprodmsg/dist');function S(r,e){return T(e)?V(e,"dir")&&(r.dir=e.dir,!F(r.dir))?new TypeError(c('0OP2W',"dir",r.dir)):null:new TypeError(c('0OP2V',e));}q.exports=S
});var y=o(function(M,P){
var v=require("path").resolve,j=require('@stdlib/assert-is-string/dist').isPrimitive,k=require('@stdlib/assert-is-function/dist'),g=require('@stdlib/process-cwd/dist'),w=require('@stdlib/fs-exists/dist'),h=require('@stdlib/error-tools-fmtprodmsg/dist'),C=d();function R(r,e,s){var a,u,i,t,n,l;if(!j(r))throw new TypeError(h('0OP3F',r));if(i={},arguments.length>2){if(t=s,l=C(i,e),l)throw l}else t=e;if(!k(t))throw new TypeError(h('0OP2b',t));i.dir?n=v(g(),i.dir):n=g(),a=v(n,r),w(a,m);function m(J,O){if(O)return t(null,a);if(u=n,n=v(n,".."),u===n)return t(null,null);a=v(n,r),w(a,m)}}P.exports=R
});var x=o(function(N,p){
var f=require("path").resolve,z=require('@stdlib/assert-is-string/dist').isPrimitive,b=require('@stdlib/process-cwd/dist'),A=require('@stdlib/fs-exists/dist').sync,B=require('@stdlib/error-tools-fmtprodmsg/dist'),D=d();function G(r,e){var s,a,u,i,t;if(!z(r))throw new TypeError(B('0OP3F',r));if(u={},arguments.length>1&&(t=D(u,e),t))throw t;for(u.dir?i=f(b(),u.dir):i=b();a!==i;){if(s=f(i,r),A(s))return s;a=i,i=f(i,"..")}return null}p.exports=G
});var H=require('@stdlib/utils-define-nonenumerable-read-only-property/dist'),E=y(),I=x();H(E,"sync",I);module.exports=E;
/** @license Apache-2.0 */
//# sourceMappingURL=index.js.map
