(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2f5db3ea"],{8892:function(t,e,s){"use strict";s.r(e);var r=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("gofr-element",{attrs:{edit:t.edit,loading:!1},scopedSlots:t._u([{key:"form",fn:function(){return[s("v-text-field",{attrs:{"error-messages":t.errors,label:t.$t("App.fhir-resources-texts."+t.display),disabled:t.disabled,name:t.field,outlined:"","hide-details":"auto",rules:t.rules,dense:""},on:{change:function(e){t.errors=[]}},scopedSlots:t._u([{key:"label",fn:function(){return[t._v(t._s(t.$t("App.fhir-resources-texts."+t.display))+" "),t.required?s("span",{staticClass:"red--text font-weight-bold"},[t._v("*")]):t._e()]},proxy:!0}]),model:{value:t.value,callback:function(e){t.value=t._n(e)},expression:"value"}})]},proxy:!0},{key:"header",fn:function(){return[t._v(" "+t._s(t.$t("App.fhir-resources-texts."+t.display))+" ")]},proxy:!0},{key:"value",fn:function(){return[t._v(" "+t._s(t.value)+" ")]},proxy:!0}])})},a=[],i=s("d79a"),o={name:"fhir-decimal",props:["field","label","min","max","id","path","slotProps","sliceName","base-min","base-max","edit","readOnlyIfSet","constraints"],components:{GofrElement:i["a"]},data:function(){return{source:{path:"",data:{}},value:"",disabled:!1,errors:[],lockWatch:!1}},created:function(){this.setupData()},watch:{slotProps:{handler:function(){this.lockWatch||this.setupData()},deep:!0}},methods:{setupData:function(){if(this.slotProps&&this.slotProps.source){if(this.source={path:this.slotProps.source.path+"."+this.field,data:{}},this.slotProps.source.fromArray)this.source.data=this.slotProps.source.data,this.value=this.source.data,this.lockWatch=!0;else{var t=this.$fhirutils.pathFieldExpression(this.field);this.source.data=this.$fhirpath.evaluate(this.slotProps.source.data,t),1==this.source.data.length&&(this.value=this.source.data[0],this.lockWatch=!0)}this.disabled=this.readOnlyIfSet&&!!this.value}}},computed:{index:function(){return this.slotProps?this.slotProps.input:void 0},display:function(){return this.slotProps&&this.slotProps.input?this.slotProps.input.label:this.label},required:function(){return(this.index||0)<this.min},rules:function(){var t=this,e=function(e){return e!=Math.floor(e)||t.display+" must be an Decimal"},s=[e];return this.required&&s.push((function(e){return!!e||t.display+" is required"})),s}}},n=o,l=s("2877"),u=s("6544"),c=s.n(u),d=s("8654"),h=Object(l["a"])(n,r,a,!1,null,null,null);e["default"]=h.exports;c()(h,{VTextField:d["a"]})},d79a:function(t,e,s){"use strict";var r=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[t.edit?s("v-container",[t._t("form")],2):s("div",[s("v-row",{attrs:{dense:""}},[s("v-col",{staticClass:"font-weight-bold",attrs:{cols:t.$store.state.cols.header}},[t._t("header")],2),t.loading?s("v-col",{attrs:{cols:t.$store.state.cols.content}},[s("v-progress-linear",{attrs:{indeterminate:"",color:"primary"}})],1):s("v-col",{attrs:{cols:t.$store.state.cols.content}},[t._t("value")],2)],1),s("v-divider")],1)],1)},a=[],i={name:"gofr-element",props:["edit","loading"]},o=i,n=s("2877"),l=s("6544"),u=s.n(l),c=s("62ad"),d=s("a523"),h=s("ce7e"),p=s("8e36"),f=s("0fd9"),v=Object(n["a"])(o,r,a,!1,null,null,null);e["a"]=v.exports;u()(v,{VCol:c["a"],VContainer:d["a"],VDivider:h["a"],VProgressLinear:p["a"],VRow:f["a"]})}}]);
//# sourceMappingURL=chunk-2f5db3ea.f9944d7d.js.map