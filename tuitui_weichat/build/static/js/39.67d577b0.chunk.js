(window.webpackJsonp=window.webpackJsonp||[]).push([[39],{1010:function(t,e,a){"use strict";a.r(e);var n=a(38),o=a(39),r=a(42),i=a(40),c=a(41),l=a(0),s=a.n(l),u=a(96),d=a(59),f=a(1014),m=a(805),g=a(4),p=function(t){function e(){var t,a;Object(n.a)(this,e);for(var o=arguments.length,c=new Array(o),l=0;l<o;l++)c[l]=arguments[l];return(a=Object(r.a)(this,(t=Object(i.a)(e)).call.apply(t,[this].concat(c)))).state={platformList:[]},a.getPlatformList=function(){g.a.get("/platformManage").then(function(t){if(1===t.data.code){var e=t.data.data;a.setState({platformList:e})}})},a}return Object(c.a)(e,t),Object(o.a)(e,[{key:"deletePlatform",value:function(t){var e=this;u.a.confirm({title:"\u786e\u5b9a\u5220\u9664\u8fd9\u4e2a\u5e73\u53f0\u5417\uff1f",onOk:function(){g.a.delete("/platformManage",{params:{id:t}}).then(function(t){1===t.data.code?(d.a.success(t.data.msg),e.getPlatformList()):d.a.error(t.data.msg)})}})}},{key:"componentDidMount",value:function(){this.getPlatformList()}},{key:"render",value:function(){var t=this,e=this.state.platformList,a=[{key:"name",dataIndex:"name",title:"\u5e73\u53f0\u540d\u79f0",align:"center"},{key:"platform",dataIndex:"platform",title:"\u5e73\u53f0id",align:"center"},{title:"Action",key:"_id",dataIndex:"_id",align:"center",render:function(e){return s.a.createElement(m.a,{background:"danger",buttonContent:"\u5220\u9664",onClick:function(){return t.deletePlatform(e)}})}}];return s.a.createElement("div",null,s.a.createElement("div",{className:"container"},s.a.createElement(f.a,{rowKey:function(t){return t._id},size:"small",dataSource:e,columns:a,pagination:!1})))}}]),e}(l.Component);e.default=p},805:function(t,e,a){"use strict";var n=a(38),o=a(39),r=a(42),i=a(40),c=a(41),l=a(0),s=a.n(l),u=a(106),d={warning:"#F39C12",danger:"#E74C3C",success:"#2ECC71",info:"#7F8C8D",update:"#3498DB"},f=function(t){function e(){var t,a;Object(n.a)(this,e);for(var o=arguments.length,c=new Array(o),l=0;l<o;l++)c[l]=arguments[l];return(a=Object(r.a)(this,(t=Object(i.a)(e)).call.apply(t,[this].concat(c)))).state={buttonStyle:{background:"#3498DB",color:"#fff",marginRight:5,marginLeft:0,marginBottom:0}},a}return Object(c.a)(e,t),Object(o.a)(e,[{key:"componentDidMount",value:function(){var t=this.props,e=t.background,a=void 0===e?"update":e,n=t.color,o=void 0===n?"#fff":n,r=t.mr,i=void 0===r?5:r,c=t.ml,l=void 0===c?0:c,s=t.mb,u=void 0===s?0:s;this.setState({buttonStyle:{background:d[a],color:o,marginRight:i,marginLeft:l,marginBottom:u}})}},{key:"render",value:function(){var t=this.props,e=t.size,a=void 0===e?"small":e,n=t.buttonContent,o=t.disabled,r=void 0!==o&&o,i=t.onClick,c=this.state.buttonStyle;return s.a.createElement(u.a,{size:a,disabled:r,style:c,onClick:i},n)}}]),e}(l.Component);e.a=f}}]);