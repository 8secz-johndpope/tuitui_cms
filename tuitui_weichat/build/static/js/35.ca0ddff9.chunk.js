(window.webpackJsonp=window.webpackJsonp||[]).push([[35],{1013:function(t,e,a){"use strict";a.r(e);var n=a(10),o=a(43),r=a(44),l=a(46),i=a(45),c=a(266),m=a(47),u=a(0),f=a.n(u),s=a(873),d=a(94),p=a(62),b=a(1021),g=a(804),h=a(799),v=a(809),k=a(107),P=a.n(k),y=s.a.Option,I=function(t){function e(t){var a;return Object(o.a)(this,e),(a=Object(l.a)(this,Object(i.a)(e).call(this,t))).state={platformList:[],emptyText:"",modalVisible:!1,platformInfo:{platform:1,gonghao_name:"",seruid:""},title:"\u6dfb\u52a0\u5e73\u53f0"},a.addPlatform=a.addPlatform.bind(Object(c.a)(a)),a.changePlatformInfoInput=a.changePlatformInfoInput.bind(Object(c.a)(a)),a.submitPlatform=a.submitPlatform.bind(Object(c.a)(a)),a.cancelAction=a.cancelAction.bind(Object(c.a)(a)),a.editPlatform=a.editPlatform.bind(Object(c.a)(a)),a.deletePlatform=a.deletePlatform.bind(Object(c.a)(a)),a}return Object(m.a)(e,t),Object(r.a)(e,[{key:"getPlatformList",value:function(){var t=this;P.a.get("/platform").then(function(e){var a=e.data,n=a.code,o=a.msg,r=a.data;1===n?t.setState({platformList:r}):t.setState({emptyText:o,platformList:[]})})}},{key:"addPlatform",value:function(){this.setState({modalVisible:!0})}},{key:"changePlatformInfoInput",value:function(t,e){var a=this.state.platformInfo;a[e]=t,this.setState({platformInfo:a})}},{key:"submitPlatform",value:function(){var t=this.state.platformInfo;t._id?this.updatePlatform(t):this.createPlatform(t)}},{key:"createPlatform",value:function(t){var e=this;d.a.confirm({title:"\u60a8\u786e\u8ba4\u521b\u5efa\u4e00\u6761\u65b0\u7684\u5185\u5bb9\u5417\uff1f",onOk:function(){P.a.post("/platform",Object(n.a)({},t)).then(function(t){var a=t.data,n=a.code,o=a.msg;1===n?(p.a.success(o),e.getPlatformList(),e.cancelAction()):p.a.error(o)})}})}},{key:"updatePlatform",value:function(t){var e=this;d.a.confirm({title:"\u60a8\u786e\u8ba4\u4fdd\u5b58\u8fd9\u6b21\u4fee\u6539\u5417\uff1f",onOk:function(){P.a.put("/platform",Object(n.a)({},t)).then(function(t){var a=t.data,n=a.code,o=a.msg;1===n?(p.a.success(o),e.getPlatformList(),e.cancelAction()):p.a.error(o)})}})}},{key:"cancelAction",value:function(){this.setState({modalVisible:!1,platformInfo:{platform:1,gonghao_name:"",seruid:""}})}},{key:"editPlatform",value:function(t){this.setState({platformInfo:t,modalVisible:!0})}},{key:"deletePlatform",value:function(t){var e=this;d.a.confirm({title:"\u786e\u5b9a\u5220\u9664\u8fd9\u6761\u5185\u5bb9\u5417\uff1f",onOk:function(){P.a.delete("/platform",{params:{id:t}}).then(function(t){var a=t.data,n=a.code,o=a.msg;1===n?(p.a.success(o),e.getPlatformList()):p.a.error(o)})}})}},{key:"UNSAFE_componentWillMount",value:function(){this.getPlatformList()}},{key:"render",value:function(){var t=this,e=this.state,a=e.platformList,o=e.emptyText,r=e.modalVisible,l=e.platformInfo,i=e.title,c=[{dataIndex:"platform",key:"platform",title:"\u5e73\u53f0\u540d\u79f0",align:"center",render:function(t){return 1===t?"\u9605\u6587":2===t?"\u817e\u6587":3===t?"\u6709\u4e66\u9601":"\u65e0"}},{dataIndex:"gonghao_name",key:"gonghao_name",title:"\u516c\u53f7\u540d\u79f0",align:"center"},{dataIndex:"seruid",key:"seruid",title:"\u516c\u53f7id",align:"center"},{title:"\u64cd\u4f5c",key:"action",align:"center",render:function(e,a,o){return f.a.createElement("div",null,f.a.createElement(v.a,{onClick:function(){return t.editPlatform(Object(n.a)({},a))},buttonContent:"\u7f16\u8f91"}),f.a.createElement(v.a,{onClick:function(){return t.deletePlatform(a._id)},background:"danger",buttonContent:"\u5220\u9664"}))}}];return f.a.createElement("div",null,f.a.createElement("div",{className:"container"},f.a.createElement(v.a,{mb:20,size:"default",onClick:this.addPlatform,background:"success",buttonContent:"\u6dfb\u52a0"}),f.a.createElement(b.a,{rowKey:function(t){return t._id},columns:c,dataSource:a,locale:{emptyText:o},size:"small"})),f.a.createElement(d.a,{title:i,visible:r,onOk:this.submitPlatform,onCancel:this.cancelAction},f.a.createElement(g.a,{labelCol:{span:6},wrapperCol:{span:14}},f.a.createElement(g.a.Item,{label:"\u5e73\u53f0\u540d\u79f0"},f.a.createElement(s.a,{value:l.platform,onChange:function(e){return t.changePlatformInfoInput(e,"platform")}},f.a.createElement(y,{value:1},"\u9605\u6587"),f.a.createElement(y,{value:2},"\u817e\u6587"),f.a.createElement(y,{value:3},"\u6709\u4e66\u9601"))),f.a.createElement(g.a.Item,{label:"\u516c\u53f7\u540d\u79f0"},f.a.createElement(h.a,{value:l.gonghao_name,onChange:function(e){return t.changePlatformInfoInput(e.target.value,"gonghao_name")}})),f.a.createElement(g.a.Item,{label:"\u516c\u53f7id"},f.a.createElement(h.a,{value:l.seruid,onChange:function(e){return t.changePlatformInfoInput(e.target.value,"seruid")}})))))}}]),e}(u.Component);e.default=I},809:function(t,e,a){"use strict";var n=a(43),o=a(44),r=a(46),l=a(45),i=a(47),c=a(0),m=a.n(c),u=a(104),f={warning:"#F39C12",danger:"#E74C3C",success:"#2ECC71",info:"#7F8C8D",update:"#3498DB"},s=function(t){function e(){var t,a;Object(n.a)(this,e);for(var o=arguments.length,i=new Array(o),c=0;c<o;c++)i[c]=arguments[c];return(a=Object(r.a)(this,(t=Object(l.a)(e)).call.apply(t,[this].concat(i)))).state={buttonStyle:{background:"#3498DB",color:"#fff",marginRight:5,marginLeft:0,marginBottom:0}},a}return Object(i.a)(e,t),Object(o.a)(e,[{key:"componentDidMount",value:function(){var t=this.props,e=t.background,a=void 0===e?"update":e,n=t.color,o=void 0===n?"#fff":n,r=t.mr,l=void 0===r?5:r,i=t.ml,c=void 0===i?0:i,m=t.mb,u=void 0===m?0:m;this.setState({buttonStyle:{background:f[a],color:o,marginRight:l,marginLeft:c,marginBottom:u}})}},{key:"render",value:function(){var t=this.props,e=t.size,a=void 0===e?"small":e,n=t.buttonContent,o=t.disabled,r=void 0!==o&&o,l=t.onClick,i=this.state.buttonStyle;return m.a.createElement(u.a,{size:a,disabled:r,style:i,onClick:l},n)}}]),e}(c.Component);e.a=s}}]);