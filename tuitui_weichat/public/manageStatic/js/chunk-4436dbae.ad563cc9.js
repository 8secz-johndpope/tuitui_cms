(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4436dbae"],{"092a":function(t,a,e){"use strict";e.r(a);var n=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"tuoguan"},["公号托管"===t.$route.name?e("div",[e("Button",{staticClass:"create",attrs:{type:"success",to:"/manage/gonghao/tuoguan/create"}},[t._v("接管新公号")]),e("Input",{staticStyle:{width:"200px","margin-right":"30px"},attrs:{size:"large",type:"text",placeholder:"请输入公号名"},model:{value:t.name,callback:function(a){t.name=a},expression:"name"}}),e("Button",{attrs:{size:"large",type:"primary"},on:{click:t.search}},[t._v("搜索")]),e("Button",{staticStyle:{float:"right"},attrs:{type:"warning"},on:{click:t.reset}},[e("span",{staticStyle:{color:"#000"}},[t._v("(慎用)")]),t._v("\n            重置code\n        ")]),e("div",{staticStyle:{clear:"both"}}),e("RadioGroup",{staticClass:"gonghao-tag",attrs:{type:"button"},on:{"on-change":t.showDataList},model:{value:t.gonghaoTag,callback:function(a){t.gonghaoTag=a},expression:"gonghaoTag"}},[e("Radio",{attrs:{label:"全部"}}),t._l(t.tagList,function(t,a){return e("Radio",{attrs:{label:t.name}})})],2),e("Table",{staticClass:"tuoguan-table",attrs:{stripe:"",columns:t.tuoguanHeader,data:t.tuoguanData}}),e("Page",{attrs:{"show-total":"",total:t.dataList.length,"page-size":10},on:{"on-change":t.changePage}})],1):t._e(),e("router-view")],1)},o=[],i=(e("7f7f"),e("cadf"),e("551c"),e("097d"),{data:function(){var t=this;return{isCreate:!0,code:null,name:"",gonghaoTag:"全部",tagList:[],dataList:[],tuoguanData:[],tuoguanHeader:[{key:"code",title:"code",align:"center",width:80},{key:"name",title:"公号名称",align:"center"},{title:"分组",align:"center",render:function(t,a){var e=""==a.row.group?"暂未分组":a.row.group;return t("span",{props:{}},e)}},{key:"token",title:"token",align:"center"},{title:"EncodingAESKey",align:"center",width:140,render:function(t,a){var e=a.row.EncodingAESKey;return t("div",{style:{padding:"5px 0"}},e)}},{key:"url",title:"链接",align:"center",render:function(t,a){var e="http://test.oorggt.top/weichat/"+a.row.code;return t("span",{props:{}},e)}},{title:"接管状态",align:"center",render:function(t,a){var e=-2==a.row.status?"未接管":-1==a.row.status?"接管中":"已接管";return t("span",{props:{}},e)}},{title:"Action",align:"center",width:240,render:function(a,e){var n=t;return a("div",[a("Button",{style:{marginRight:"10px"},props:{type:"primary",size:"small"},on:{click:function(){n.$router.push({name:"修改公号",query:e.row})}}},"编辑"),a("Button",{style:{marginRight:"10px"},props:{type:"warning",size:"small"},on:{click:function(){n.$router.push({name:"配置公号",query:{code:e.row.code}})}}},"配置"),a("Button",{props:{type:"error",size:"small"},style:{marginRight:"10px"},on:{click:function(){n.$Modal.confirm({title:"提示:",content:"确认删除这条内容吗？",onOk:function(){n.$axios.get("/conf/del",{params:{id:e.row._id}}).then(function(t){n.tuoguanData.splice(e.index,1),n.$Message.info(t.data.success)})}})}}},"删除"),a("Button",{props:{type:"success",size:"small",disabled:-2!=e.row.status},on:{click:function(){n.$Modal.confirm({title:"提示:",content:"确认开始接管吗？",onOk:function(){n.$axios.get("/conf/jieguan",{params:{code:e.row.code}}).then(function(t){n.$Message.info("开始接管"),n.$router.go(0)})}})}}},"接管")])}}]}},mounted:function(){this.showDataList(),this.showTagList()},methods:{search:function(){var t=this;""!=this.name.trim()?this.$axios.get("/conf/find_one",{name:this.name}).then(function(a){a.data.data?t.groupData=a.data.data:t.showDataList()}):this.$Message.info("公号名不能为空")},showTagList:function(){var t=this;this.$axios.get("/gonghaoTag").then(function(a){t.tagList=a.data.data})},showDataList:function(){var t=this;this.$axios.get("/conf").then(function(a){var e=a.data.data;if("全部"==t.gonghaoTag)t.dataList=e;else for(var n=0;n<e.length;n++)t.gonghaoTag==e[n].group?t.dataList.push(e[n]):t.dataList=[];t.tuoguanData=t.dataList.slice(0,10)})},reset:function(){var t=this;this.$axios.get("/conf/reset").then(function(a){t.$Message.info(a.data.success)})},changePage:function(t){var a=10*(t-1),e=10*t;this.tuoguanData=this.dataList.slice(a,e),this.goTop()},goTop:function(){var t=this;t.timer=setInterval(function(){var a=document.documentElement.scrollTop||document.body.scrollTop,e=Math.floor(-a);document.documentElement.scrollTop=document.body.scrollTop=a+e,t.isTop=!0,0===a&&clearInterval(t.timer)},30)}}}),s=i,r=(e("1fe3"),e("2877")),c=Object(r["a"])(s,n,o,!1,null,"26fc1587",null);c.options.__file="tuoguan.vue";a["default"]=c.exports},"1fe3":function(t,a,e){"use strict";var n=e("2640"),o=e.n(n);o.a},2640:function(t,a,e){}}]);
//# sourceMappingURL=chunk-4436dbae.ad563cc9.js.map