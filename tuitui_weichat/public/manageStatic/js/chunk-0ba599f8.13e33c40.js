(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0ba599f8"],{"5bc5":function(e,t,n){"use strict";n.r(t);var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"show-message"},["消息管理"===e.$route.name?n("div",[n("Button",{staticClass:"create",attrs:{type:"success",size:"large",to:"/manage/msg_view/guanli/create"}},[e._v("添加客服消息")]),n("Table",{staticClass:"message-table",attrs:{columns:e.messageHeader,data:e.messageData}}),n("Page",{attrs:{"show-total":"",total:e.dataList.length,"page-size":10},on:{"on-change":e.changePage}})],1):e._e(),n("router-view")],1)},s=[],i=(n("7f7f"),n("cadf"),n("551c"),n("097d"),{data:function(){var e=this;return{dataList:[],messageData:[],messageHeader:[{key:"type",title:"类型",align:"center",render:function(e,t){var n=(1==t.row.type?"文本消息":"图文消息")+(t.row.contents.length>1?"(多)":"");return e("span",{props:{}},n)}},{key:"task",title:"是否延时",align:"center",render:function(e,t){var n=1==t.row.task?"是":"否";return e("span",{props:{}},n)}},{key:"delay",title:"延时时间(分钟)",align:"center",render:function(e,t){var n=1==t.row.task?t.row.delay:"——";return e("span",{props:{}},n)}},{key:"is_timing",title:"是否定时(分钟)",align:"center",render:function(e,t){var n=1==t.row.is_timing?"是":"否";return e("span",{props:{}},n)}},{key:"timing_time",title:"定时时间",align:"center",width:100,render:function(e,t){var n=1==t.row.is_timing?t.row.time:"——";return e("span",{props:{}},n)}},{key:"sex",title:"性别",align:"center",width:100,render:function(e,t){var n="0"==t.row.sex?"未知":"1"==t.row.sex?"男":"2"==t.row.sex?"女":"全部";return e("span",{props:{}},n)}},{key:"title",title:"标题",align:"center",tooltip:!0,render:function(e,t){var n=t.row.contents[0].title||"——";return e("Tooltip",{props:{placement:"top-start",content:n,maxWidth:200}},[e("span",{style:{diaplay:"inline-block",width:"100%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",wordBreak:"break-all"}},n)])}},{key:"description",title:"详细信息",align:"center",tooltip:!0,width:90,render:function(e,t){var n=t.row.contents[0].description||"——";return e("Tooltip",{props:{placement:"top-start",content:n,maxWidth:200}},[e("span",{style:{diaplay:"inline-block",width:"100%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",wordBreak:"break-all"}},n)])}},{key:"url",title:"链接",align:"center",tooltip:!0,render:function(e,t){var n=t.row.contents[0].url||"——";return e("Tooltip",{props:{placement:"top-start",content:n,maxWidth:200}},[e("span",{style:{diaplay:"inline-block",width:"100%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",wordBreak:"break-all"}},n)])}},{key:"img",title:"图片",width:160,align:"center",render:function(e,t){return e("img",{attrs:{src:t.row.img,style:"width: 100%; padding: 10px;"}})}},{title:"Action",align:"center",width:250,render:function(t,n){var a=e;return t("div",[t("Button",{style:{marginRight:"10px"},props:{type:"warning",size:"small"},on:{click:function(){a.copyMessage(n.row)}}},"复制"),t("Button",{style:{marginRight:"10px"},props:{type:"primary",size:"small"},on:{click:function(){a.$router.push({name:"修改客服消息",params:n.row})}}},"修改"),t("Button",{style:{marginRight:"10px",display:n.row.task||n.row.is_timing?"none":"inline-block"},props:{type:"success",size:"small"},on:{click:function(){a.sendMessage(n.row)}}},"发送消息"),t("Button",{props:{type:"error",size:"small"},on:{click:function(){a.deleteMessage(n.row)}}},"删除")])}}]}},mounted:function(){this.showMessage()},methods:{copyMessage:function(e){var t=this;this.$axios.post("/message/create",{contents:e.contents,type:e.type,task:e.task,delay:e.delay,is_timing:e.is_timing,timing_time:e.timing_time,codes:e.codes,img:e.img,tagId:e.tagId}).then(function(e){e.data.success?(t.$Message.info(e.data.success),t.messageData.unshift(e.data.data)):t.$Message.info(e.data.err)})},showMessage:function(){var e=this;this.$axios("/message").then(function(t){0!=t.data.messages.length&&(e.dataList=t.data.messages,e.messageData=e.dataList.slice(0,10))})},sendMessage:function(e){var t=this;this.$Modal.confirm({title:"提示:",content:"确认发送这条消息吗？",onOk:function(){t.$axios.get("/message/send",{params:{id:e._id,take_over:!0,tagId:e.tagId}}).then(function(e){t.$Message.info(e.data.success)})}})},deleteMessage:function(e){var t=this;this.$Modal.confirm({title:"提示:",content:"确认删除这条内容吗？",onOk:function(){t.$axios.get("/message/delete",{params:{id:e._id}}).then(function(e){0==e.data.data?(t.$Message.info("已删除最后一条数据"),t.messageData=[]):(t.$Message.info(e.data.success),t.showMessage())})}})},changePage:function(e){var t=10*(e-1),n=10*e;this.groupData=this.dataList.slice(t,n),this.goTop()},goTop:function(){var e=this;e.timer=setInterval(function(){var t=document.documentElement.scrollTop||document.body.scrollTop,n=Math.floor(-t);document.documentElement.scrollTop=document.body.scrollTop=t+n,e.isTop=!0,0===t&&clearInterval(e.timer)},30)}},watch:{$route:function(e,t){"添加客服消息"!=t.name&&"修改客服消息"!=t.name||this.showMessage()}}}),o=i,r=(n("6a66"),n("2877")),c=Object(r["a"])(o,a,s,!1,null,"6a469c58",null);c.options.__file="manage.vue";t["default"]=c.exports},"6a66":function(e,t,n){"use strict";var a=n("70dd"),s=n.n(a);s.a},"70dd":function(e,t,n){}}]);
//# sourceMappingURL=chunk-0ba599f8.13e33c40.js.map