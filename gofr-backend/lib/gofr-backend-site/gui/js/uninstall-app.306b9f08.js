(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["uninstall-app"],{"37b0":function(t,a,e){"use strict";e.r(a);var s=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("v-container",[e("center",[e("v-card",{attrs:{"min-height":"200","max-width":"500",rounded:"",shaped:""}},[e("v-card-title",{attrs:{"primary-title":""}},[t._v(" "+t._s(t.$t("App.hardcoded-texts.Select App to Uninstall"))+" ")]),t.loadingApps?e("v-progress-linear",{attrs:{indeterminate:!0}}):e("v-card-text",[e("v-layout",{attrs:{row:"",wrap:""}},[t._l(t.apps,(function(a,s){return e("v-flex",{key:s,attrs:{xs3:""}},[e("v-card",{attrs:{"max-width":"110",height:"210",rounded:""}},[e("v-card-text",[e("v-tooltip",{attrs:{top:""},scopedSlots:t._u([{key:"activator",fn:function(s){var n=s.on,r=s.attrs;return[e("v-btn",t._g(t._b({attrs:{icon:"",large:"",color:"red"},on:{click:function(e){return t.uninstall(a)}}},"v-btn",r,!1),n),[e("v-icon",[t._v("mdi-minus")])],1)]}}],null,!0)},[e("span",[t._v(t._s(t.$t("App.hardcoded-texts.Uninstall")+" "+a.app_short_name))])]),e("v-avatar",{attrs:{color:"primary",size:"90"}},[e("v-img",{attrs:{src:a.iconBase64}})],1),e("div",{staticStyle:{"text-align":"center"}},[t._v(" "+t._s(a.name)+" ")])],1)],1)],1)})),e("v-spacer")],2)],1)],1)],1)],1)},n=[],r=e("bc3a"),i=e.n(r),o={data:function(){return{apps:[],loadingApps:!1}},methods:{getApps:function(){var t=this;this.loadingApps=!0,i.a.get("/apps/installed").then((function(a){t.apps=a.data,t.loadingApps=!1}))},uninstall:function(t){var a=this;this.loadingApps=!0,i.a.delete("/apps/uninstall/"+t.app_short_name).then((function(){a.getApps(),a.$store.state.message.active=!0,a.$store.state.message.type="success",a.$store.state.message.text="App Uninstalled Successfully"})).catch((function(){a.$store.state.message.text="Oops, something went wrong, App Failed to uninstall",a.$store.state.message.active=!0,a.$store.state.message.type="red accent-2"}))}},created:function(){this.getApps()}},p=o,c=e("2877"),l=e("6544"),d=e.n(l),u=e("8212"),v=e("8336"),g=e("b0af"),h=e("99d9"),m=e("a523"),f=e("0e8f"),_=e("132d"),x=e("adda"),A=e("a722"),V=e("8e36"),w=e("2fa4"),y=e("3a2f"),b=Object(c["a"])(p,s,n,!1,null,null,null);a["default"]=b.exports;d()(b,{VAvatar:u["a"],VBtn:v["a"],VCard:g["a"],VCardText:h["c"],VCardTitle:h["d"],VContainer:m["a"],VFlex:f["a"],VIcon:_["a"],VImg:x["a"],VLayout:A["a"],VProgressLinear:V["a"],VSpacer:w["a"],VTooltip:y["a"]})}}]);
//# sourceMappingURL=uninstall-app.306b9f08.js.map