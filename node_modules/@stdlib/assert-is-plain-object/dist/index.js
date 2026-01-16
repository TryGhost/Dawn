"use strict";var s=function(t,r){return function(){return r||t((r={exports:{}}).exports,r),r.exports}};var n=s(function(q,i){
var u=require('@stdlib/assert-is-object/dist'),o=require('@stdlib/assert-is-function/dist'),c=require('@stdlib/utils-get-prototype-of/dist'),e=require('@stdlib/assert-has-own-property/dist'),a=require('@stdlib/utils-native-class/dist'),f=Object.prototype;function p(t){var r;for(r in t)if(!e(t,r))return!1;return!0}function v(t){var r;return u(t)?(r=c(t),r?!e(t,"constructor")&&e(r,"constructor")&&o(r.constructor)&&a(r.constructor)==="[object Function]"&&e(r,"isPrototypeOf")&&o(r.isPrototypeOf)&&(r===f||p(t)):!0):!1}i.exports=v
});var O=n();module.exports=O;
/** @license Apache-2.0 */
//# sourceMappingURL=index.js.map
