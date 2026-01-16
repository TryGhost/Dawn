"use strict";var e=function(r,i){return function(){return i||r((i={exports:{}}).exports,i),i.exports}};var a=e(function(Br,v){
function G(r){return Object.keys(Object(r))}v.exports=G
});var g=e(function(Ur,q){
var F=a();function K(){return(F(arguments)||"").length!==2}function z(){return K(1,2)}q.exports=z
});var O=e(function(jr,h){
var J=typeof Object.keys!="undefined";h.exports=J
});var w=e(function(Cr,d){
var Q=require('@stdlib/assert-is-arguments/dist'),b=a(),V=Array.prototype.slice;function Z(r){return Q(r)?b(V.call(r)):b(r)}d.exports=Z
});var k=e(function(Hr,x){
var $=require('@stdlib/assert-is-enumerable-property/dist'),rr=require('@stdlib/utils-noop/dist'),er=$(rr,"prototype");x.exports=er
});var P=e(function(Ir,S){
var tr=require('@stdlib/assert-is-enumerable-property/dist'),ir={toString:null},or=!tr(ir,"toString");S.exports=or
});var f=e(function(Lr,m){
function sr(r){return r.constructor&&r.constructor.prototype===r}m.exports=sr
});var E=e(function(Dr,nr){nr.exports=["console","external","frame","frameElement","frames","innerHeight","innerWidth","outerHeight","outerWidth","pageXOffset","pageYOffset","parent","scrollLeft","scrollTop","scrollX","scrollY","self","webkitIndexedDB","webkitStorageInfo","window"]});var A=e(function(Wr,_){
var ur=typeof window=="undefined"?void 0:window;_.exports=ur
});var j=e(function(Mr,U){
var ar=require('@stdlib/assert-has-own-property/dist'),cr=require('@stdlib/utils-index-of/dist'),N=require('@stdlib/utils-type-of/dist'),pr=f(),fr=E(),s=A(),B;function lr(){var r;if(N(s)==="undefined")return!1;for(r in s)try{cr(fr,r)===-1&&ar(s,r)&&s[r]!==null&&N(s[r])==="object"&&pr(s[r])}catch(i){return!0}return!1}B=lr();U.exports=B
});var H=e(function(Rr,C){
var yr=typeof window!="undefined";C.exports=yr
});var D=e(function(Tr,L){
var vr=j(),I=f(),qr=H();function gr(r){if(qr===!1&&!vr)return I(r);try{return I(r)}catch(i){return!1}}L.exports=gr
});var W=e(function(Xr,hr){hr.exports=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"]});var T=e(function(Yr,R){
var Or=require('@stdlib/assert-is-object-like/dist'),l=require('@stdlib/assert-has-own-property/dist'),br=require('@stdlib/assert-is-arguments/dist'),dr=k(),wr=P(),xr=D(),M=W();function kr(r){var i,y,p,o,n,u,t;if(o=[],br(r)){for(t=0;t<r.length;t++)o.push(t.toString());return o}if(typeof r=="string"){if(r.length>0&&!l(r,"0"))for(t=0;t<r.length;t++)o.push(t.toString())}else{if(p=typeof r=="function",p===!1&&!Or(r))return o;y=dr&&p}for(n in r)!(y&&n==="prototype")&&l(r,n)&&o.push(String(n));if(wr)for(i=xr(r),t=0;t<M.length;t++)u=M[t],!(i&&u==="constructor")&&l(r,u)&&o.push(String(u));return o}R.exports=kr
});var Y=e(function(Gr,X){
var Sr=g(),Pr=O(),mr=a(),Er=w(),_r=T(),c;Pr?Sr()?c=Er:c=mr:c=_r;X.exports=c
});var Ar=Y();module.exports=Ar;
/** @license Apache-2.0 */
//# sourceMappingURL=index.js.map
