(window.webpackJsonp=window.webpackJsonp||[]).push([[41],{1000:function(e,n,t){"use strict";t.r(n);var a=t(43),i=t(44),r=t(46),u=t(45),c=t(47),l=t(0),o=t.n(l),d=t(104),s=t(1021),m=t(264),p=t(76),g=t(128),f=t(371),y=function(e){function n(){return Object(a.a)(this,n),Object(r.a)(this,Object(u.a)(n).apply(this,arguments))}return Object(c.a)(n,e),Object(i.a)(n,[{key:"render",value:function(){var e=this.props,n=e.menuList,t=e.deleteMenu,a=[{title:"\u83dc\u5355\u7c7b\u578b",key:"individual",dataIndex:"individual",align:"center",render:function(e,n){return n.individual?"\u4e2a\u6027\u5316\u83dc\u5355":"\u901a\u7528\u83dc\u5355"}},{title:"\u83dc\u5355\u6027\u522b",key:"sex",dataIndex:"sex",align:"center",render:function(e,n){return n.individual?"0"===n.sex?"\u672a\u77e5":"1"===n.sex?"\u7537":"\u5973":"\u2014\u2014"}},{key:"title",dataIndex:"title",title:"\u6807\u9898",align:"center"},{title:"Action",key:"Action",align:"center",render:function(e,n,a){return o.a.createElement("div",null,o.a.createElement(d.a,{size:"small",type:"primary",style:{marginRight:"10px"}},o.a.createElement(p.b,{to:{pathname:"/admin/gonghao/menu/update",query:n}},"\u7f16\u8f91")),o.a.createElement(d.a,{size:"small",type:"danger",onClick:function(){return t(n._id,a)}},"\u5220\u9664"))}}];return o.a.createElement("div",null,o.a.createElement("div",{className:"container"},o.a.createElement(d.a,{type:"primary",style:{marginBottom:"20px"}},o.a.createElement(p.b,{to:"/admin/gonghao/menu/create"},"\u914d\u7f6e\u65b0\u83dc\u5355\u680f")),o.a.createElement(s.a,{size:"small",rowKey:function(e){return e._id},columns:a,dataSource:n,pagination:{onChange:function(){return Object(g.a)()}}})))}},{key:"componentDidMount",value:function(){this.props.getMenuList()}}]),n}(l.Component);n.default=Object(m.b)(function(e){return{menuList:e.gonghao.menu.menuList}},function(e){return{getMenuList:function(){e(f.a.getMenuList())},deleteMenu:function(n,t){e(f.a.deleteMenu(n,t))}}})(y)}}]);