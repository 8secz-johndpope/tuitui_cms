(window.webpackJsonp=window.webpackJsonp||[]).push([[35],{1016:function(t,e,a){"use strict";a.r(e);var n=a(6),o=a(46),r=a(47),l=a(50),i=a(48),c=a(49),u=a(0),m=a.n(u),f=a(266),s=a(878),d=a(1024),g=a(96),p=a(810),b=a(805),h=a(815),v=a(375),P=s.a.Option,k=function(t){function e(){return Object(o.a)(this,e),Object(l.a)(this,Object(i.a)(e).apply(this,arguments))}return Object(c.a)(e,t),Object(r.a)(e,[{key:"addPlatform",value:function(){this.setState({modalVisible:!0})}},{key:"changePlatformInfoInput",value:function(t,e){var a=this.state.platformInfo;a[e]=t,this.setState({platformInfo:a})}},{key:"editPlatform",value:function(t){this.setState({platformInfo:t,modalVisible:!0})}},{key:"componentDidMount",value:function(){this.props.getPlatformList()}},{key:"render",value:function(){var t=this.props,e=t.platformList,a=t.modalVisible,o=t.platformInfo,r=t.title,l=t.currentPage,i=t.total,c=this.props,u=c.deletePlatform,f=c.addPlatform,v=c.editPlatform,k=c.changePlatformInfoInput,C=c.submitPlatform,E=c.cancelAction,I=[{dataIndex:"platform",key:"platform",title:"\u5e73\u53f0\u540d\u79f0",align:"center",render:function(t){return 1===t?"\u9605\u6587":2===t?"\u817e\u6587":3===t?"\u6709\u4e66\u9601":"\u65e0"}},{dataIndex:"gonghao_name",key:"gonghao_name",title:"\u516c\u53f7\u540d\u79f0",align:"center"},{dataIndex:"seruid",key:"seruid",title:"\u516c\u53f7id",align:"center"},{title:"\u64cd\u4f5c",key:"action",align:"center",render:function(t,e,a){return m.a.createElement("div",null,m.a.createElement(h.a,{onClick:function(){return v(Object(n.a)({},e))},buttonContent:"\u7f16\u8f91"}),m.a.createElement(h.a,{onClick:function(){return u(e._id)},background:"danger",buttonContent:"\u5220\u9664"}))}}],y={current:l,total:i,onChange:c.changePage};return m.a.createElement("div",null,m.a.createElement("div",{className:"container"},m.a.createElement(h.a,{mb:20,size:"default",onClick:f,background:"success",buttonContent:"\u6dfb\u52a0"}),m.a.createElement(d.a,{rowKey:function(t){return t._id},columns:I,dataSource:e,size:"small",pagination:y})),m.a.createElement(g.a,{title:r,visible:a,onOk:C,onCancel:E},m.a.createElement(p.a,{labelCol:{span:6},wrapperCol:{span:14}},m.a.createElement(p.a.Item,{label:"\u5e73\u53f0\u540d\u79f0"},m.a.createElement(s.a,{value:o.platform,onChange:function(t){return k(t,"platform")}},m.a.createElement(P,{value:1},"\u9605\u6587"),m.a.createElement(P,{value:2},"\u817e\u6587"),m.a.createElement(P,{value:3},"\u6709\u4e66\u9601"))),m.a.createElement(p.a.Item,{label:"\u516c\u53f7\u540d\u79f0"},m.a.createElement(b.a,{value:o.gonghao_name,onChange:function(t){return k(t.target.value,"gonghao_name")}})),m.a.createElement(p.a.Item,{label:"\u516c\u53f7id"},m.a.createElement(b.a,{value:o.seruid,onChange:function(t){return k(t.target.value,"seruid")}})))))}}]),e}(u.Component);e.default=Object(f.b)(function(t){return{platformList:t.channel.management.platformList,modalVisible:t.channel.management.modalVisible,platformInfo:t.channel.management.platformInfo,title:t.channel.management.title,currentPage:t.channel.management.currentPage,total:t.channel.management.total}},function(t){return{getPlatformList:function(){t(v.a.getPlatformList())},changePage:function(e){t(v.a.changePage(e))},addPlatform:function(){t(v.a.addPlatform())},editPlatform:function(e,a){t(v.a.editPlatform(e,a))},deletePlatform:function(e,a){t(v.a.deletePlatform(e,a))},changePlatformInfoInput:function(e,a){t(v.a.changePlatformInfoInput(e,a))},submitPlatform:function(){t(v.a.submitPlatform())},cancelAction:function(){t(v.a.cancelAction())},resetState:function(){t(v.a.resetState())}}})(k)},815:function(t,e,a){"use strict";var n=a(46),o=a(47),r=a(50),l=a(48),i=a(49),c=a(0),u=a.n(c),m=a(106),f={warning:"#F39C12",danger:"#E74C3C",success:"#2ECC71",info:"#7F8C8D",update:"#3498DB"},s=function(t){function e(){var t,a;Object(n.a)(this,e);for(var o=arguments.length,i=new Array(o),c=0;c<o;c++)i[c]=arguments[c];return(a=Object(r.a)(this,(t=Object(l.a)(e)).call.apply(t,[this].concat(i)))).state={buttonStyle:{background:"#3498DB",color:"#fff",marginRight:5,marginLeft:0,marginBottom:0}},a}return Object(i.a)(e,t),Object(o.a)(e,[{key:"componentDidMount",value:function(){var t=this.props,e=t.background,a=void 0===e?"update":e,n=t.color,o=void 0===n?"#fff":n,r=t.mr,l=void 0===r?5:r,i=t.ml,c=void 0===i?0:i,u=t.mb,m=void 0===u?0:u;this.setState({buttonStyle:{background:f[a],color:o,marginRight:l,marginLeft:c,marginBottom:m}})}},{key:"render",value:function(){var t=this.props,e=t.size,a=void 0===e?"small":e,n=t.buttonContent,o=t.disabled,r=void 0!==o&&o,l=t.onClick,i=this.state.buttonStyle;return u.a.createElement(m.a,{size:a,disabled:r,style:i,onClick:l},n)}}]),e}(c.Component);e.a=s}}]);