(window.webpackJsonp=window.webpackJsonp||[]).push([[23],{1008:function(e,t,n){"use strict";n.r(t);var o=n(6),a=n(39),r=n(40),i=n(42),c=n(41),l=n(43),u=n(0),s=n.n(u),p=n(264),f=n(60),d=n(1016),y=n(96),b=n(801),g=n(796),m=n(811),h=n.n(m),v=n(371),C=n(805),k=function(e){function t(){return Object(a.a)(this,t),Object(i.a)(this,Object(c.a)(t).apply(this,arguments))}return Object(l.a)(t,e),Object(r.a)(t,[{key:"render",value:function(){var e=this.props,t=e.zzyData,n=(e.domain_name,e.linkModal),a=e.linkInfo,r=e.currentPage,i=e.total,c=this.props,l=c.deleteLink,u=c.changeInputValue,p=c.openUpdateModal,m=c.cancelAction,v=c.submitLink,k=c.addLink,O=[{key:"gonghao_name",dataIndex:"gonghao_name",title:"\u516c\u53f7\u540d\u79f0",align:"center"},{key:"tuiguang_link",dataIndex:"tuiguang_link",title:"\u63a8\u5e7f\u94fe\u63a5",align:"center",render:function(e){return e+"?zzy=1"}},{key:"_id",title:"\u590d\u5236\u94fe\u63a5",align:"center",render:function(e,t){return s.a.createElement(h.a,{text:t.tuiguang_link+"?zzy=1",onCopy:function(){return f.a.success("\u590d\u5236\u6210\u529f")}},s.a.createElement(C.a,{background:"success",buttonContent:"\u590d\u5236\u94fe\u63a5"}))}},{title:"Action",align:"center",render:function(e,t,n){return s.a.createElement("div",null,s.a.createElement(C.a,{buttonContent:"\u4fee\u6539",onClick:function(){return p(Object(o.a)({},t),n)}}),s.a.createElement(C.a,{background:"danger",buttonContent:"\u5220\u9664",onClick:function(){return l(t._id,n)}}))}}],w={current:r,total:i,onChange:c.changePage};return s.a.createElement("div",null,s.a.createElement("div",{className:"container"},s.a.createElement(C.a,{size:"default",background:"success",mb:20,buttonContent:"\u6dfb\u52a0\u65b0\u94fe\u63a5",onClick:k}),s.a.createElement(d.a,{rowKey:function(e){return e._id},size:"small",bordered:!0,columns:O,dataSource:t,pagination:w}),s.a.createElement(y.a,{visible:n,title:"\u7f16\u8f91\u94fe\u63a5\u4fe1\u606f",onOk:v,onCancel:m},s.a.createElement(b.a,null,s.a.createElement(b.a.Item,{label:"\u516c\u53f7\u540d\u79f0"},s.a.createElement(g.a,{value:a.gonghao_name||"",onChange:function(e){return u(e.target.value,"gonghao_name")}})),s.a.createElement(b.a.Item,{label:"\u63a8\u5e7f\u94fe\u63a5"},s.a.createElement(g.a,{value:a.tuiguang_link||"",onChange:function(e){return u(e.target.value,"tuiguang_link")}}))))))}},{key:"componentDidMount",value:function(){this.props.getLinks()}},{key:"componentWillUnmount",value:function(){this.props.resetState()}}]),t}(u.Component);t.default=Object(p.b)(function(e){return{zzyData:e.channel.zzy.zzyData,domain_name:e.channel.zzy.domain_name,linkModal:e.channel.zzy.linkModal,linkInfo:e.channel.zzy.linkInfo,currentPage:e.channel.zzy.currentPage,total:e.channel.zzy.total}},function(e){return{getLinks:function(){e(v.a.getLinks())},changePage:function(t){e(v.a.changePage(t))},addLink:function(){e(v.a.addLink())},openUpdateModal:function(t,n){e(v.a.openUpdateModal(t,n))},deleteLink:function(t,n){e(v.a.deleteLink(t,n))},changeInputValue:function(t,n){e(v.a.changeInputValue(t,n))},submitLink:function(){e(v.a.submitLink())},cancelAction:function(){e(v.a.cancelAction())},resetState:function(){e(v.a.resetState())}}})(k)},805:function(e,t,n){"use strict";var o=n(39),a=n(40),r=n(42),i=n(41),c=n(43),l=n(0),u=n.n(l),s=n(106),p={warning:"#F39C12",danger:"#E74C3C",success:"#2ECC71",info:"#7F8C8D",update:"#3498DB"},f=function(e){function t(){var e,n;Object(o.a)(this,t);for(var a=arguments.length,c=new Array(a),l=0;l<a;l++)c[l]=arguments[l];return(n=Object(r.a)(this,(e=Object(i.a)(t)).call.apply(e,[this].concat(c)))).state={buttonStyle:{background:"#3498DB",color:"#fff",marginRight:5,marginLeft:0,marginBottom:0}},n}return Object(c.a)(t,e),Object(a.a)(t,[{key:"componentDidMount",value:function(){var e=this.props,t=e.background,n=void 0===t?"update":t,o=e.color,a=void 0===o?"#fff":o,r=e.mr,i=void 0===r?5:r,c=e.ml,l=void 0===c?0:c,u=e.mb,s=void 0===u?0:u;this.setState({buttonStyle:{background:p[n],color:a,marginRight:i,marginLeft:l,marginBottom:s}})}},{key:"render",value:function(){var e=this.props,t=e.size,n=void 0===t?"small":t,o=e.buttonContent,a=e.disabled,r=void 0!==a&&a,i=e.onClick,c=this.state.buttonStyle;return u.a.createElement(s.a,{size:n,disabled:r,style:c,onClick:i},o)}}]),t}(l.Component);t.a=f},811:function(e,t,n){"use strict";var o=n(812).CopyToClipboard;o.CopyToClipboard=o,e.exports=o},812:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.CopyToClipboard=void 0;var o=r(n(0)),a=r(n(813));function r(e){return e&&e.__esModule?e:{default:e}}function i(e){return(i="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,o)}return n}function l(e,t){if(null==e)return{};var n,o,a=function(e,t){if(null==e)return{};var n,o,a={},r=Object.keys(e);for(o=0;o<r.length;o++)n=r[o],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(o=0;o<r.length;o++)n=r[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}function u(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function s(e){return(s=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function p(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function f(e,t){return(f=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function d(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var y=function(e){function t(){var e,n,r,c;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var l=arguments.length,u=new Array(l),f=0;f<l;f++)u[f]=arguments[f];return r=this,c=(e=s(t)).call.apply(e,[this].concat(u)),n=!c||"object"!==i(c)&&"function"!==typeof c?p(r):c,d(p(n),"onClick",function(e){var t=n.props,r=t.text,i=t.onCopy,c=t.children,l=t.options,u=o.default.Children.only(c),s=(0,a.default)(r,l);i&&i(r,s),u&&u.props&&"function"===typeof u.props.onClick&&u.props.onClick(e)}),n}var n,r,y;return function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&f(e,t)}(t,o["default"].PureComponent),n=t,(r=[{key:"render",value:function(){var e=this.props,t=(e.text,e.onCopy,e.options,e.children),n=l(e,["text","onCopy","options","children"]),a=o.default.Children.only(t);return o.default.cloneElement(a,function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?c(n,!0).forEach(function(t){d(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):c(n).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}({},n,{onClick:this.onClick}))}}])&&u(n.prototype,r),y&&u(n,y),t}();t.CopyToClipboard=y,d(y,"defaultProps",{onCopy:void 0,options:void 0})},813:function(e,t,n){"use strict";var o=n(814),a={"text/plain":"Text","text/html":"Url",default:"Text"},r="Copy to clipboard: #{key}, Enter";e.exports=function(e,t){var n,i,c,l,u,s,p=!1;t||(t={}),n=t.debug||!1;try{if(c=o(),l=document.createRange(),u=document.getSelection(),(s=document.createElement("span")).textContent=e,s.style.all="unset",s.style.position="fixed",s.style.top=0,s.style.clip="rect(0, 0, 0, 0)",s.style.whiteSpace="pre",s.style.webkitUserSelect="text",s.style.MozUserSelect="text",s.style.msUserSelect="text",s.style.userSelect="text",s.addEventListener("copy",function(o){if(o.stopPropagation(),t.format)if(o.preventDefault(),"undefined"===typeof o.clipboardData){n&&console.warn("unable to use e.clipboardData"),n&&console.warn("trying IE specific stuff"),window.clipboardData.clearData();var r=a[t.format]||a.default;window.clipboardData.setData(r,e)}else o.clipboardData.clearData(),o.clipboardData.setData(t.format,e);t.onCopy&&(o.preventDefault(),t.onCopy(o.clipboardData))}),document.body.appendChild(s),l.selectNodeContents(s),u.addRange(l),!document.execCommand("copy"))throw new Error("copy command was unsuccessful");p=!0}catch(f){n&&console.error("unable to copy using execCommand: ",f),n&&console.warn("trying IE specific stuff");try{window.clipboardData.setData(t.format||"text",e),t.onCopy&&t.onCopy(window.clipboardData),p=!0}catch(f){n&&console.error("unable to copy using clipboardData: ",f),n&&console.error("falling back to prompt"),i=function(e){var t=(/mac os x/i.test(navigator.userAgent)?"\u2318":"Ctrl")+"+C";return e.replace(/#{\s*key\s*}/g,t)}("message"in t?t.message:r),window.prompt(i,e)}}finally{u&&("function"==typeof u.removeRange?u.removeRange(l):u.removeAllRanges()),s&&document.body.removeChild(s),c()}return p}},814:function(e,t){e.exports=function(){var e=document.getSelection();if(!e.rangeCount)return function(){};for(var t=document.activeElement,n=[],o=0;o<e.rangeCount;o++)n.push(e.getRangeAt(o));switch(t.tagName.toUpperCase()){case"INPUT":case"TEXTAREA":t.blur();break;default:t=null}return e.removeAllRanges(),function(){"Caret"===e.type&&e.removeAllRanges(),e.rangeCount||n.forEach(function(t){e.addRange(t)}),t&&t.focus()}}}}]);