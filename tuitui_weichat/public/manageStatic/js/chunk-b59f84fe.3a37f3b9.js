(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-b59f84fe"],{1166:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"group-list"},["群发列表"===t.$route.name?a("div",[a("Input",{staticStyle:{width:"200px","margin-right":"30px"},attrs:{size:"large",type:"text",placeholder:"请输入公号名"},model:{value:t.name,callback:function(e){t.name=e},expression:"name"}}),a("Button",{attrs:{size:"large",type:"primary"},on:{click:t.search}},[t._v("搜索")]),a("Table",{staticClass:"group-table",attrs:{stripe:"",columns:t.groupHeader,data:t.groupData}}),a("Page",{attrs:{"show-total":"",total:t.dataList.length,"page-size":10},on:{"on-change":t.changePage}})],1):t._e(),a("router-view")],1)},o=[],i=(a("7f7f"),a("cadf"),a("551c"),a("097d"),{data:function(){var t=this;return{name:"",groupData:[],dataList:[],groupHeader:[{key:"code",title:"code",align:"center",width:80},{key:"name",title:"公号名称",align:"center"},{title:"Action",align:"center",render:function(e,a){var n=t;return e("div",[e("Button",{style:{marginRight:"10px"},props:{type:"primary",size:"small"},on:{click:function(){n.$axios.get("/material",{params:{code:a.row.code}}).then(function(t){n.$Message.info(t.data.success)})}}},"同步素材"),e("Button",{style:{marginRight:"10px"},props:{type:"success",size:"small"},on:{click:function(){n.$router.push({name:"发送消息",query:{code:a.row.code}})}}},"群发消息"),e("Button",{style:{marginRight:"10px"},props:{type:"info",size:"small"},on:{click:function(){n.$router.push({name:"群发记录",query:{code:a.row.code}})}}},"群发记录")])}}]}},mounted:function(){this.showDataList()},methods:{search:function(){var t=this;""!=this.name.trim()?this.$axios.get("/conf/find_one",{name:this.name}).then(function(e){e.data.data?t.groupData=e.data.data:t.showDataList()}):this.$Message.info("公号名不能为空")},showDataList:function(){var t=this;this.$axios.get("/conf").then(function(e){for(var a=e.data.data,n=0;n<a.length;n++)1==a[n].status&&t.dataList.push(a[n]);t.groupData=t.dataList.slice(0,10)})},changePage:function(t){var e=10*(t-1),a=10*t;this.groupData=this.dataList.slice(e,a),this.goTop()},goTop:function(){var t=this;t.timer=setInterval(function(){var e=document.documentElement.scrollTop||document.body.scrollTop,a=Math.floor(-e);document.documentElement.scrollTop=document.body.scrollTop=e+a,t.isTop=!0,0===e&&clearInterval(t.timer)},30)}}}),s=i,r=(a("b81f"),a("2877")),c=Object(r["a"])(s,n,o,!1,null,"583af06b",null);c.options.__file="groupList.vue";e["default"]=c.exports},b81f:function(t,e,a){"use strict";var n=a("bd12"),o=a.n(n);o.a},bd12:function(t,e,a){}}]);
//# sourceMappingURL=chunk-b59f84fe.3a37f3b9.js.map