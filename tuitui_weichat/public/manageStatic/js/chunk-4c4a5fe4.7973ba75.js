(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4c4a5fe4"],{3899:function(t,a,e){"use strict";e.r(a);var n=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"edit-info"},[e("h3",{staticClass:"wrap-title"},[t._v(t._s("编辑二维码"==t.$route.name?"修改":"添加")+"二维码")]),e("Form",{attrs:{"label-position":"right","label-width":120}},[e("FormItem",{attrs:{label:"二维码名称",prop:"name"}},[e("Input",{attrs:{size:"large",type:"text",placeholder:"请输入二维码名称"},model:{value:t.name,callback:function(a){t.name=a},expression:"name"}})],1),e("FormItem",{attrs:{label:"关注回复内容",prop:"content"}},[e("Input",{attrs:{size:"large",type:"textarea",placeholder:"请输入关注回复内容"},model:{value:t.content,callback:function(a){t.content=a},expression:"content"}})],1),e("FormItem",{attrs:{label:"选择标签",prop:"tagName"}},[t.tagName?e("Tag",{attrs:{name:t.tagName,closable:""},on:{"on-close":t.handleClose}},[t._v(t._s(t.tagName))]):t._e()],1),e("FormItem",{attrs:{label:"标签选项"}},t._l(t.tagList,function(a,n){return e("Tag",{attrs:{name:a.name},nativeOn:{click:function(e){t.selectTag(a)}}},[t._v(t._s(a.name))])})),e("FormItem",{attrs:{label:"选择公号",prop:"code"}},[e("RadioGroup",{attrs:{type:"button"},model:{value:t.code,callback:function(a){t.code=a},expression:"code"}},t._l(t.gonghaoList,function(a,n){return e("Radio",{key:n,staticStyle:{margin:"10px"},attrs:{disabled:"编辑二维码"===t.$route.name,label:a.code}},[t._v(t._s(a.name))])}))],1),e("FormItem",["编辑二维码"===t.$route.name?e("Button",{staticClass:"edit-btn",attrs:{size:"large",type:"primary"},on:{click:t.save}},[t._v("保存")]):e("Button",{staticClass:"edit-btn",attrs:{size:"large",type:"primary"},on:{click:t.create}},[t._v("立即生成")]),e("Button",{staticClass:"edit-btn",attrs:{size:"large",type:"warning"},on:{click:t.cancel}},[t._v("取消")])],1)],1)],1)},s=[],o=(e("7f7f"),{data:function(){return{name:"",content:"",gonghao:"",code:"",gonghaoList:[],id:"",tagName:"",tagVal:"",tagList:[],tagId:""}},mounted:function(){var t=this;if(this.getGonghaoList(),this.showTagList(),"编辑二维码"===this.$route.name){var a=this.$route.params;this.name=a.name,this.content=a.content,this.code=a.code,this.id=a._id,this.tagId=a.tagId,this.$axios.get("/tag/get_name",{params:{tagId:this.tagId}}).then(function(a){t.tagName=a.data.data.name})}},methods:{handleClose:function(){this.tagName=""},showTagList:function(){var t=this;this.$axios.get("/tag").then(function(a){t.tagList=a.data.data})},selectTag:function(t){var a=this;this.$axios.post("/tag",{name:t.name}).then(function(t){a.tagId=t.data.data._id,a.tagName=t.data.data.name})},cancel:function(){this.name=this.content=this.code="",this.$router.push({name:"参数二维码"})},create:function(){var t=this;this.$axios.post("/qr_code/create",{name:this.name,content:this.content,code:this.code,tagId:this.tagId}).then(function(a){""==a.data.data?t.$message.error("创建失败"):(t.$Message.info("创建成功"),t.cancel())})},getGonghaoList:function(){var t=this;this.$axios.get("/qr_code/get_code").then(function(a){t.gonghaoList=a.data.codes})},save:function(){var t=this;this.$axios.post("/qr_code/update",{id:this.id,name:this.name,content:this.content,code:this.code,tagId:""==this.tagName?"":this.tagId}).then(function(a){""==a.data.data?t.$Message.info("修改失败"):(t.$Message.info("修改成功"),t.cancel())})}}}),i=o,c=(e("8a00"),e("2877")),r=Object(c["a"])(i,n,s,!1,null,"e9643a62",null);r.options.__file="editInfo.vue";a["default"]=r.exports},7170:function(t,a,e){},"8a00":function(t,a,e){"use strict";var n=e("7170"),s=e.n(n);s.a}}]);
//# sourceMappingURL=chunk-4c4a5fe4.7973ba75.js.map