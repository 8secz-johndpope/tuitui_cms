(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-9f3b89d4"],{"321f":function(t,e,s){"use strict";var a=s("9e89"),i=s.n(a);i.a},"9e89":function(t,e,s){},ac6a:function(t,e,s){for(var a=s("cadf"),i=s("0d58"),n=s("2aba"),r=s("7726"),o=s("32e9"),l=s("84f2"),u=s("2b4c"),c=u("iterator"),m=u("toStringTag"),h=l.Array,b={CSSRuleList:!0,CSSStyleDeclaration:!1,CSSValueList:!1,ClientRectList:!1,DOMRectList:!1,DOMStringList:!1,DOMTokenList:!0,DataTransferItemList:!1,FileList:!1,HTMLAllCollection:!1,HTMLCollection:!1,HTMLFormElement:!1,HTMLSelectElement:!1,MediaList:!0,MimeTypeArray:!1,NamedNodeMap:!1,NodeList:!0,PaintRequestList:!1,Plugin:!1,PluginArray:!1,SVGLengthList:!1,SVGNumberList:!1,SVGPathSegList:!1,SVGPointList:!1,SVGStringList:!1,SVGTransformList:!1,SourceBufferList:!1,StyleSheetList:!0,TextTrackCueList:!1,TextTrackList:!1,TouchList:!1},p=i(b),d=0;d<p.length;d++){var f,v=p[d],_=b[v],y=r[v],x=y&&y.prototype;if(x&&(x[c]||o(x,c,h),x[m]||o(x,m,v),l[v]=h,_))for(f in a)x[f]||n(x,f,a[f],!0)}},f5af:function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[s("h2",{staticClass:"title"},[t._v("\n    "+t._s("修改菜单"==t.$route.name?"修改菜单栏配置":"配置新菜单栏")+"\n  ")]),s("div",{staticClass:"edit-info"},[s("Form",{staticClass:"form-group",attrs:{model:t.formData,"label-position":"right","label-width":100}},[s("FormItem",{attrs:{label:"选择公号",prop:"codes"}},[s("CheckboxGroup",{model:{value:t.codes,callback:function(e){t.codes=e},expression:"codes"}},t._l(t.gonghaoList,function(e,a){return s("Checkbox",{attrs:{label:e.code,name:"codes"}},[t._v(t._s(e.name))])}))],1),s("FormItem",{attrs:{label:"标题",prop:"title"}},[s("Input",{staticClass:"inputtxt",attrs:{size:"large",type:"text",placeholder:"请输入标题"},model:{value:t.title,callback:function(e){t.title="string"===typeof e?e.trim():e},expression:"title"}})],1),s("FormItem",{attrs:{label:"是否开启个性化菜单",prop:"individual"}},[s("i-switch",{model:{value:t.individual,callback:function(e){t.individual=e},expression:"individual"}})],1),t.individual?s("FormItem",{attrs:{label:"链接/关键词"}},[s("RadioGroup",{model:{value:t.sex,callback:function(e){t.sex=e},expression:"sex"}},[s("Radio",{attrs:{label:"0"}},[t._v("未知")]),s("Radio",{attrs:{label:"1"}},[t._v("男")]),s("Radio",{attrs:{label:"2"}},[t._v("女")])],1)],1):t._e(),s("FormItem",{attrs:{label:"二级菜单",prop:"has_sub_btn"}},[s("i-switch",{model:{value:t.has_sub_btn,callback:function(e){t.has_sub_btn=e},expression:"has_sub_btn"}})],1),s("FormItem",{attrs:{label:"一级菜单名称",prop:"name"}},[s("Input",{staticClass:"inputtxt",attrs:{size:"large",type:"text",placeholder:"请输入一级菜单名称"},model:{value:t.formData.name,callback:function(e){t.$set(t.formData,"name","string"===typeof e?e.trim():e)},expression:"formData.name"}})],1),s("FormItem",{directives:[{name:"show",rawName:"v-show",value:!t.has_sub_btn,expression:"!has_sub_btn"}],attrs:{label:"链接/关键词"}},[s("RadioGroup",{model:{value:t.formData.type,callback:function(e){t.$set(t.formData,"type",e)},expression:"formData.type"}},[s("Radio",{attrs:{label:"view"}},[t._v("view")]),s("Radio",{attrs:{label:"click"}},[t._v("click")])],1)],1),s("FormItem",{directives:[{name:"show",rawName:"v-show",value:!t.has_sub_btn&&"view"==t.formData.type,expression:"!has_sub_btn && formData.type == 'view'"}],attrs:{label:"一级菜单链接",prop:"url"}},[s("Input",{staticClass:"inputtxt",attrs:{size:"large",type:"text",placeholder:"请输入一级菜单链接"},model:{value:t.formData.url,callback:function(e){t.$set(t.formData,"url","string"===typeof e?e.trim():e)},expression:"formData.url"}})],1),s("FormItem",{directives:[{name:"show",rawName:"v-show",value:!t.has_sub_btn&&"click"==t.formData.type,expression:"!has_sub_btn && formData.type == 'click'"}],attrs:{label:"一级菜单关键字",prop:"key"}},[s("Input",{staticClass:"inputtxt",attrs:{size:"large",type:"text",placeholder:"请输入一级菜单关键字"},model:{value:t.formData.key,callback:function(e){t.$set(t.formData,"key","string"===typeof e?e.trim():e)},expression:"formData.key"}})],1),s("Form",{staticClass:"form-group",attrs:{model:t.subItem,"label-position":"right","label-width":100}},[s("FormItem",{directives:[{name:"show",rawName:"v-show",value:t.has_sub_btn,expression:"has_sub_btn"}],attrs:{label:"二级菜单名称",prop:"name"}},[s("Input",{staticClass:"inputtxt",attrs:{size:"large",type:"text",placeholder:"请输入二级菜单名称"},model:{value:t.subItem.name,callback:function(e){t.$set(t.subItem,"name","string"===typeof e?e.trim():e)},expression:"subItem.name"}})],1),s("FormItem",{directives:[{name:"show",rawName:"v-show",value:t.has_sub_btn,expression:"has_sub_btn"}],attrs:{label:"链接/关键词"}},[s("RadioGroup",{model:{value:t.subItem.type,callback:function(e){t.$set(t.subItem,"type",e)},expression:"subItem.type"}},[s("Radio",{attrs:{label:"view"}},[t._v("view")]),s("Radio",{attrs:{label:"click"}},[t._v("click")])],1)],1),s("FormItem",{directives:[{name:"show",rawName:"v-show",value:t.has_sub_btn&&"view"==t.subItem.type,expression:"has_sub_btn && subItem.type == 'view'"}],attrs:{label:"二级菜单链接",prop:"url"}},[s("Input",{staticClass:"inputtxt",attrs:{size:"large",type:"text",placeholder:"请输入二级菜单链接"},model:{value:t.subItem.url,callback:function(e){t.$set(t.subItem,"url","string"===typeof e?e.trim():e)},expression:"subItem.url"}})],1),s("FormItem",{directives:[{name:"show",rawName:"v-show",value:t.has_sub_btn&&"click"==t.subItem.type,expression:"has_sub_btn && subItem.type == 'click'"}],attrs:{label:"二级菜单关键词",prop:"key"}},[s("Input",{staticClass:"inputtxt",attrs:{size:"large",type:"text",placeholder:"请输入二级菜单关键词"},model:{value:t.subItem.key,callback:function(e){t.$set(t.subItem,"key","string"===typeof e?e.trim():e)},expression:"subItem.key"}})],1)],1),s("Button",{directives:[{name:"show",rawName:"v-show",value:t.has_sub_btn,expression:"has_sub_btn"}],attrs:{size:"large",type:"primary"},on:{click:function(e){t.addSubBtn()}}},[t._v("添加二级菜单")]),s("Button",{directives:[{name:"show",rawName:"v-show",value:t.secSave,expression:"secSave"}],staticStyle:{"margin-left":"30px"},attrs:{size:"large",type:"success"},on:{click:function(e){t.saveSecond()}}},[t._v("保存\n      ")]),0!=t.secData.length?s("Table",{staticClass:"second-table",attrs:{stripe:"",columns:t.secHeader,data:t.secData}}):t._e(),s("span",{directives:[{name:"show",rawName:"v-show",value:t.has_sub_btn,expression:"has_sub_btn"}],staticClass:"line"}),s("Button",{attrs:{size:"large",type:"primary"},on:{click:function(e){t.addBtn()}}},[t._v("添加一级菜单")]),s("Button",{directives:[{name:"show",rawName:"v-show",value:t.firstSave,expression:"firstSave"}],staticStyle:{"margin-left":"30px"},attrs:{size:"large",type:"success"},on:{click:function(e){t.saveFirst()}}},[t._v("保存\n      ")]),s("Table",{staticClass:"first-table",attrs:{stripe:"",columns:t.firstHeader,data:t.firstData}}),s("Button",{staticClass:"btn",attrs:{size:"large",type:"primary"},on:{click:t.submitForm}},[t._v("提交")]),s("Button",{attrs:{size:"large",type:"error"},on:{click:t.cancel}},[t._v("取消")])],1)],1)])},i=[],n=(s("ac6a"),s("7f7f"),s("cadf"),s("551c"),s("097d"),{data:function(){var t=this;return{codes:[],formData:{sub_button:[],type:"view"},title:"",individual:!1,sex:"0",firstData:[],has_sub_btn:!1,subItem:{type:"view"},radio:"url",firstSave:!1,secSave:!1,index:null,index1:null,secData:[],firstHeader:[{key:"name",title:"一级菜单名称",align:"center",render:function(t,e){var s=e.row.name?e.row.name:"~";return t("span",{props:{}},s)}},{title:"Action",align:"center",render:function(e,s){var a=t;return e("div",[e("Button",{style:{marginRight:"10px"},props:{type:"primary",size:"small"},on:{click:function(){a.firstSave=!0,a.formData=s.row,a.index=s.index,a.formData.sub_button&&(a.secData=a.formData.sub_button,a.has_sub_btn=!0,a.subItem=a.secData[0],a.secSave=!0)}}},"编辑"),e("Button",{props:{type:"error",size:"small"},on:{click:function(){a.firstData.splice(s.index,1),a.formData={sub_button:[],type:"view"},a.subItem={},a.has_sub_btn=!1,a.secData=[]}}},"删除")])}}],secHeader:[{key:"name",title:"二级菜单名称",align:"center"},{title:"Action",align:"center",render:function(e,s){var a=t;return e("div",[e("Button",{style:{marginRight:"10px"},props:{type:"primary",size:"small"},on:{click:function(){a.index1=s.index,a.subItem=s.row,a.secSave=!0}}},"编辑"),e("Button",{props:{type:"error",size:"small"},on:{click:function(){a.formData.sub_button.splice(s.index,1),a.subItem={type:"view"},a.has_sub_btn=!0}}},"删除")])}}],gonghaoList:[]}},mounted:function(){this.showGonghaoList(),"修改菜单"===this.$route.name&&(this.firstSave=!0,this.data_info=this.$route.params,this.codes=this.data_info.codes,this.title=this.data_info.title,this.individual=this.data_info.individual,this.sex=this.data_info.sex,this.firstData=this.data_info.values,this.formData=this.firstData[0],this.formData.sub_button&&(this.secData=this.formData.sub_button,this.has_sub_btn=!0,this.secSave=!0,this.subItem=this.secData[0]))},methods:{showGonghaoList:function(){var t=this;this.$axios.get("/conf").then(function(e){t.gonghaoList=e.data.data})},cancel:function(){this.resetForm(),this.$router.push({name:"配置菜单"})},resetForm:function(){this.individual=!1,this.sex="0",this.title="",this.codes=[],this.formData={sub_button:[],type:"view"},this.subItem={type:"view"}},addBtn:function(){this.formData.sub_button=this.secData,this.secData=[],0==this.formData.sub_button.length&&delete this.formData.sub_button,this.firstData.push(this.formData),this.resetForm(),this.has_sub_btn=!1},submitForm:function(){var t=this;0!=this.firstData.length?"新建菜单"===this.$route.name?this.$axios.post("/menu/create",{codes:this.codes,title:this.title,values:this.firstData,individual:this.individual,sex:this.sex}).then(function(e){t.firstData=[],t.$Message.info("创建成功"),t.cancel()}):"修改菜单"===this.$route.name&&this.$axios.post("/menu/update",{id:this.data_info._id,codes:this.codes,title:this.title,values:this.firstData,individual:this.individual,sex:this.sex}).then(function(e){t.firstData=[],t.$Message.info("修改成功"),t.cancel()}):this.$Message.info("菜单列表不能为空")},addSubBtn:function(){this.secData.push(this.subItem),this.subItem={type:"view"},this.has_sub_btn=!0},saveFirst:function(){this.firstData.splice(this.index,1,this.formData),this.secData=[],this.resetForm(),this.firstSave=!1},saveSecond:function(){this.secData.splice(this.index1,1,this.subItem),this.has_sub_btn=!0,this.secSave=!1,this.subItem={type:"view"}}}}),r=n,o=(s("321f"),s("2877")),l=Object(o["a"])(r,a,i,!1,null,"5583f0a3",null);l.options.__file="editInfo.vue";e["default"]=l.exports}}]);
//# sourceMappingURL=chunk-9f3b89d4.90400ee8.js.map