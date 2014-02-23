"use strict";angular.module("linepleaseApp",["ui.router","ParseServices","FacebookPatch","ExternalDataServices","ui.sortable","angular-flash.service","angular-flash.flash-alert-directive","underscore","ui.autocomplete","usersControllers","scriptsControllers","profilesControllers","linesControllers","conversionsControllers"]).config(["$stateProvider","$urlRouterProvider",function(a,b){a.state("home",{url:"/",templateUrl:"views/home.html",controller:"HomeController",menu:"hidden"}).state("users_new",{url:"/users/new",templateUrl:"views/users/new.html",menu:"hidden"}).state("login",{url:"/login",templateUrl:"views/users/login.html",controller:"LoginController",menu:"hidden"}).state("logout",{url:"/logout",templateUrl:"views/users/login.html",controller:"LogoutController"}).state("forgot_password",{url:"/forgot_password",templateUrl:"views/users/forgot_password.html",controller:"ForgotPasswordUsersController",menu:"hidden"}).state("scripts",{url:"/scripts",templateUrl:"views/scripts/index.html",controller:"ScriptIndexController",resolve:{scripts:["ScriptService",function(a){var b=new a.collection;return b.loadMyScripts()}]},title:"Scripts"}).state("scripts_new",{url:"/scripts/new",templateUrl:"views/scripts/new.html",controller:"ScriptNewController",title:"Create Script"}).state("lines",{url:"/scripts/:scriptId",templateUrl:"views/lines/index.html",controller:"LineIndexController",resolve:{lines:["LineService","$stateParams",function(a,b){var c=new a.collection;return c.loadLines(b.scriptId)}]},lineview:!0}).state("profile",{url:"/profile",templateUrl:"views/profile/index.html",controller:"ProfileIndexController"}).state("conversions",{url:"/conversions",templateUrl:"views/conversions/index.html",controller:"ConversionIndexController",resolve:{conversions:["ConversionService",function(a){var b=new a.collection;return b.loadMyConversions()}]},title:"Conversions"}),b.otherwise("/scripts")}]).run(["ParseSDK","ExtendParseSDK","$rootScope","$location","flash","_",function(a,b,c,d,e,f){c.$on("$stateChangeStart",function(a,b){e.clean(),c.menu=b.menu,c.title=b.title,c.lineview=b.lineview,c.isViewLoading=!0,$(".menu").hide()}),c.$on("$stateChangeSuccess",function(){c.isViewLoading=!1}),$(".navbar ul li a").on("click",function(){$(this).parent().parent().find("ul").toggle(400)}),$(".blur").blurjs({source:"body",radius:7,overlay:"rgba(255,255,255,0.4)"}),c.$watch(function(){return d.path()},function(a){var b=["/login","/users/new","/","/forgot_password"];Parse.User.current()&&Parse.User.current().fetch(),Parse.User.current()||f.contains(b,a)||d.path("/")})}]),angular.module("linepleaseApp").filter("fromNow",function(){return function(a){return moment(new Date(a)).fromNow()}}),angular.module("linepleaseApp").directive("ngReallyClick",[function(){return{restrict:"A",link:function(a,b,c){b.bind("click",function(){var b=c.ngReallyMessage;b&&confirm(b)&&a.$apply(c.ngReallyClick)})}}}]),angular.module("linepleaseApp").directive("fileread",[function(){return{scope:{fileread:"="},link:function(a,b){b.bind("change",function(b){var c=new FileReader;c.onload=function(b){a.$apply(function(){a.fileread=b.target.result})},c.readAsDataURL(b.target.files[0])})}}}]);var usersControllers=angular.module("usersControllers",[]);usersControllers.controller("HomeController",["$scope","$location",function(a,b){a.fbLogin=function(){null===Parse.User.current()&&b.path("/scripts"),Parse.FacebookUtils.logIn(null,{success:function(){b.path("/scripts")},error:function(){console.log("User cancelled the Facebook login or did not fully authorize.")}})}}]).controller("LoginController",["$scope","$location",function(a,b){a.email="",a.password="",a.keep=!0,a.login=function(c,d){Parse.User.logIn(c,d,{success:function(){b.path("/scripts"),a.$apply()},error:function(){a.loginForm.badCredentials=!0,a.$apply()}})}}]).controller("LogoutController",["$scope","$location",function(a,b){Parse.User.logOut(),b.path("/")}]).controller("ForgotPasswordUsersController",["$scope","$location","flash","$rootScope",function(a,b,c,d){console.log("in forgotpassword users controller"),a.email="",a.resetPassword=function(b){d.isViewLoading=!0,Parse.User.requestPasswordReset(b).then(function(){d.isViewLoading=!1,c.success="Please check your email - your password has been sent!",a.$apply()},function(b){d.isViewLoading=!1,c.error="Could not find your email - please try adding a space at the end",a.$apply(),console.log(b)})}}]);var scriptsControllers=angular.module("scriptsControllers",[]);scriptsControllers.controller("ScriptIndexController",["$scope","$location","scripts","$rootScope",function(a,b,c,d){a.scripts=c.models,a.openScript=function(a){console.log("openscript "+a.get("name")),b.path("/scripts/"+a.id)},a.removeScript=function(b){d.isViewLoading=!0,b.deleteScript().then(function(){var c=a.scripts.indexOf(b);c>-1&&a.scripts.splice(c,1),d.isViewLoading=!1},function(a){d.isViewLoading=!1,console.log("could not delete script "+a)})}}]).controller("ScriptNewController",["flash","ParseQueryAngular","ScriptService","ConversionService","$state","$scope","$rootScope","_",function(a,b,c,d,e,f,g,h){f.docData=null,f.filename=null,f.createScript=function(a){var b=new c.model;b.set("name",a),b.set("username",Parse.User.current().get("username")),b.set("user",Parse.User.current()),g.isViewLoading=!0,b.saveParse().then(function(){e.transitionTo("scripts")})},f.importScript=function(c){var i=new Parse.File(f.filename,{base64:f.docData});g.isViewLoading=!0,h.isEmpty(c)&&(c="Conversion"),b(i,{functionToCall:"save",params:null}).then(function(){var a=new d.model;return a.set("name",c),a.set("username",Parse.User.current().get("username")),a.set("user",Parse.User.current()),a.set("file",i),a.saveParse()}).then(function(a){a.enqueue()}).then(function(){g.isViewLoading=!1,e.transitionTo("conversions")},function(b){g.isViewLoading=!1,a.error=b})},$("#upload").change(function(){var a=$("#upload").val().split("/").pop().split("\\").pop();f.$apply(function(){f.filename=a})}),f.$watch("upload",function(a){if(a){var b=a.match(/^data:.+\/(.+);base64,(.*)$/),c=b[2];f.docData=c}})}]);var linesControllers=angular.module("linesControllers",[]);linesControllers.controller("LineIndexController",["LineService","$stateParams","$scope","$location","lines","ParseCloudCodeAngular","_","$rootScope",function(a,b,c,d,e,f,g,h){c.lines=e.models,c.gender="female",c.autocompleteOptions={options:{html:!0,focusOpen:!0,onlySelect:!1,source:function(a,b){var d=c.autocompleteOptions.methods.filter(c.characters,a.term);b(d)}}},c.cacheCharacters=function(){c.characters=[],g.each(c.lines,function(a){g.contains(c.characters,a.get("character"))||c.characters.push(a.get("character"))})},c.cacheCharacters(),c.sortableOptions={update:function(a,d){for(var e in c.lines){var g=c.lines[e];g.id===$(d.item).attr("id")&&f("reorderLines",{lineId:g.id,position:$(d.item).index(),scriptId:b.scriptId})}}},c.$watch("character",function(a){"undefined"!=typeof a&&a.length>0&&(c.character=a.toUpperCase())}),c.createLine=function(d,e,f){var g=new a.model;g.set("scriptId",b.scriptId),g.set("character",d.toUpperCase()),g.set("line",e),g.set("gender",f),h.isViewLoading=!0,g.saveParse().then(function(a){h.isViewLoading=!1,c.linetext="",c.lines.push(a),c.cacheCharacters()},function(a){h.isViewLoading=!1,console.log("Error!! "+JSON.stringify(a))})},c.removeLine=function(a){h.isViewLoading=!0,a.deleteLine().then(function(){var b=c.lines.indexOf(a);b>-1&&c.lines.splice(b,1),h.isViewLoading=!1},function(a){h.isViewLoading=!1,console.log("could not delete line "+a)})}}]);var profilesControllers=angular.module("profilesControllers",[]);profilesControllers.controller("ProfileIndexController",["$scope","$location",function(a,b){a.logOut=function(){Parse.User.logOut(),b.path("/")}}]);var conversionsControllers=angular.module("conversionsControllers",[]);conversionsControllers.controller("ConversionIndexController",["$scope","$location","conversions",function(a,b,c){a.conversions=c.models,a.openScript=function(a){void 0!==typeof a.scriptId&&b.path("/scripts/"+a.get("scriptId"))}}]),angular.module("ExternalDataServices").factory("ScriptService",["ParseCloudCodeAngular",function(a){var b=Parse.Object.extendAngular({className:"Script",deleteScript:function(){return a("removeScript",{scriptId:this.id})}}),c=Parse.Collection.extendAngular({model:b,query:new Parse.Query(b),comparator:function(a){return-a.createdAt.getTime()},loadMyScripts:function(){var a=new Parse.Query(b);return a.equalTo("username",Parse.User.current().get("username")),this.query=Parse.Query.or(a),this.load()}});return{model:b,collection:c}}]),angular.module("ExternalDataServices").factory("LineService",["ParseCloudCodeAngular",function(a){var b=Parse.Object.extendAngular({className:"Line",deleteLine:function(){return a("removeLine",{lineId:this.id})}}),c=Parse.Collection.extendAngular({model:b,query:new Parse.Query(b),comparator:function(a){return-a.position},loadLines:function(a){return this.query=new Parse.Query(b),this.query.equalTo("scriptId",a),this.query.limit(1e3),this.query.ascending("position"),this.load()}});return{model:b,collection:c}}]),angular.module("ExternalDataServices").factory("ConversionService",["ParseCloudCodeAngular",function(a){var b=Parse.Object.extendAngular({className:"Conversion",enqueue:function(){return console.log("queuing!"),a("conversion",{conversionId:this.id})}}),c=Parse.Collection.extendAngular({model:b,query:new Parse.Query(b),comparator:function(a){return-a.createdAt.getTime()},loadMyConversions:function(){return this.query=new Parse.Query(b),this.query.equalTo("username",Parse.User.current().get("username")),this.load()}});return{model:b,collection:c}}]);