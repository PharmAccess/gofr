(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0b8b5d"],{"309c":function(t,s,i){"use strict";i.r(s);var e=function(){var t=this,s=t.$createElement,i=t._self._c||s;return i("div",[t._t("default",null,{source:t.source})],2)},o=[],a={name:"fhir-codeable-concept",props:["field","slotProps","sliceName","min","max","base-min","base-max","label","path","binding","edit","constraints"],data:function(){return{source:{path:"",data:{},binding:this.binding},errors:[]}},created:function(){this.setupData()},watch:{slotProps:{handler:function(){this.setupData()},deep:!0}},methods:{setupData:function(){if(this.slotProps&&this.slotProps.source)if(this.source={path:this.slotProps.source.path+"."+this.field,data:{},binding:this.binding},this.slotProps.source.fromArray)this.source.data=this.slotProps.source.data;else{var t=this.$fhirutils.pathFieldExpression(this.field);this.source.data=this.$fhirpath.evaluate(this.slotProps.source.data,t)}}},computed:{display:function(){return this.slotProps&&this.slotProps.input?this.slotProps.input.label:this.label}}},r=a,n=i("2877"),l=Object(n["a"])(r,e,o,!1,null,null,null);s["default"]=l.exports}}]);
//# sourceMappingURL=chunk-2d0b8b5d.c355bc75.js.map