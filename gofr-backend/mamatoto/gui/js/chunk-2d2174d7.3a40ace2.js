(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d2174d7"],{c5c2:function(e,t,n){"use strict";n.r(t);var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.edit?e._e():n("v-container",{staticClass:"my-3"},[n("v-data-table",{staticClass:"elevation-1",attrs:{headers:e.columns,items:e.items,"item-key":"id","items-per-page":5,loading:e.loading,dense:""},scopedSlots:e._u([{key:"top",fn:function(){return[n("v-toolbar",{attrs:{flat:"",color:"white"}},[n("v-toolbar-title",[e._v(" "+e._s(e.$t("App.fhir-resources-texts."+e.title))+" ")]),n("v-spacer"),e._l(e.topActions,(function(t){return n("v-btn",{key:t.text,attrs:{to:e.setupLink(t.link,{}),color:t.class,small:""}},[e._v(" "+e._s(t.text)+" ")])}))],2)]},proxy:!0},{key:"item._action",fn:function(t){var r=t.item;return e._l(r.actions,(function(t){return n("v-btn",{key:t.text,attrs:{to:e.setupLink(t.link,r),color:t.class,small:"",rounded:""}},[e._v(" "+e._s(e.$t("App.fhir-resources-texts."+t.text))+" ")])}))}}],null,!1,1456901422)})],1)},a=[],s=n("b85c"),i=n("1da1"),c=(n("96cf"),n("ac1f"),n("1276"),n("a15b"),n("4de4"),n("9911"),n("7db0"),n("d3b7"),n("3ca3"),n("ddb0"),n("d81d"),n("5319"),n("bc3a")),o=n.n(c),u=function(e){return!!e&&e.constructor===Object},l={name:"gofr-secondary",props:["title","field","profile","slotProps","link-id","link-field","search-field","edit","columns","actions"],data:function(){return{source:{data:{},path:this.field},empty:!0,items:[],loading:!0,topActions:[]}},mounted:function(){this.setupData()},watch:{},methods:{setupData:function(){var e;if(2===this.searchField.split(":").length){var t=this.searchField.split(":")[0];e="fhir/"+this.$store.state.config.userConfig.FRDatasource+"/"+t+"?_id="+this.linkId+"&_include="+this.searchField}else{e="/fhir/"+this.$store.state.config.userConfig.FRDatasource+"/"+this.field;var n=[];this.profile&&n.push("_profile="+this.profile),this.searchField?n.push(this.searchField+"="+this.linkId):n.push(this.linkField.substring(this.linkField.indexOf(".")+1)+"="+this.linkId),e+="?"+n.join("&")}this.items=[],this.loading=!0,this.addItems(e)},addItems:function(e){var t=this;o.a.get(e).then(function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(n){var r,a,i,c,o,u,l,p,f,d,h,b,k,v,m,x,y,g;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(r=n.data,!(r.entry&&r.entry.length>0)){e.next=53;break}a=Object(s["a"])(r.entry),e.prev=3,a.s();case 5:if((i=a.n()).done){e.next=43;break}if(c=i.value,2!==t.searchField.split(":").length||c.resource.resourceType!==t.searchField.split(":")[0]){e.next=9;break}return e.abrupt("continue",41);case 9:o={id:c.resource.id},u=Object(s["a"])(t.columns),e.prev=11,u.s();case 13:if((l=u.n()).done){e.next=29;break}if(p=l.value,"_action"!==p.value){e.next=17;break}return e.abrupt("continue",27);case 17:return e.prev=17,f=t.$fhirpath.evaluate(c.resource,p.value),e.next=21,t.processContent(f);case 21:o[p.value]=e.sent,e.next=27;break;case 24:e.prev=24,e.t0=e["catch"](17),console.log(e.t0);case 27:e.next=13;break;case 29:e.next=34;break;case 31:e.prev=31,e.t1=e["catch"](11),u.e(e.t1);case 34:return e.prev=34,u.f(),e.finish(34);case 37:o.actions||(o.actions=[]),d=Object(s["a"])(t.actions);try{for(d.s();!(h=d.n()).done;)b=h.value,b.row?b.condition?(k=t.$fhirpath.evaluate(c.resource,b.condition),k.every((function(e){return e}))&&o.actions.push(b)):o.actions.push(b):b.condition?(v=t.$fhirpath.evaluate(c.resource,b.condition),b.hasOwnProperty("meets")?b.meets=b.meets&&v.every((function(e){return e})):b.meets=v.every((function(e){return e}))):b.meets=!0}catch(w){d.e(w)}finally{d.f()}t.items.push(o);case 41:e.next=5;break;case 43:e.next=48;break;case 45:e.prev=45,e.t2=e["catch"](3),a.e(e.t2);case 48:return e.prev=48,a.f(),e.finish(48);case 51:e.next=55;break;case 53:m=Object(s["a"])(t.actions);try{for(m.s();!(x=m.n()).done;)y=x.value,y.row||(y.meets=y.emptyDisplay)}catch(w){m.e(w)}finally{m.f()}case 55:t.topActions=t.actions.filter((function(e){return!e.row&&e.meets})),r.link?(g=r.link.find((function(e){return"next"===e.relation})),g?t.addItems(g.url):t.loading=!1):t.loading=!1;case 57:case"end":return e.stop()}}),e,null,[[3,45,48,51],[11,31,34,37],[17,24]])})));return function(t){return e.apply(this,arguments)}}()).catch((function(e){t.loading=!1,console.log(e)}))},processContent:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(t){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(!Array.isArray(t)){e.next=7;break}return e.next=3,Promise.all(t.map(this.processContent));case 3:return n=e.sent,e.abrupt("return",n.join(" "));case 7:if(!u(t)){e.next=32;break}if(!t.code||!t.system){e.next=14;break}return e.next=11,this.$fhirutils.codeLookup(t.system,t.code);case 11:return e.abrupt("return",e.sent);case 14:if(!t.display){e.next=18;break}return e.abrupt("return",t.display);case 18:if(!t.code){e.next=22;break}return e.abrupt("return",t.code);case 22:if(!t.reference){e.next=28;break}return e.next=25,this.$fhirutils.resourceLookup(t.reference);case 25:return e.abrupt("return",e.sent);case 28:return console.log("Unable to process content:",t),e.abrupt("return","Unknown");case 30:e.next=33;break;case 32:return e.abrupt("return",t);case 33:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}(),setupLink:function(e,t){return e.replace("ITEMID",t.id).replace("FHIRID",this.linkId)}}},p=l,f=n("2877"),d=n("6544"),h=n.n(d),b=n("8336"),k=n("a523"),v=n("8fea"),m=n("2fa4"),x=n("71d9"),y=n("2a7f"),g=Object(f["a"])(p,r,a,!1,null,null,null);t["default"]=g.exports;h()(g,{VBtn:b["a"],VContainer:k["a"],VDataTable:v["a"],VSpacer:m["a"],VToolbar:x["a"],VToolbarTitle:y["b"]})}}]);
//# sourceMappingURL=chunk-2d2174d7.3a40ace2.js.map