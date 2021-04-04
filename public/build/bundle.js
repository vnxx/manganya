var app=function(){"use strict";function t(){}function e(t,e){for(const n in e)t[n]=e[n];return t}function n(t){return t()}function r(){return Object.create(null)}function o(t){t.forEach(n)}function l(t){return"function"==typeof t}function s(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function c(t,e,n,r){if(t){const o=i(t,e,n,r);return t[0](o)}}function i(t,n,r,o){return t[1]&&o?e(r.ctx.slice(),t[1](o(n))):r.ctx}function a(t,e,n,r,o,l,s){const c=function(t,e,n,r){if(t[2]&&r){const o=t[2](r(n));if(void 0===e.dirty)return o;if("object"==typeof o){const t=[],n=Math.max(e.dirty.length,o.length);for(let r=0;r<n;r+=1)t[r]=e.dirty[r]|o[r];return t}return e.dirty|o}return e.dirty}(e,r,o,l);if(c){const o=i(e,n,r,s);t.p(o,c)}}function u(t,e){t.appendChild(e)}function f(t,e,n){t.insertBefore(e,n||null)}function d(t){t.parentNode.removeChild(t)}function p(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function g(t){return document.createElement(t)}function h(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function m(t){return document.createTextNode(t)}function $(){return m(" ")}function w(){return m("")}function x(t,e,n,r){return t.addEventListener(e,n,r),()=>t.removeEventListener(e,n,r)}function v(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function b(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}let y;function k(t){y=t}function E(){if(!y)throw new Error("Function called outside component initialization");return y}function L(t){E().$$.on_mount.push(t)}function _(){const t=E();return(e,n)=>{const r=t.$$.callbacks[e];if(r){const o=function(t,e){const n=document.createEvent("CustomEvent");return n.initCustomEvent(t,!1,!1,e),n}(e,n);r.slice().forEach((e=>{e.call(t,o)}))}}}function j(t,e){const n=t.$$.callbacks[e.type];n&&n.slice().forEach((t=>t(e)))}const S=[],O=[],B=[],N=[],A=Promise.resolve();let M=!1;function Y(){M||(M=!0,A.then(I))}function z(){return Y(),A}function C(t){B.push(t)}let H=!1;const U=new Set;function I(){if(!H){H=!0;do{for(let t=0;t<S.length;t+=1){const e=S[t];k(e),R(e.$$)}for(k(null),S.length=0;O.length;)O.pop()();for(let t=0;t<B.length;t+=1){const e=B[t];U.has(e)||(U.add(e),e())}B.length=0}while(S.length);for(;N.length;)N.pop()();M=!1,H=!1,U.clear()}}function R(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(C)}}const q=new Set;let T;function P(){T={r:0,c:[],p:T}}function V(){T.r||o(T.c),T=T.p}function Z(t,e){t&&t.i&&(q.delete(t),t.i(e))}function D(t,e,n,r){if(t&&t.o){if(q.has(t))return;q.add(t),T.c.push((()=>{q.delete(t),r&&(n&&t.d(1),r())})),t.o(e)}}function X(t,e){const n={},r={},o={$$scope:1};let l=t.length;for(;l--;){const s=t[l],c=e[l];if(c){for(const t in s)t in c||(r[t]=1);for(const t in c)o[t]||(n[t]=c[t],o[t]=1);t[l]=c}else for(const t in s)o[t]=1}for(const t in r)t in n||(n[t]=void 0);return n}function F(t){return"object"==typeof t&&null!==t?t:{}}function W(t){t&&t.c()}function G(t,e,r,s){const{fragment:c,on_mount:i,on_destroy:a,after_update:u}=t.$$;c&&c.m(e,r),s||C((()=>{const e=i.map(n).filter(l);a?a.push(...e):o(e),t.$$.on_mount=[]})),u.forEach(C)}function J(t,e){const n=t.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function K(e,n,l,s,c,i,a=[-1]){const u=y;k(e);const f=e.$$={fragment:null,ctx:null,props:i,update:t,not_equal:c,bound:r(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(u?u.$$.context:n.context||[]),callbacks:r(),dirty:a,skip_bound:!1};let p=!1;if(f.ctx=l?l(e,n.props||{},((t,n,...r)=>{const o=r.length?r[0]:n;return f.ctx&&c(f.ctx[t],f.ctx[t]=o)&&(!f.skip_bound&&f.bound[t]&&f.bound[t](o),p&&function(t,e){-1===t.$$.dirty[0]&&(S.push(t),Y(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}(e,t)),n})):[],f.update(),p=!0,o(f.before_update),f.fragment=!!s&&s(f.ctx),n.target){if(n.hydrate){const t=function(t){return Array.from(t.childNodes)}(n.target);f.fragment&&f.fragment.l(t),t.forEach(d)}else f.fragment&&f.fragment.c();n.intro&&Z(e.$$.fragment),G(e,n.target,n.anchor,n.customElement),I()}k(u)}class Q{$destroy(){J(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const tt=[];function et(t,e){return{subscribe:nt(t,e).subscribe}}function nt(e,n=t){let r;const o=[];function l(t){if(s(e,t)&&(e=t,r)){const t=!tt.length;for(let t=0;t<o.length;t+=1){const n=o[t];n[1](),tt.push(n,e)}if(t){for(let t=0;t<tt.length;t+=2)tt[t][0](tt[t+1]);tt.length=0}}}return{set:l,update:function(t){l(t(e))},subscribe:function(s,c=t){const i=[s,c];return o.push(i),1===o.length&&(r=n(l)||t),s(e),()=>{const t=o.indexOf(i);-1!==t&&o.splice(t,1),0===o.length&&(r(),r=null)}}}}function rt(e,n,r){const s=!Array.isArray(e),c=s?[e]:e,i=n.length<2;return et(r,(e=>{let r=!1;const a=[];let u=0,f=t;const d=()=>{if(u)return;f();const r=n(s?a[0]:a,e);i?e(r):f=l(r)?r:t},p=c.map(((e,n)=>function(e,...n){if(null==e)return t;const r=e.subscribe(...n);return r.unsubscribe?()=>r.unsubscribe():r}(e,(t=>{a[n]=t,u&=~(1<<n),r&&d()}),(()=>{u|=1<<n}))));return r=!0,d(),function(){o(p),f()}}))}function ot(t){let n,r,o;const l=[t[2]];var s=t[0];function c(t){let n={};for(let t=0;t<l.length;t+=1)n=e(n,l[t]);return{props:n}}return s&&(n=new s(c()),n.$on("routeEvent",t[7])),{c(){n&&W(n.$$.fragment),r=w()},m(t,e){n&&G(n,t,e),f(t,r,e),o=!0},p(t,e){const o=4&e?X(l,[F(t[2])]):{};if(s!==(s=t[0])){if(n){P();const t=n;D(t.$$.fragment,1,0,(()=>{J(t,1)})),V()}s?(n=new s(c()),n.$on("routeEvent",t[7]),W(n.$$.fragment),Z(n.$$.fragment,1),G(n,r.parentNode,r)):n=null}else s&&n.$set(o)},i(t){o||(n&&Z(n.$$.fragment,t),o=!0)},o(t){n&&D(n.$$.fragment,t),o=!1},d(t){t&&d(r),n&&J(n,t)}}}function lt(t){let n,r,o;const l=[{params:t[1]},t[2]];var s=t[0];function c(t){let n={};for(let t=0;t<l.length;t+=1)n=e(n,l[t]);return{props:n}}return s&&(n=new s(c()),n.$on("routeEvent",t[6])),{c(){n&&W(n.$$.fragment),r=w()},m(t,e){n&&G(n,t,e),f(t,r,e),o=!0},p(t,e){const o=6&e?X(l,[2&e&&{params:t[1]},4&e&&F(t[2])]):{};if(s!==(s=t[0])){if(n){P();const t=n;D(t.$$.fragment,1,0,(()=>{J(t,1)})),V()}s?(n=new s(c()),n.$on("routeEvent",t[6]),W(n.$$.fragment),Z(n.$$.fragment,1),G(n,r.parentNode,r)):n=null}else s&&n.$set(o)},i(t){o||(n&&Z(n.$$.fragment,t),o=!0)},o(t){n&&D(n.$$.fragment,t),o=!1},d(t){t&&d(r),n&&J(n,t)}}}function st(t){let e,n,r,o;const l=[lt,ot],s=[];function c(t,e){return t[1]?0:1}return e=c(t),n=s[e]=l[e](t),{c(){n.c(),r=w()},m(t,n){s[e].m(t,n),f(t,r,n),o=!0},p(t,[o]){let i=e;e=c(t),e===i?s[e].p(t,o):(P(),D(s[i],1,1,(()=>{s[i]=null})),V(),n=s[e],n?n.p(t,o):(n=s[e]=l[e](t),n.c()),Z(n,1),n.m(r.parentNode,r))},i(t){o||(Z(n),o=!0)},o(t){D(n),o=!1},d(t){s[e].d(t),t&&d(r)}}}function ct(){const t=window.location.href.indexOf("#/");let e=t>-1?window.location.href.substr(t+1):"/";const n=e.indexOf("?");let r="";return n>-1&&(r=e.substr(n+1),e=e.substr(0,n)),{location:e,querystring:r}}const it=et(null,(function(t){t(ct());const e=()=>{t(ct())};return window.addEventListener("hashchange",e,!1),function(){window.removeEventListener("hashchange",e,!1)}}));function at(t,e,n){let{routes:r={}}=e,{prefix:o=""}=e,{restoreScrollState:l=!1}=e;class s{constructor(t,e){if(!e||"function"!=typeof e&&("object"!=typeof e||!0!==e._sveltesparouter))throw Error("Invalid component object");if(!t||"string"==typeof t&&(t.length<1||"/"!=t.charAt(0)&&"*"!=t.charAt(0))||"object"==typeof t&&!(t instanceof RegExp))throw Error('Invalid value for "path" argument - strings must start with / or *');const{pattern:n,keys:r}=function(t,e){if(t instanceof RegExp)return{keys:!1,pattern:t};var n,r,o,l,s=[],c="",i=t.split("/");for(i[0]||i.shift();o=i.shift();)"*"===(n=o[0])?(s.push("wild"),c+="/(.*)"):":"===n?(r=o.indexOf("?",1),l=o.indexOf(".",1),s.push(o.substring(1,~r?r:~l?l:o.length)),c+=~r&&!~l?"(?:/([^/]+?))?":"/([^/]+?)",~l&&(c+=(~r?"?":"")+"\\"+o.substring(l))):c+="/"+o;return{keys:s,pattern:new RegExp("^"+c+(e?"(?=$|/)":"/?$"),"i")}}(t);this.path=t,"object"==typeof e&&!0===e._sveltesparouter?(this.component=e.component,this.conditions=e.conditions||[],this.userData=e.userData,this.props=e.props||{}):(this.component=()=>Promise.resolve(e),this.conditions=[],this.props={}),this._pattern=n,this._keys=r}match(t){if(o)if("string"==typeof o){if(!t.startsWith(o))return null;t=t.substr(o.length)||"/"}else if(o instanceof RegExp){const e=t.match(o);if(!e||!e[0])return null;t=t.substr(e[0].length)||"/"}const e=this._pattern.exec(t);if(null===e)return null;if(!1===this._keys)return e;const n={};let r=0;for(;r<this._keys.length;){try{n[this._keys[r]]=decodeURIComponent(e[r+1]||"")||null}catch(t){n[this._keys[r]]=null}r++}return n}async checkConditions(t){for(let e=0;e<this.conditions.length;e++)if(!await this.conditions[e](t))return!1;return!0}}const c=[];r instanceof Map?r.forEach(((t,e)=>{c.push(new s(e,t))})):Object.keys(r).forEach((t=>{c.push(new s(t,r[t]))}));let i=null,a=null,u={};const f=_();async function d(t,e){await z(),f(t,e)}let p=null;var g;l&&(window.addEventListener("popstate",(t=>{p=t.state&&t.state.scrollY?t.state:null})),g=()=>{p?window.scrollTo(p.scrollX,p.scrollY):window.scrollTo(0,0)},E().$$.after_update.push(g));let h=null,m=null;return it.subscribe((async t=>{h=t;let e=0;for(;e<c.length;){const r=c[e].match(t.location);if(!r){e++;continue}const o={route:c[e].path,location:t.location,querystring:t.querystring,userData:c[e].userData};if(!await c[e].checkConditions(o))return n(0,i=null),m=null,void d("conditionsFailed",o);d("routeLoading",Object.assign({},o));const l=c[e].component;if(m!=l){l.loading?(n(0,i=l.loading),m=l,n(1,a=l.loadingParams),n(2,u={}),d("routeLoaded",Object.assign({},o,{component:i,name:i.name}))):(n(0,i=null),m=null);const e=await l();if(t!=h)return;n(0,i=e&&e.default||e),m=l}return r&&"object"==typeof r&&Object.keys(r).length?n(1,a=r):n(1,a=null),n(2,u=c[e].props),void d("routeLoaded",Object.assign({},o,{component:i,name:i.name}))}n(0,i=null),m=null})),t.$$set=t=>{"routes"in t&&n(3,r=t.routes),"prefix"in t&&n(4,o=t.prefix),"restoreScrollState"in t&&n(5,l=t.restoreScrollState)},t.$$.update=()=>{32&t.$$.dirty&&(history.scrollRestoration=l?"manual":"auto")},[i,a,u,r,o,l,function(e){j(t,e)},function(e){j(t,e)}]}rt(it,(t=>t.location)),rt(it,(t=>t.querystring));class ut extends Q{constructor(t){super(),K(this,t,at,st,s,{routes:3,prefix:4,restoreScrollState:5})}}function ft(e){let n,r;return{c(){n=h("svg"),r=h("path"),v(r,"d","M10 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6m13.12 2.88l-4.26-4.26A9.842 9.842 0 0 0 20 10c0-5.52-4.48-10-10-10S0 4.48 0 10s4.48 10 10 10c1.67 0 3.24-.41 4.62-1.14l4.26 4.26a3 3 0 0 0 4.24 0 3 3 0 0 0 0-4.24"),v(n,"class","gUZ B9u"),v(n,"height","24"),v(n,"width","24"),v(n,"viewBox","0 0 24 24"),v(n,"aria-label","Search"),v(n,"role","img"),v(n,"xmlns","http://www.w3.org/2000/svg")},m(t,e){f(t,n,e),u(n,r)},p:t,i:t,o:t,d(t){t&&d(n)}}}class dt extends Q{constructor(t){super(),K(this,t,null,ft,s,{})}}function pt(e){let n,r;return{c(){n=h("svg"),r=h("path"),v(r,"d","M22 10h-8V2a2 2 0 0 0-4 0v8H2a2 2 0 0 0 0 4h8v8a2 2 0 0 0 4 0v-8h8a2 2 0 0 0 0-4"),v(n,"class","gUZ pBj U9O kVc"),v(n,"height","20"),v(n,"width","20"),v(n,"viewBox","0 0 24 24"),v(n,"aria-hidden","true"),v(n,"aria-label",""),v(n,"role","img"),v(n,"xmlns","http://www.w3.org/2000/svg")},m(t,e){f(t,n,e),u(n,r)},p:t,i:t,o:t,d(t){t&&d(n)}}}class gt extends Q{constructor(t){super(),K(this,t,null,pt,s,{})}}function ht(e){let n,r;return{c(){n=h("svg"),r=h("path"),v(r,"d","M15.18 12l7.16-7.16c.88-.88.88-2.3 0-3.18-.88-.88-2.3-.88-3.18 0L12 8.82 4.84 1.66c-.88-.88-2.3-.88-3.18 0-.88.88-.88 2.3 0 3.18L8.82 12l-7.16 7.16c-.88.88-.88 2.3 0 3.18.44.44 1.01.66 1.59.66.58 0 1.15-.22 1.59-.66L12 15.18l7.16 7.16c.44.44 1.01.66 1.59.66.58 0 1.15-.22 1.59-.66.88-.88.88-2.3 0-3.18L15.18 12z"),v(n,"class","gUZ pBj U9O kVc"),v(n,"height","16"),v(n,"width","16"),v(n,"viewBox","0 0 24 24"),v(n,"aria-hidden","true"),v(n,"aria-label",""),v(n,"role","img"),v(n,"xmlns","http://www.w3.org/2000/svg")},m(t,e){f(t,n,e),u(n,r)},p:t,i:t,o:t,d(t){t&&d(n)}}}class mt extends Q{constructor(t){super(),K(this,t,null,ht,s,{})}}function $t(e){let n,r;return{c(){n=h("svg"),r=h("path"),v(r,"d","M17.28 24c-.57 0-1.14-.22-1.58-.66L4.5 12 15.7.66a2.21 2.21 0 0 1 3.15 0c.87.88.87 2.3 0 3.18L10.79 12l8.06 8.16c.87.88.87 2.3 0 3.18-.44.44-1 .66-1.57.66"),v(n,"class","transform rotate-180"),v(n,"height","16"),v(n,"width","16"),v(n,"viewBox","0 0 24 24"),v(n,"aria-hidden","true"),v(n,"aria-label",""),v(n,"role","img"),v(n,"xmlns","http://www.w3.org/2000/svg")},m(t,e){f(t,n,e),u(n,r)},p:t,i:t,o:t,d(t){t&&d(n)}}}class wt extends Q{constructor(t){super(),K(this,t,null,$t,s,{})}}function xt(e){let n,r;return{c(){n=h("svg"),r=h("path"),v(r,"d","M17.28 24c-.57 0-1.14-.22-1.58-.66L4.5 12 15.7.66a2.21 2.21 0 0 1 3.15 0c.87.88.87 2.3 0 3.18L10.79 12l8.06 8.16c.87.88.87 2.3 0 3.18-.44.44-1 .66-1.57.66"),v(n,"class","Hn_ gUZ pBj U9O kVc"),v(n,"height","16"),v(n,"width","16"),v(n,"viewBox","0 0 24 24"),v(n,"aria-hidden","true"),v(n,"aria-label",""),v(n,"role","img"),v(n,"xmlns","http://www.w3.org/2000/svg")},m(t,e){f(t,n,e),u(n,r)},p:t,i:t,o:t,d(t){t&&d(n)}}}class vt extends Q{constructor(t){super(),K(this,t,null,xt,s,{})}}function bt(e){let n,r;return{c(){n=h("svg"),r=h("path"),v(r,"d","M12 0L1 10v14h8v-7a3 3 0 116 0v7h8V10z"),v(n,"class","gUZ pBj"),v(n,"height","24"),v(n,"width","24"),v(n,"viewBox","0 0 24 24"),v(n,"aria-label","Home"),v(n,"role","img"),v(n,"xmlns","http://www.w3.org/2000/svg")},m(t,e){f(t,n,e),u(n,r)},p:t,i:t,o:t,d(t){t&&d(n)}}}class yt extends Q{constructor(t){super(),K(this,t,null,bt,s,{})}}function kt(e){let n,r,o,l,s,c,i,a,p,h,m,w,b;return l=new yt({}),i=new dt({}),h=new gt({}),{c(){n=g("nav"),r=g("div"),o=g("button"),W(l.$$.fragment),s=$(),c=g("button"),W(i.$$.fragment),a=$(),p=g("button"),W(h.$$.fragment),v(o,"class","p-1 fill-current rounded-full"),v(c,"class","p-1 fill-current rounded-full"),v(p,"class","p-1 fill-current rounded-full"),v(r,"class","flex justify-between w-1/2 xl:w-1/6 p-3 rounded-full bg-gray-800 shadow-md"),v(n,"id","navbar"),v(n,"class","fixed left-0 flex justify-center items-center bottom-4 w-full z-50 transition-all duration-300 ease-in-out")},m(t,d){f(t,n,d),u(n,r),u(r,o),G(l,o,null),u(r,s),u(r,c),G(i,c,null),u(r,a),u(r,p),G(h,p,null),m=!0,w||(b=x(o,"click",e[6]),w=!0)},p:t,i(t){m||(Z(l.$$.fragment,t),Z(i.$$.fragment,t),Z(h.$$.fragment,t),m=!0)},o(t){D(l.$$.fragment,t),D(i.$$.fragment,t),D(h.$$.fragment,t),m=!1},d(t){t&&d(n),J(l),J(i),J(h),w=!1,b()}}}function Et(t){let e,n,r,o,l,s,i,p,h=t[3]&&kt(t);const m=t[5].default,w=c(m,t,t[4],null);return{c(){e=g("div"),n=g("header"),r=g("h1"),r.innerHTML='<a href="/#/">Mangaku</a>',l=$(),h&&h.c(),s=$(),w&&w.c(),v(r,"class","text-center font-bold text-2xl"),v(n,"class",o=t[2]?"py-6 absolute xl:relative w-full top-0 z-10":"py-6"),v(e,"class",i=`max-w-5xl m-auto px-${t[0]} space-y-${t[1]} relative text-white`)},m(t,o){f(t,e,o),u(e,n),u(n,r),u(e,l),h&&h.m(e,null),u(e,s),w&&w.m(e,null),p=!0},p(t,[r]){(!p||4&r&&o!==(o=t[2]?"py-6 absolute xl:relative w-full top-0 z-10":"py-6"))&&v(n,"class",o),t[3]?h?(h.p(t,r),8&r&&Z(h,1)):(h=kt(t),h.c(),Z(h,1),h.m(e,s)):h&&(P(),D(h,1,1,(()=>{h=null})),V()),w&&w.p&&16&r&&a(w,m,t,t[4],r,null,null),(!p||3&r&&i!==(i=`max-w-5xl m-auto px-${t[0]} space-y-${t[1]} relative text-white`))&&v(e,"class",i)},i(t){p||(Z(h),Z(w,t),p=!0)},o(t){D(h),D(w,t),p=!1},d(t){t&&d(e),h&&h.d(),w&&w.d(t)}}}function Lt(t,e,n){let{$$slots:r={},$$scope:o}=e,{px:l=3}=e,{spaceY:s=3}=e,{isLayeringHeader:c=!1}=e,{showNav:i=!0}=e;var a=window.pageYOffset;window.onscroll=function(){var t=window.pageYOffset,e=document.getElementById("navbar");e&&(a>t?(e.classList.add("bottom-4"),e.classList.remove("-bottom-20")):(e.classList.add("-bottom-20"),e.classList.remove("bottom-4")),a=t)};return t.$$set=t=>{"px"in t&&n(0,l=t.px),"spaceY"in t&&n(1,s=t.spaceY),"isLayeringHeader"in t&&n(2,c=t.isLayeringHeader),"showNav"in t&&n(3,i=t.showNav),"$$scope"in t&&n(4,o=t.$$scope)},[l,s,c,i,o,r,()=>async function(t){if(!t||t.length<1||"/"!=t.charAt(0)&&0!==t.indexOf("#/"))throw Error("Invalid parameter location");await z(),history.replaceState({scrollX:window.scrollX,scrollY:window.scrollY},void 0,void 0),window.location.hash=("#"==t.charAt(0)?"":"#")+t}("/")]}class _t extends Q{constructor(t){super(),K(this,t,Lt,Et,s,{px:0,spaceY:1,isLayeringHeader:2,showNav:3})}}function jt(t){let e,n,r,o,l;const s=t[4].default,i=c(s,t,t[3],null);return{c(){e=g("div"),n=g("a"),i&&i.c(),v(n,"href",r="/#/manga/"+t[0]+"/"+t[1]),v(n,"class",o=`text-center flex justify-center items-center ${t[2]?"bg-gray-900 text-white":"bg-white text-gray-900"} text-lg font-bold hover:bg-gray-900 hover:text-white shadow-md transition duration-300 ease-in-out rounded-md`),v(e,"class","aspect-w-1 aspect-h-1")},m(t,r){f(t,e,r),u(e,n),i&&i.m(n,null),l=!0},p(t,[e]){i&&i.p&&8&e&&a(i,s,t,t[3],e,null,null),(!l||3&e&&r!==(r="/#/manga/"+t[0]+"/"+t[1]))&&v(n,"href",r),(!l||4&e&&o!==(o=`text-center flex justify-center items-center ${t[2]?"bg-gray-900 text-white":"bg-white text-gray-900"} text-lg font-bold hover:bg-gray-900 hover:text-white shadow-md transition duration-300 ease-in-out rounded-md`))&&v(n,"class",o)},i(t){l||(Z(i,t),l=!0)},o(t){D(i,t),l=!1},d(t){t&&d(e),i&&i.d(t)}}}function St(t,e,n){let{$$slots:r={},$$scope:o}=e,{slug:l}=e,{chapter:s}=e,{isSelected:c=!1}=e;return t.$$set=t=>{"slug"in t&&n(0,l=t.slug),"chapter"in t&&n(1,s=t.chapter),"isSelected"in t&&n(2,c=t.isSelected),"$$scope"in t&&n(3,o=t.$$scope)},[l,s,c,o,r]}class Ot extends Q{constructor(t){super(),K(this,t,St,jt,s,{slug:0,chapter:1,isSelected:2})}}function Bt(e){let n;return{c(){n=g("div"),n.innerHTML='<div class="w-full"><img class="w-1/2 xl:w-2/12 m-auto" src="/loading.gif" alt="Loading"/> \n        <p class="text-white text-center mt-3 text-lg">Loading Moment</p></div>',v(n,"id","loading"),v(n,"class","flex h-screen w-full justify-center items-center z-50 absolute top-0")},m(t,e){f(t,n,e)},p:t,i:t,o:t,d(t){t&&d(n)}}}class Nt extends Q{constructor(t){super(),K(this,t,null,Bt,s,{})}}function At(t,e,n){const r=t.slice();return r[2]=e[n],r}function Mt(e){let n,r;return n=new Nt({}),{c(){W(n.$$.fragment)},m(t,e){G(n,t,e),r=!0},p:t,i(t){r||(Z(n.$$.fragment,t),r=!0)},o(t){D(n.$$.fragment,t),r=!1},d(t){J(n,t)}}}function Yt(t){let e,n;return e=new _t({props:{px:"0",spaceY:"0",isLayeringHeader:!0,$$slots:{default:[Ht]},$$scope:{ctx:t}}}),{c(){W(e.$$.fragment)},m(t,r){G(e,t,r),n=!0},p(t,n){const r={};35&n&&(r.$$scope={dirty:n,ctx:t}),e.$set(r)},i(t){n||(Z(e.$$.fragment,t),n=!0)},o(t){D(e.$$.fragment,t),n=!1},d(t){J(e,t)}}}function zt(t){let e,n=t[2]+"";return{c(){e=m(n)},m(t,n){f(t,e,n)},p(t,r){2&r&&n!==(n=t[2]+"")&&b(e,n)},d(t){t&&d(e)}}}function Ct(t){let e,n;return e=new Ot({props:{chapter:t[2],slug:t[0].slug,$$slots:{default:[zt]},$$scope:{ctx:t}}}),{c(){W(e.$$.fragment)},m(t,r){G(e,t,r),n=!0},p(t,n){const r={};2&n&&(r.chapter=t[2]),1&n&&(r.slug=t[0].slug),34&n&&(r.$$scope={dirty:n,ctx:t}),e.$set(r)},i(t){n||(Z(e.$$.fragment,t),n=!0)},o(t){D(e.$$.fragment,t),n=!1},d(t){J(e,t)}}}function Ht(t){let e,n,r,o,l,s,c,i,a,h,w,x,y,k,E,L,_,j,S,O,B=t[1].title+"",N=t[1].sinopsis+"",A=t[1].chapters,M=[];for(let e=0;e<A.length;e+=1)M[e]=Ct(At(t,A,e));const Y=t=>D(M[t],1,1,(()=>{M[t]=null}));return{c(){e=g("div"),n=g("div"),r=g("div"),o=g("div"),l=g("img"),c=$(),i=g("div"),a=g("div"),h=g("h1"),w=m(B),x=$(),y=g("hr"),k=$(),E=g("p"),L=m(N),_=$(),j=g("div"),S=g("div");for(let t=0;t<M.length;t+=1)M[t].c();l.src!==(s=t[1].cover)&&v(l,"src",s),v(l,"alt","Solo Leveling"),v(l,"class","w-full pr-0 h-full block  top-3"),v(o,"class","bg-black opacity-40 w-full xl:w-3/4"),v(h,"class","text-xl font-bold"),v(y,"class","w-2/4 border-none h-0.5 bg-white rounded-full"),v(a,"class","space-y-3 bg-gray-800 rounded-lg p-5"),v(i,"class","px-3 -top-32 xl:w-3/4 relative shadow-lg"),v(r,"class","block xl:sticky top-0"),v(n,"class","relative xl:w-1/2 xl:top-0"),v(S,"class","grid grid-cols-5 xl:grid-cols-6 gap-3"),v(j,"class","px-3 w-full xl:w-1/2 xl:px-0 -mt-32 xl:mt-0 relative pt-8 xl:pt-0"),v(e,"class","block xl:flex")},m(t,s){f(t,e,s),u(e,n),u(n,r),u(r,o),u(o,l),u(r,c),u(r,i),u(i,a),u(a,h),u(h,w),u(a,x),u(a,y),u(a,k),u(a,E),u(E,L),u(e,_),u(e,j),u(j,S);for(let t=0;t<M.length;t+=1)M[t].m(S,null);O=!0},p(t,e){if((!O||2&e&&l.src!==(s=t[1].cover))&&v(l,"src",s),(!O||2&e)&&B!==(B=t[1].title+"")&&b(w,B),(!O||2&e)&&N!==(N=t[1].sinopsis+"")&&b(L,N),3&e){let n;for(A=t[1].chapters,n=0;n<A.length;n+=1){const r=At(t,A,n);M[n]?(M[n].p(r,e),Z(M[n],1)):(M[n]=Ct(r),M[n].c(),Z(M[n],1),M[n].m(S,null))}for(P(),n=A.length;n<M.length;n+=1)Y(n);V()}},i(t){if(!O){for(let t=0;t<A.length;t+=1)Z(M[t]);O=!0}},o(t){M=M.filter(Boolean);for(let t=0;t<M.length;t+=1)D(M[t]);O=!1},d(t){t&&d(e),p(M,t)}}}function Ut(t){let e,n,r,o;const l=[Yt,Mt],s=[];function c(t,e){return t[1]?0:1}return e=c(t),n=s[e]=l[e](t),{c(){n.c(),r=w()},m(t,n){s[e].m(t,n),f(t,r,n),o=!0},p(t,[o]){let i=e;e=c(t),e===i?s[e].p(t,o):(P(),D(s[i],1,1,(()=>{s[i]=null})),V(),n=s[e],n?n.p(t,o):(n=s[e]=l[e](t),n.c()),Z(n,1),n.m(r.parentNode,r))},i(t){o||(Z(n),o=!0)},o(t){D(n),o=!1},d(t){s[e].d(t),t&&d(r)}}}function It(t,e,n){let r,{params:o}=e;return L((async()=>{await fetch("/api/manga/"+o.slug).then((t=>t.json())).then((t=>{n(1,r=t)}))})),t.$$set=t=>{"params"in t&&n(0,o=t.params)},[o,r]}class Rt extends Q{constructor(t){super(),K(this,t,It,Ut,s,{params:0})}}function qt(e){let n,r,o,l,s,c,i,a,p,h,w=e[0].title+"";return{c(){n=g("a"),r=g("div"),o=g("img"),c=$(),i=g("div"),a=g("p"),p=m(w),o.src!==(l=e[0].cover)&&v(o,"src",l),v(o,"alt",s=e[0].title),v(o,"width","100%"),v(r,"class","manga-item-cover svelte-1uiq7m0"),v(a,"class","text-lg truncate font-bold text-white"),v(i,"class","mt-3"),v(n,"href",h="#/manga/"+e[0].slug)},m(t,e){f(t,n,e),u(n,r),u(r,o),u(n,c),u(n,i),u(i,a),u(a,p)},p(t,[e]){1&e&&o.src!==(l=t[0].cover)&&v(o,"src",l),1&e&&s!==(s=t[0].title)&&v(o,"alt",s),1&e&&w!==(w=t[0].title+"")&&b(p,w),1&e&&h!==(h="#/manga/"+t[0].slug)&&v(n,"href",h)},i:t,o:t,d(t){t&&d(n)}}}function Tt(t,e,n){let{data:r}=e;return t.$$set=t=>{"data"in t&&n(0,r=t.data)},[r]}class Pt extends Q{constructor(t){super(),K(this,t,Tt,qt,s,{data:0})}}function Vt(t,e,n){const r=t.slice();return r[1]=e[n],r}function Zt(e){let n,r;return n=new Nt({}),{c(){W(n.$$.fragment)},m(t,e){G(n,t,e),r=!0},p:t,i(t){r||(Z(n.$$.fragment,t),r=!0)},o(t){D(n.$$.fragment,t),r=!1},d(t){J(n,t)}}}function Dt(t){let e,n;return e=new _t({props:{$$slots:{default:[Ft]},$$scope:{ctx:t}}}),{c(){W(e.$$.fragment)},m(t,r){G(e,t,r),n=!0},p(t,n){const r={};17&n&&(r.$$scope={dirty:n,ctx:t}),e.$set(r)},i(t){n||(Z(e.$$.fragment,t),n=!0)},o(t){D(e.$$.fragment,t),n=!1},d(t){J(e,t)}}}function Xt(t){let e,n;return e=new Pt({props:{data:t[1]}}),{c(){W(e.$$.fragment)},m(t,r){G(e,t,r),n=!0},p(t,n){const r={};1&n&&(r.data=t[1]),e.$set(r)},i(t){n||(Z(e.$$.fragment,t),n=!0)},o(t){D(e.$$.fragment,t),n=!1},d(t){J(e,t)}}}function Ft(t){let e,n,r=t[0],o=[];for(let e=0;e<r.length;e+=1)o[e]=Xt(Vt(t,r,e));const l=t=>D(o[t],1,1,(()=>{o[t]=null}));return{c(){e=g("div");for(let t=0;t<o.length;t+=1)o[t].c();v(e,"class","grid grid-cols-2 xl:grid-cols-5 gap-6")},m(t,r){f(t,e,r);for(let t=0;t<o.length;t+=1)o[t].m(e,null);n=!0},p(t,n){if(1&n){let s;for(r=t[0],s=0;s<r.length;s+=1){const l=Vt(t,r,s);o[s]?(o[s].p(l,n),Z(o[s],1)):(o[s]=Xt(l),o[s].c(),Z(o[s],1),o[s].m(e,null))}for(P(),s=r.length;s<o.length;s+=1)l(s);V()}},i(t){if(!n){for(let t=0;t<r.length;t+=1)Z(o[t]);n=!0}},o(t){o=o.filter(Boolean);for(let t=0;t<o.length;t+=1)D(o[t]);n=!1},d(t){t&&d(e),p(o,t)}}}function Wt(t){let e,n,r,o;const l=[Dt,Zt],s=[];function c(t,e){return t[0]?0:1}return e=c(t),n=s[e]=l[e](t),{c(){n.c(),r=w()},m(t,n){s[e].m(t,n),f(t,r,n),o=!0},p(t,[o]){let i=e;e=c(t),e===i?s[e].p(t,o):(P(),D(s[i],1,1,(()=>{s[i]=null})),V(),n=s[e],n?n.p(t,o):(n=s[e]=l[e](t),n.c()),Z(n,1),n.m(r.parentNode,r))},i(t){o||(Z(n),o=!0)},o(t){D(n),o=!1},d(t){s[e].d(t),t&&d(r)}}}function Gt(t,e,n){let r;return L((async()=>{await fetch("/api").then((t=>t.json())).then((t=>{n(0,r=t.data)}))})),[r]}class Jt extends Q{constructor(t){super(),K(this,t,Gt,Wt,s,{})}}function Kt(t,e,n){const r=t.slice();return r[8]=e[n],r}function Qt(t,e,n){const r=t.slice();return r[11]=e[n],r[13]=n,r}function te(e){let n,r;return n=new Nt({}),{c(){W(n.$$.fragment)},m(t,e){G(n,t,e),r=!0},p:t,i(t){r||(Z(n.$$.fragment,t),r=!0)},o(t){D(n.$$.fragment,t),r=!1},d(t){J(n,t)}}}function ee(t){let e,n,r,o,l;return o=new _t({props:{px:"0",showNav:!1,$$slots:{default:[ce]},$$scope:{ctx:t}}}),{c(){e=g("div"),r=$(),W(o.$$.fragment),v(e,"class",n=`w-full h-full fixed top-0 bg-black ${t[3]?"opacity-50":"opacity-0 invisible"} z-20 transition-all duration-300 ease-in-out`)},m(t,n){f(t,e,n),f(t,r,n),G(o,t,n),l=!0},p(t,r){(!l||8&r&&n!==(n=`w-full h-full fixed top-0 bg-black ${t[3]?"opacity-50":"opacity-0 invisible"} z-20 transition-all duration-300 ease-in-out`))&&v(e,"class",n);const s={};16395&r&&(s.$$scope={dirty:r,ctx:t}),o.$set(s)},i(t){l||(Z(o.$$.fragment,t),l=!0)},o(t){D(o.$$.fragment,t),l=!1},d(t){t&&d(e),t&&d(r),J(o,t)}}}function ne(t){let e,n,r;return{c(){e=g("img"),v(e,"class","w-full"),e.src!==(n=t[11])&&v(e,"src",n),v(e,"alt",r=`${t[1].title}-image-${t[13]+1}`)},m(t,n){f(t,e,n)},p(t,o){2&o&&e.src!==(n=t[11])&&v(e,"src",n),2&o&&r!==(r=`${t[1].title}-image-${t[13]+1}`)&&v(e,"alt",r)},d(t){t&&d(e)}}}function re(t){let e,n=t[8]+"";return{c(){e=m(n)},m(t,n){f(t,e,n)},p(t,r){2&r&&n!==(n=t[8]+"")&&b(e,n)},d(t){t&&d(e)}}}function oe(t){let e,n,r,o,s,c;return n=new Ot({props:{isSelected:t[8]===t[0].chapter,chapter:t[8],slug:t[0].slug,$$slots:{default:[re]},$$scope:{ctx:t}}}),{c(){e=g("div"),W(n.$$.fragment),r=$()},m(i,a){f(i,e,a),G(n,e,null),u(e,r),o=!0,s||(c=x(e,"click",(function(){l(t[4](t[8]))&&t[4](t[8]).apply(this,arguments)})),s=!0)},p(e,r){t=e;const o={};3&r&&(o.isSelected=t[8]===t[0].chapter),2&r&&(o.chapter=t[8]),1&r&&(o.slug=t[0].slug),16386&r&&(o.$$scope={dirty:r,ctx:t}),n.$set(o)},i(t){o||(Z(n.$$.fragment,t),o=!0)},o(t){D(n.$$.fragment,t),o=!1},d(t){t&&d(e),J(n),s=!1,c()}}}function le(t){let e,n,r,o,s;return n=new vt({}),{c(){e=g("button"),W(n.$$.fragment),v(e,"class","p-1 fill-current rounded-full")},m(c,i){f(c,e,i),G(n,e,null),r=!0,o||(s=x(e,"click",(function(){l(t[4](t[1].prev))&&t[4](t[1].prev).apply(this,arguments)})),o=!0)},p(e,n){t=e},i(t){r||(Z(n.$$.fragment,t),r=!0)},o(t){D(n.$$.fragment,t),r=!1},d(t){t&&d(e),J(n),o=!1,s()}}}function se(t){let e,n,r,o,s;return n=new wt({}),{c(){e=g("button"),W(n.$$.fragment),v(e,"class","p-1 fill-current rounded-full")},m(c,i){f(c,e,i),G(n,e,null),r=!0,o||(s=x(e,"click",(function(){l(t[4](t[1].next))&&t[4](t[1].next).apply(this,arguments)})),o=!0)},p(e,n){t=e},i(t){r||(Z(n.$$.fragment,t),r=!0)},o(t){D(n.$$.fragment,t),r=!1},d(t){t&&d(e),J(n),o=!1,s()}}}function ce(t){let e,n,r,l,s,c,i,a,h,w,y,k,E,L,_,j,S,O,B,N,A,M,Y,z,C,H=t[1].title+"",U=t[0].chapter+"",I=t[1].data,R=[];for(let e=0;e<I.length;e+=1)R[e]=ne(Qt(t,I,e));let q=t[1].chapters,T=[];for(let e=0;e<q.length;e+=1)T[e]=oe(Kt(t,q,e));const X=t=>D(T[t],1,1,(()=>{T[t]=null}));L=new mt({});let F=t[1].prev&&le(t),K=t[1].next&&se(t);return{c(){e=g("h1"),n=m(H),r=$(),l=g("div");for(let t=0;t<R.length;t+=1)R[t].c();s=$(),c=g("nav"),i=g("div"),a=g("h2"),a.textContent="Pilih Chapter",h=$(),w=g("div"),y=g("div");for(let t=0;t<T.length;t+=1)T[t].c();k=$(),E=g("button"),W(L.$$.fragment),j=$(),S=g("nav"),O=g("div"),F&&F.c(),B=$(),N=g("button"),A=m(U),M=$(),K&&K.c(),v(e,"class","text-3xl text-center px-3 font-bold"),v(l,"class","m-auto w-full"),v(a,"class","text-center font-bold text-lg"),v(y,"class","grid grid-cols-5 xl:grid-cols-12 gap-3"),v(w,"class","overflow-y-auto max-h-96"),v(E,"class","p-1 fill-current w-full flex items-center justify-center"),v(i,"class","p-3 space-y-3"),v(c,"class",_=`fixed w-full xl:max-w-5xl ${t[3]?"bottom-0":"-bottom-full"} bg-gray-800 z-30 rounded-tr-xl rounded-tl-xl transition-all duration-300 ease-in-out`),v(N,"class","p-1 fill-current rounded-full"),v(O,"class","flex justify-between w-1/2 xl:w-1/6 p-3 rounded-full bg-gray-800 shadow-md"),v(S,"id","navbar"),v(S,"class","fixed left-0 flex justify-center items-center bottom-4 w-full z-10 transition-all duration-300 ease-in-out")},m(o,d){f(o,e,d),u(e,n),f(o,r,d),f(o,l,d);for(let t=0;t<R.length;t+=1)R[t].m(l,null);f(o,s,d),f(o,c,d),u(c,i),u(i,a),u(i,h),u(i,w),u(w,y);for(let t=0;t<T.length;t+=1)T[t].m(y,null);u(i,k),u(i,E),G(L,E,null),f(o,j,d),f(o,S,d),u(S,O),F&&F.m(O,null),u(O,B),u(O,N),u(N,A),u(O,M),K&&K.m(O,null),Y=!0,z||(C=[x(E,"click",t[5]),x(N,"click",t[6])],z=!0)},p(t,e){if((!Y||2&e)&&H!==(H=t[1].title+"")&&b(n,H),2&e){let n;for(I=t[1].data,n=0;n<I.length;n+=1){const r=Qt(t,I,n);R[n]?R[n].p(r,e):(R[n]=ne(r),R[n].c(),R[n].m(l,null))}for(;n<R.length;n+=1)R[n].d(1);R.length=I.length}if(19&e){let n;for(q=t[1].chapters,n=0;n<q.length;n+=1){const r=Kt(t,q,n);T[n]?(T[n].p(r,e),Z(T[n],1)):(T[n]=oe(r),T[n].c(),Z(T[n],1),T[n].m(y,null))}for(P(),n=q.length;n<T.length;n+=1)X(n);V()}(!Y||8&e&&_!==(_=`fixed w-full xl:max-w-5xl ${t[3]?"bottom-0":"-bottom-full"} bg-gray-800 z-30 rounded-tr-xl rounded-tl-xl transition-all duration-300 ease-in-out`))&&v(c,"class",_),t[1].prev?F?(F.p(t,e),2&e&&Z(F,1)):(F=le(t),F.c(),Z(F,1),F.m(O,B)):F&&(P(),D(F,1,1,(()=>{F=null})),V()),(!Y||1&e)&&U!==(U=t[0].chapter+"")&&b(A,U),t[1].next?K?(K.p(t,e),2&e&&Z(K,1)):(K=se(t),K.c(),Z(K,1),K.m(O,null)):K&&(P(),D(K,1,1,(()=>{K=null})),V())},i(t){if(!Y){for(let t=0;t<q.length;t+=1)Z(T[t]);Z(L.$$.fragment,t),Z(F),Z(K),Y=!0}},o(t){T=T.filter(Boolean);for(let t=0;t<T.length;t+=1)D(T[t]);D(L.$$.fragment,t),D(F),D(K),Y=!1},d(t){t&&d(e),t&&d(r),t&&d(l),p(R,t),t&&d(s),t&&d(c),p(T,t),J(L),t&&d(j),t&&d(S),F&&F.d(),K&&K.d(),z=!1,o(C)}}}function ie(t){let e,n,r,o;const l=[ee,te],s=[];function c(t,e){return t[2]?1:0}return e=c(t),n=s[e]=l[e](t),{c(){n.c(),r=w()},m(t,n){s[e].m(t,n),f(t,r,n),o=!0},p(t,[o]){let i=e;e=c(t),e===i?s[e].p(t,o):(P(),D(s[i],1,1,(()=>{s[i]=null})),V(),n=s[e],n?n.p(t,o):(n=s[e]=l[e](t),n.c()),Z(n,1),n.m(r.parentNode,r))},i(t){o||(Z(n),o=!0)},o(t){D(n),o=!1},d(t){s[e].d(t),t&&d(r)}}}function ae(t,e,n){let r,{params:o}=e,l=!0,s=!1;async function c(t,e=!0){n(2,l=!0),e&&async function(t){if(!t||t.length<1||"/"!=t.charAt(0)&&0!==t.indexOf("#/"))throw Error("Invalid parameter location");await z();const e=("#"==t.charAt(0)?"":"#")+t;try{window.history.replaceState(void 0,void 0,e)}catch(t){console.warn("Caught exception while replacing the current page. If you're running this in the Svelte REPL, please note that the `replace` method might not work in this environment.")}window.dispatchEvent(new Event("hashchange"))}(`/manga/${o.slug}/${t}`),await fetch(`/api/manga/${o.slug}/${t}`).then((t=>t.json())).then((t=>{n(1,r=t),n(2,l=!1)}))}L((async()=>{c(o.chapter)}));var i=window.pageYOffset;window.onscroll=function(){var t=window.pageYOffset,e=document.getElementById("navbar");e&&(i>t?(e.classList.add("bottom-4"),e.classList.remove("-bottom-20")):(e.classList.add("-bottom-20"),e.classList.remove("bottom-4")),i=t)};return t.$$set=t=>{"params"in t&&n(0,o=t.params)},[o,r,l,s,c,()=>n(3,s=!s),()=>n(3,s=!s)]}class ue extends Q{constructor(t){super(),K(this,t,ae,ie,s,{params:0})}}function fe(e){let n,r,o;return r=new ut({props:{routes:{"/":Jt,"/manga/:slug":Rt,"/manga/:slug/:chapter":ue}}}),{c(){n=g("main"),W(r.$$.fragment)},m(t,e){f(t,n,e),G(r,n,null),o=!0},p:t,i(t){o||(Z(r.$$.fragment,t),o=!0)},o(t){D(r.$$.fragment,t),o=!1},d(t){t&&d(n),J(r)}}}return new class extends Q{constructor(t){super(),K(this,t,null,fe,s,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
