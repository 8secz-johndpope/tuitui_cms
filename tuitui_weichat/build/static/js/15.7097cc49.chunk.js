(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{1010:function(e,t,n){"use strict";n.r(t);var o=n(9),r=n(44),a=n(45),c=n(48),i=n(46),l=n(47),u=n(0),s=n.n(u),f=n(827),p=n(64),d=n(1020),b=n(266),y=n(373),h=n(88),m=n(817),g=n.n(m),v=n(74),C=n(811),k=(n(987),function(e){function t(){return Object(r.a)(this,t),Object(c.a)(this,Object(i.a)(t).apply(this,arguments))}return Object(l.a)(t,e),Object(a.a)(t,[{key:"componentDidMount",value:function(){this.props.getNovelLinkList()}},{key:"render",value:function(){var e=this,t=this.props,n=t.novelLinkList,r=t.count,a=t.changePage,c=t.deleteNovel,i=t.changeZIndexState,l=t.copyNovel,u=[{key:"id",dataIndex:"id",title:"id",align:"center",ellipsis:!0},{key:"type",dataIndex:"type",title:"\u7c7b\u578b",align:"center",width:85,render:function(e){return e?"\u5e73\u53f0\u6570\u636e":"\u5934\u6761\u6295\u653e"}},{key:"name",dataIndex:"name",title:"\u516c\u53f7",align:"center",width:85},{key:"domain_name",dataIndex:"domain_name",title:"\u57df\u540d",align:"center",ellipsis:!0},{key:"remarks",dataIndex:"remarks",title:"\u5907\u6ce8",align:"center",ellipsis:!0},{key:"zIndex",dataIndex:"zIndex",title:"\u7f6e\u9876\u72b6\u6001",align:"center",width:85,render:function(e,t){return s.a.createElement(f.a,{checked:!!e,checkedChildren:"\u5df2\u7f6e\u9876",unCheckedChildren:"\u9ed8\u8ba4",onChange:function(e){return i(e,t._id)}})}},{title:"\u590d\u5236\u94fe\u63a5",align:"center",width:85,render:function(e,t){return s.a.createElement(g.a,{text:t.domain_name+"/tuiguang/"+(0===t.type?"toutiao/":"data/")+t.id,onCopy:function(){return p.a.success("\u590d\u5236\u6210\u529f")}},s.a.createElement(C.a,{background:"success",buttonContent:"\u590d\u5236\u94fe\u63a5"}))}},{title:"Action",align:"center",render:function(t,n,o){return s.a.createElement("div",null,s.a.createElement(C.a,{background:"update",buttonContent:s.a.createElement(v.b,{to:{pathname:"./update",query:n}},"\u4fee\u6539")}),s.a.createElement(C.a,{background:"danger",buttonContent:"\u5220\u9664",onClick:function(){return c(n.id,o)}}),s.a.createElement(C.a,{background:"success",mr:0,buttonContent:"\u590d\u5236\u4e00\u6761",onClick:function(){return l(n,e.props)}}))}}],b={pageSize:20,total:r,onChange:function(e){return a(e)}};return s.a.createElement("div",null,s.a.createElement("div",{className:"container"},s.a.createElement(C.a,{background:"success",mb:10,size:"default",buttonContent:s.a.createElement(v.b,{to:"./create"},"\u65b0\u5efa\u5c0f\u8bf4\u94fe\u63a5")}),s.a.createElement(d.a,{tableLayout:"auto",bordered:!0,size:"small",rowKey:function(e){return e._id},columns:u,rowClassName:function(e){return 0!==e.zIndex?"selectedRow":""},dataSource:n,pagination:Object(o.a)({},b)})))}}]),t}(u.Component));t.default=Object(h.g)(Object(b.b)(function(e){return{novelLinkList:e.channel.links.novelLinkList,count:e.channel.links.count}},function(e){return{getNovelLinkList:function(){e(y.a.getNovelLinkList())},changePage:function(t){e(y.a.changePage(t))},deleteNovel:function(t,n){e(y.a.deleteNovel(t,n))},changeZIndexState:function(t,n){e(y.a.changeZIndexState(t,n))},copyNovel:function(t,n){e(y.a.submitNovel(t,n))}}})(k))},811:function(e,t,n){"use strict";var o=n(44),r=n(45),a=n(48),c=n(46),i=n(47),l=n(0),u=n.n(l),s=n(105),f={warning:"#F39C12",danger:"#E74C3C",success:"#2ECC71",info:"#7F8C8D",update:"#3498DB"},p=function(e){function t(){var e,n;Object(o.a)(this,t);for(var r=arguments.length,i=new Array(r),l=0;l<r;l++)i[l]=arguments[l];return(n=Object(a.a)(this,(e=Object(c.a)(t)).call.apply(e,[this].concat(i)))).state={buttonStyle:{background:"#3498DB",color:"#fff",marginRight:5,marginLeft:0,marginBottom:0}},n}return Object(i.a)(t,e),Object(r.a)(t,[{key:"componentDidMount",value:function(){var e=this.props,t=e.background,n=void 0===t?"update":t,o=e.color,r=void 0===o?"#fff":o,a=e.mr,c=void 0===a?5:a,i=e.ml,l=void 0===i?0:i,u=e.mb,s=void 0===u?0:u;this.setState({buttonStyle:{background:f[n],color:r,marginRight:c,marginLeft:l,marginBottom:s}})}},{key:"render",value:function(){var e=this.props,t=e.size,n=void 0===t?"small":t,o=e.buttonContent,r=e.disabled,a=void 0!==r&&r,c=e.onClick,i=this.state.buttonStyle;return u.a.createElement(s.a,{size:n,disabled:a,style:i,onClick:c},o)}}]),t}(l.Component);t.a=p},813:function(e,t,n){e.exports=n(814)},814:function(e,t,n){"use strict";n.r(t);var o=n(0),r=n.n(o),a=n(1),c=n.n(a),i=n(33);function l(){return(l=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e}).apply(this,arguments)}function u(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},a=Object.keys(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}function s(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function f(e){return(f=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function p(e,t){return(p=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function d(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function b(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var y=n(3),h=function(e){function t(e){var n,o,r;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),o=this,r=f(t).call(this,e),n=!r||"object"!==typeof r&&"function"!==typeof r?d(o):r,b(d(d(n)),"handleClick",function(e){var t=n.state.checked,o=n.props.onClick,r=!t;n.setChecked(r,e),o&&o(r,e)}),b(d(d(n)),"handleKeyDown",function(e){37===e.keyCode?n.setChecked(!1,e):39===e.keyCode&&n.setChecked(!0,e)}),b(d(d(n)),"handleMouseUp",function(e){var t=n.props.onMouseUp;n.node&&n.node.blur(),t&&t(e)}),b(d(d(n)),"saveNode",function(e){n.node=e});var a=!1;return a="checked"in e?!!e.checked:!!e.defaultChecked,n.state={checked:a},n}var n,a,c;return function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&p(e,t)}(t,o["Component"]),n=t,c=[{key:"getDerivedStateFromProps",value:function(e){var t={},n=e.checked;return"checked"in e&&(t.checked=!!n),t}}],(a=[{key:"componentDidMount",value:function(){var e=this.props,t=e.autoFocus,n=e.disabled;t&&!n&&this.focus()}},{key:"setChecked",value:function(e,t){var n=this.props,o=n.disabled,r=n.onChange;o||("checked"in this.props||this.setState({checked:e}),r&&r(e,t))}},{key:"focus",value:function(){this.node.focus()}},{key:"blur",value:function(){this.node.blur()}},{key:"render",value:function(){var e,t=this.props,n=t.className,o=t.prefixCls,a=t.disabled,c=t.loadingIcon,i=t.checkedChildren,s=t.unCheckedChildren,f=u(t,["className","prefixCls","disabled","loadingIcon","checkedChildren","unCheckedChildren"]),p=this.state.checked,d=y((b(e={},n,!!n),b(e,o,!0),b(e,"".concat(o,"-checked"),p),b(e,"".concat(o,"-disabled"),a),e));return r.a.createElement("button",l({},f,{type:"button",role:"switch","aria-checked":p,disabled:a,className:d,ref:this.saveNode,onKeyDown:this.handleKeyDown,onClick:this.handleClick,onMouseUp:this.handleMouseUp}),c,r.a.createElement("span",{className:"".concat(o,"-inner")},p?i:s))}}])&&s(n.prototype,a),c&&s(n,c),t}();h.propTypes={className:c.a.string,prefixCls:c.a.string,disabled:c.a.bool,checkedChildren:c.a.any,unCheckedChildren:c.a.any,onChange:c.a.func,onMouseUp:c.a.func,onClick:c.a.func,tabIndex:c.a.number,checked:c.a.bool,defaultChecked:c.a.bool,autoFocus:c.a.bool,loadingIcon:c.a.node},h.defaultProps={prefixCls:"rc-switch",checkedChildren:null,unCheckedChildren:null,className:"",defaultChecked:!1},Object(i.polyfill)(h),t.default=h},817:function(e,t,n){"use strict";var o=n(818).CopyToClipboard;o.CopyToClipboard=o,e.exports=o},818:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.CopyToClipboard=void 0;var o=a(n(0)),r=a(n(819));function a(e){return e&&e.__esModule?e:{default:e}}function c(e){return(c="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,o)}return n}function l(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},a=Object.keys(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}function u(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function s(e){return(s=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function f(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function p(e,t){return(p=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function d(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var b=function(e){function t(){var e,n,a,i;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var l=arguments.length,u=new Array(l),p=0;p<l;p++)u[p]=arguments[p];return a=this,i=(e=s(t)).call.apply(e,[this].concat(u)),n=!i||"object"!==c(i)&&"function"!==typeof i?f(a):i,d(f(n),"onClick",function(e){var t=n.props,a=t.text,c=t.onCopy,i=t.children,l=t.options,u=o.default.Children.only(i),s=(0,r.default)(a,l);c&&c(a,s),u&&u.props&&"function"===typeof u.props.onClick&&u.props.onClick(e)}),n}var n,a,b;return function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&p(e,t)}(t,o["default"].PureComponent),n=t,(a=[{key:"render",value:function(){var e=this.props,t=(e.text,e.onCopy,e.options,e.children),n=l(e,["text","onCopy","options","children"]),r=o.default.Children.only(t);return o.default.cloneElement(r,function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(n,!0).forEach(function(t){d(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(n).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}({},n,{onClick:this.onClick}))}}])&&u(n.prototype,a),b&&u(n,b),t}();t.CopyToClipboard=b,d(b,"defaultProps",{onCopy:void 0,options:void 0})},819:function(e,t,n){"use strict";var o=n(820),r={"text/plain":"Text","text/html":"Url",default:"Text"},a="Copy to clipboard: #{key}, Enter";e.exports=function(e,t){var n,c,i,l,u,s,f=!1;t||(t={}),n=t.debug||!1;try{if(i=o(),l=document.createRange(),u=document.getSelection(),(s=document.createElement("span")).textContent=e,s.style.all="unset",s.style.position="fixed",s.style.top=0,s.style.clip="rect(0, 0, 0, 0)",s.style.whiteSpace="pre",s.style.webkitUserSelect="text",s.style.MozUserSelect="text",s.style.msUserSelect="text",s.style.userSelect="text",s.addEventListener("copy",function(o){if(o.stopPropagation(),t.format)if(o.preventDefault(),"undefined"===typeof o.clipboardData){n&&console.warn("unable to use e.clipboardData"),n&&console.warn("trying IE specific stuff"),window.clipboardData.clearData();var a=r[t.format]||r.default;window.clipboardData.setData(a,e)}else o.clipboardData.clearData(),o.clipboardData.setData(t.format,e)}),document.body.appendChild(s),l.selectNodeContents(s),u.addRange(l),!document.execCommand("copy"))throw new Error("copy command was unsuccessful");f=!0}catch(p){n&&console.error("unable to copy using execCommand: ",p),n&&console.error("unable to copy using clipboardData: ",p),n&&console.error("falling back to prompt"),c=function(e){var t=(/mac os x/i.test(navigator.userAgent)?"\u2318":"Ctrl")+"+C";return e.replace(/#{\s*key\s*}/g,t)}("message"in t?t.message:a),window.prompt(c,e)}finally{u&&("function"==typeof u.removeRange?u.removeRange(l):u.removeAllRanges()),s&&document.body.removeChild(s),i()}return f}},820:function(e,t){e.exports=function(){var e=document.getSelection();if(!e.rangeCount)return function(){};for(var t=document.activeElement,n=[],o=0;o<e.rangeCount;o++)n.push(e.getRangeAt(o));switch(t.tagName.toUpperCase()){case"INPUT":case"TEXTAREA":t.blur();break;default:t=null}return e.removeAllRanges(),function(){"Caret"===e.type&&e.removeAllRanges(),e.rangeCount||n.forEach(function(t){e.addRange(t)}),t&&t.focus()}}},827:function(e,t,n){"use strict";n.d(t,"a",function(){return k});var o=n(0),r=n(1),a=n(813),c=n.n(a),i=n(3),l=n.n(i),u=n(29),s=n(267),f=n(17),p=n(129),d=n(21);function b(e){return(b="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function y(){return(y=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e}).apply(this,arguments)}function h(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function m(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function g(e,t){return!t||"object"!==b(t)&&"function"!==typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function v(e){return(v=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function C(e,t){return(C=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var k=function(e){function t(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(n=g(this,v(t).call(this,e))).saveSwitch=function(e){n.rcSwitch=e},n.renderSwitch=function(e){var t,r=e.getPrefixCls,a=n.props,i=a.prefixCls,p=a.size,d=a.loading,b=a.className,m=void 0===b?"":b,g=a.disabled,v=r("switch",i),C=l()(m,(h(t={},"".concat(v,"-small"),"small"===p),h(t,"".concat(v,"-loading"),d),t)),k=d?o.createElement(f.a,{type:"loading",className:"".concat(v,"-loading-icon")}):null;return o.createElement(s.a,{insertExtraNode:!0},o.createElement(c.a,y({},Object(u.a)(n.props,["loading"]),{prefixCls:v,className:C,disabled:g||d,ref:n.saveSwitch,loadingIcon:k})))},Object(d.a)("checked"in e||!("value"in e),"Switch","`value` is not validate prop, do you mean `checked`?"),n}var n,r,a;return function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&C(e,t)}(t,o["Component"]),n=t,(r=[{key:"focus",value:function(){this.rcSwitch.focus()}},{key:"blur",value:function(){this.rcSwitch.blur()}},{key:"render",value:function(){return o.createElement(p.a,null,this.renderSwitch)}}])&&m(n.prototype,r),a&&m(n,a),t}();k.__ANT_SWITCH=!0,k.propTypes={prefixCls:r.string,size:r.oneOf(["small","default","large"]),className:r.string}},987:function(e,t,n){}}]);