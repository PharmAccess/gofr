(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5e71a7f0"],{d79a:function(t,e,s){"use strict";var i=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[t.edit?s("v-container",[t._t("form")],2):s("div",[s("v-row",{attrs:{dense:""}},[s("v-col",{staticClass:"font-weight-bold",attrs:{cols:t.$store.state.cols.header}},[t._t("header")],2),t.loading?s("v-col",{attrs:{cols:t.$store.state.cols.content}},[s("v-progress-linear",{attrs:{indeterminate:"",color:"primary"}})],1):s("v-col",{attrs:{cols:t.$store.state.cols.content}},[t._t("value")],2)],1),s("v-divider")],1)],1)},o=[],a={name:"gofr-element",props:["edit","loading"]},n=a,r=s("2877"),l=s("6544"),d=s.n(l),u=s("62ad"),c=s("a523"),h=s("ce7e"),p=s("8e36"),f=s("0fd9"),v=Object(r["a"])(n,i,o,!1,null,null,null);e["a"]=v.exports;d()(v,{VCol:u["a"],VContainer:c["a"],VDivider:h["a"],VProgressLinear:p["a"],VRow:f["a"]})},eee9:function(t,e,s){"use strict";s.r(e);var i=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("gofr-element",{attrs:{edit:t.edit,loading:t.loading},scopedSlots:t._u([{key:"form",fn:function(){return[s("v-select",{attrs:{loading:t.loading,label:t.display,items:t.items,outlined:"","hide-details":"auto","error-messages":t.errors,"item-text":"display","item-value":"code",disabled:t.disabled,rules:t.rules,dense:""},on:{change:function(e){t.errors=[]}},scopedSlots:t._u([{key:"label",fn:function(){return[t._v(t._s(t.display)+" "),t.required?s("span",{staticClass:"red--text font-weight-bold"},[t._v("*")]):t._e()]},proxy:!0}]),model:{value:t.valueCode,callback:function(e){t.valueCode=e},expression:"valueCode"}})]},proxy:!0},{key:"header",fn:function(){return[t._v(" "+t._s(t.display)+" ")]},proxy:!0},{key:"value",fn:function(){return[t._v(" "+t._s(t.valueDisplay||t.value.display||"")+" ")]},proxy:!0}])})},o=[],a=(s("7db0"),s("d79a")),n={name:"fhir-coding",props:["field","label","sliceName","targetprofile","min","max","base-min","base-max","slotProps","path","binding","edit","readOnlyIfSet","constraints"],components:{GofrElement:a["a"]},data:function(){return{value:{system:"",code:"",display:""},valueCode:"",valueDisplay:"",loading:!0,errors:[],items:[],source:{path:"",data:{},binding:this.binding},disabled:!1,lockWatch:!1}},created:function(){this.setupData()},watch:{slotProps:{handler:function(){this.lockWatch||this.setupData()},deep:!0},valueCode:function(t){var e=this;if(this.items){var s=this.items.find((function(e){return e.code===t}));s&&(this.value=s)}this.value.system&&this.value.code&&this.$fhirutils.codeLookup(this.value.system,this.value.code,this.binding||this.source.binding).then((function(t){e.valueDisplay=t}))}},methods:{setupData:function(){var t=this;if(this.slotProps&&this.slotProps.source){if(this.source={path:this.slotProps.source.path+"."+this.field,data:{},binding:this.binding||this.slotProps.source.binding},this.slotProps.source.fromArray)this.source.data=this.slotProps.source.data,this.source.data&&(this.value=this.source.data,this.valueCode=this.value.code,this.lockWatch=!0);else{var e=this.$fhirutils.pathFieldExpression(this.field);this.source.data=this.$fhirpath.evaluate(this.slotProps.source.data,e),this.source.data[0]&&(this.value=this.source.data[0],this.valueCode=this.value.code,this.lockWatch=!0)}this.disabled=this.readOnlyIfSet&&!!this.valueCode}var s=this.binding||this.slotProps.source.binding;this.$fhirutils.expand(s).then((function(e){t.items=e,t.loading=!1})).catch((function(e){console.log(e),t.errors=e.message,t.loading=!1}))}},computed:{index:function(){return this.slotProps&&this.slotProps.input?this.slotProps.input.index:void 0},display:function(){return this.slotProps&&this.slotProps.input?this.slotProps.input.label:this.label},required:function(){return(this.index||0)<this.min},rules:function(){var t=this;return this.required?[function(e){return!!e||t.display+" is required"}]:[]}}},r=n,l=s("2877"),d=s("6544"),u=s.n(d),c=s("b974"),h=Object(l["a"])(r,i,o,!1,null,null,null);e["default"]=h.exports;u()(h,{VSelect:c["a"]})}}]);
//# sourceMappingURL=chunk-5e71a7f0.846756e5.js.map