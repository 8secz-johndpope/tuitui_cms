(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6381fa69"],{1166:function(t,e,a){"use strict";a.r(e);var o=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"group-list"},["群发列表"===t.$route.name?a("div",[a("Table",{staticClass:"group-table",attrs:{stripe:"",columns:t.groupHeader,data:t.groupData}}),a("Page",{attrs:{"show-total":"",total:t.dataList.length,"page-size":10},on:{"on-change":t.changePage}})],1):t._e(),a("router-view")],1)},n=[],i=(a("cadf"),a("551c"),a("097d"),{data:function(){var t=this;return{groupData:[],dataList:[],groupHeader:[{key:"code",title:"code",align:"center",width:80},{key:"name",title:"公号名称",align:"center"},{title:"Action",align:"center",render:function(e,a){var o=t;return e("div",[e("Button",{style:{marginRight:"10px"},props:{type:"primary",size:"small"},on:{click:function(){o.$axios.get("/material",{params:{code:a.row.code}}).then(function(t){o.$Message.info(t.data.success)})}}},"同步素材"),e("Button",{style:{marginRight:"10px"},props:{type:"success",size:"small"},on:{click:function(){o.$router.push({name:"发送消息",query:{code:a.row.code}})}}},"群发消息"),e("Button",{style:{marginRight:"10px"},props:{type:"info",size:"small"},on:{click:function(){o.$router.push({name:"群发记录",query:{code:a.row.code}})}}},"群发记录")])}}]}},mounted:function(){this.showDataList()},methods:{showDataList:function(){var t=this;this.$axios.get("/conf").then(function(e){for(var a=e.data.data,o=0;o<a.length;o++)1==a[o].status&&t.dataList.push(a[o]);t.groupData=t.dataList.slice(0,10)})},changePage:function(t){var e=10*(t-1),a=10*t;this.groupData=this.dataList.slice(e,a),this.goTop()},goTop:function(){var t=this;t.timer=setInterval(function(){var e=document.documentElement.scrollTop||document.body.scrollTop,a=Math.floor(-e);document.documentElement.scrollTop=document.body.scrollTop=e+a,t.isTop=!0,0===e&&clearInterval(t.timer)},30)}}}),s=i,r=(a("1f7e"),a("2877")),c=Object(r["a"])(s,o,n,!1,null,"f4ea6bf6",null);c.options.__file="groupList.vue";e["default"]=c.exports},"1f7e":function(t,e,a){"use strict";var o=a("5ec6"),n=a.n(o);n.a},"5ec6":function(t,e,a){}}]);
//# sourceMappingURL=chunk-6381fa69.081910e0.js.map