"use strict";angular.module("iframeScaffolder",["ngSanitize","ui.router","zeroclipboard","ui.bootstrap"]).config(["$stateProvider","$urlRouterProvider","$sceProvider","$tooltipProvider","uiZeroclipConfigProvider",function(e,t,a,l,i){e.state("home",{url:"/?urls&layout",params:{urls:{value:""},layout:{value:"menu"}},templateUrl:"app/main/main.html",controller:"MainCtrl"}).state("view",{url:"/view?urls&layout",templateUrl:"app/view/view.html",controller:"ViewCtrl"}),t.otherwise("/"),a.enabled(!1),l.options({appendToBody:!0}),i.setZcConf({swfPath:"./assets/swf/ZeroClipboard.swf"})}]),angular.module("iframeScaffolder").controller("ViewCtrl",["$scope","$stateParams",function(e,t){e.layout=t.layout,e.urls=t.urls.split(",")}]),angular.module("iframeScaffolder").controller("MainCtrl",["$scope","$state","$stateParams","$http","Scaffolder",function(e,t,a,l,i){e.scaffolder=new i,e.layout=a.layout||"menu",e.urls=""===a.urls?[]:a.urls.split(","),e.width=600,e.height=450,e.examples=[],l.get("assets/examples.json").success(function(t){e.examples=t}),e.addUrl=function(){e.newUrl&&(e.urls.push(e.newUrl),e.newUrl=null)},e.removeUrl=function(t){e.urls.splice(t,1)},e.getViewUrl=function(){var a={urls:e.urls.join(","),layout:e.layout};return t.href("view",a,{absolute:!0})},e.getViewIframe=function(){var t=e.getViewUrl(),a=e.width||600,l=e.height||450;return"<iframe src="+t+' width="'+a+'" height="'+l+'" frameborder="0" allowfullscreen></iframe>'},e.pickExample=function(){var t=e.examples[Math.floor(Math.random()*e.examples.length)];angular.extend(e,angular.copy(t))},e.editLabel=function(t){e.labels={},e.labels[t]=e.scaffolder.label(t,"")},e.saveLabel=function(t){var a=e.labels[t]||"";e.labels={},e.urls[t]=""!==a?a+"|"+e.scaffolder.url(t,!0):e.scaffolder.url(t,!0)},e.$watch("urls + layout",function(){e.scaffolder=new i(e.urls,e.layout)},!0)}]),angular.module("iframeScaffolder").controller("ScaffolderCtrl",["$scope","Scaffolder",function(e,t){e.scaffolder=new t,e.iframeWidth=function(){switch(e.layout){case"horizontal":return 100/e.urls.length+"%";case"tail":return"50%";case"head":return"50%";case"menu":return"75%";case"tabs":return"100%"}},e.iframeHeight=function(t,a,l){return"horizontal"===e.layout||"menu"===e.layout||"head"===e.layout&&a||"tail"===e.layout&&l?"100%":"tabs"===e.layout?"auto":100/(e.urls.length-1)+"%"},e.$watch("urls + layout",function(){e.scaffolder=new t(e.urls,e.layout)},!0)}]),angular.module("iframeScaffolder").directive("scaffolder",function(){return{restrict:"E",controller:"ScaffolderCtrl",templateUrl:"components/scaffolder/scaffolder.html",scope:{urls:"=",layout:"="}}}),angular.module("iframeScaffolder").service("Scaffolder",function(){function e(e,t,a){return angular.extend(this,{urls:e||[],layout:t||"menu"}),this.activate(a||0),this}return e.prototype.url=function(e,t){var a=this.urls[e];return this.isVisible(e)||t?this.hasLabel(e)?a.split("|")[1]:a:void 0},e.prototype.isActive=function(e){return e===this.active},e.prototype.activate=function(e){this.active=e<this.urls.length?e:0},e.prototype.isVisible=function(e){return!this.hasMenu()||this.isActive(e)},e.prototype.hasLabel=function(e){return this.urls[e].indexOf("|http")>-1},e.prototype.label=function(e,t){var a=this.urls[e];return this.hasLabel(e)?a.split("|")[0]:"undefined"!=typeof t&&null!==t?t:a},e.prototype.hasMenu=function(){return["menu","tabs"].indexOf(this.layout)>-1},e}),function(e){try{e=angular.module("iframeScaffolder")}catch(t){e=angular.module("iframeScaffolder",[])}e.run(["$templateCache",function(e){e.put("app/main/main.html",'<div class="introduction"><div class="container"><h2>Iframe Scaffolder</h2><p class="lead text-muted">This tool helps you to quickly arrange several iframes together.</p></div></div><div class="container"><div class="row editor"><div class="col-md-4"><div class="panel editor__step panel-default"><div class="editor__step__label"></div><form class="panel-body" role="form" ng-submit="addUrl()"><div class="input-group"><input type="url" required="" ng-model="newUrl" class="form-control" placeholder="URL of a new iframe"> <span class="input-group-btn"><button class="btn btn-primary" type="submit" tooltip="Create an iframe with this URL">Add</button></span></div></form><ul class="list-group"><li class="list-group-item editor__step__url" ng-repeat="url in urls track by $index"><div><div class="btn-group btn-group-xs pull-right editor__step__url__actions"><button type="button" class="btn btn-default" tooltip="Change the label describing this iframe" ng-click="editLabel($index)">Edit label</button> <button type="button" class="btn btn-default" ng-click="removeUrl($index)" tooltip="Remove this iframe"><i class="glyphicon glyphicon-trash"></i></button></div><a ng-href="{{scaffolder.url($index, true)}}" target="_blank" class="editor__step__url__value">{{scaffolder.label($index)}}</a></div><form ng-submit="saveLabel($index)" ng-show="labels[$index] || labels[$index] === \'\'" class="editor__step__url__edit-label"><div class="input-group input-group-sm"><input type="text" ng-model="labels[$index]" class="form-control"> <span class="input-group-btn"><button class="btn btn-default" type="submit">Save</button></span></div></form></li></ul></div><div class="panel editor__step panel-default" ng-class="{ \'editor__step--disable\': !urls.length }"><div class="editor__step__label"></div><div class="panel-body"><p>Choose a layout&nbsp; <small class="text-muted">(how iframes are arranged)</small></p><div class="text-center"><button class="btn btn-default" ng-class="{active: $parent.layout == \'menu\'}" ng-click="$parent.layout = \'menu\'" tooltip="Toggle iframes using a menu">≡◻</button> <button class="btn btn-default" ng-class="{active: $parent.layout == \'tabs\'}" ng-click="$parent.layout = \'tabs\'" tooltip="Toggle iframes using tabs">⎍⎍</button> <button class="btn btn-default" ng-class="{active: $parent.layout == \'horizontal\'}" ng-click="$parent.layout = \'horizontal\'" tooltip="All iframes have equal width">▯▯▯</button> <button class="btn btn-default" ng-class="{active: $parent.layout == \'head\'}" ng-click="$parent.layout = \'head\'" tooltip="The first iframe use half of the screen, the others a stacked">▯▤</button> <button class="btn btn-default" ng-class="{active: $parent.layout == \'tail\'}" ng-click="$parent.layout = \'tail\'" tooltip="The last iframe use half of the screen, the others a stacked">▤▯</button></div></div></div><div class="panel editor__step panel-default" ng-class="{ \'editor__step--disable\': !urls.length }"><div class="editor__step__label"></div><div class="panel-body"><p><button class="btn btn-default btn-xs pull-right" ui-zeroclip="" zeroclip-model="getViewIframe()" tooltip="Copy the embed code to you clipboard.">Copy</button> Export the iframe</p><p><textarea class="form-control" readonly="">{{getViewIframe()}}</textarea></p><div class="text-muted"><div class="pull-left">Change the size&nbsp;</div><div class="text-right"><input type="number" ng-model="width" min="50" class="form-control input-sm editor__step__size"> x <input type="number" ng-model="height" min="50" class="form-control input-sm editor__step__size"></div></div></div></div><div class="text-muted small editor__credits hidden-xs hidden-sm"><div class="media"><a class="media-left media-middle" href="http://twitter.com/pirhoo" target="_blank"><img src="https://secure.gravatar.com/avatar/f514016d15f3d5409177c1031eedb0a5?s=24" class="img-circle img-thumbnail"></a><div class="media-body">Hi, I\'m <a href="http://twitter.com/pirhoo" target="_blank">@pirhoo</a>. &nbsp;You can fork this tool<br>or report an issue &nbsp;<a href="http://github.com/pirhoo/iframe-scaffolder/">on Github</a>!</div></div></div></div><div class="col-md-8"><div class="panel panel-default editor__preview"><div class="editor__preview__empty-alert" ng-hide="urls.length"><div class="lead editor__preview__empty-alert__message"><p>Add an iframe\'s URL on the <span class="hidden-sm hidden-xs">left&nbsp;</span>panel to preview the mosaic here.</p><p><a ng-click="pickExample()" class="btn btn-link" ng-show="examples.length">See an example.</a> {{example}}</p></div></div><div class="panel-heading"><div class="input-group"><input class="form-control" type="text" value="{{getViewUrl()}}" readonly=""> <span class="input-group-btn"><a class="btn btn-link" href="{{getViewUrl()}}" target="_blank" tooltip="Open the iframe in a new window"><i class="glyphicon glyphicon-new-window"></i></a></span></div></div><div class="editor__preview__scaffolder"><scaffolder urls="urls" layout="layout"></scaffolder></div></div></div></div></div>')}])}(),function(e){try{e=angular.module("iframeScaffolder")}catch(t){e=angular.module("iframeScaffolder",[])}e.run(["$templateCache",function(e){e.put("app/view/view.html",'<div class="view"><div class="view__scaffolder"><scaffolder urls="urls" layout="layout"></scaffolder></div></div>')}])}(),function(e){try{e=angular.module("iframeScaffolder")}catch(t){e=angular.module("iframeScaffolder",[])}e.run(["$templateCache",function(e){e.put("components/scaffolder/scaffolder.html",'<div class="scaffolder scaffolder--{{layout}}"><aside ng-show="scaffolder.hasMenu()" class="scaffolder__menu"><ul class="nav nav-pills" ng-class="{\n        \'nav-stacked\': layout === \'menu\'\n      }"><li ng-repeat="url in urls track by $index" ng-class="{\n            \'active\': scaffolder.isActive($index)\n          }" class="scaffolder__menu__item"><a ng-click="scaffolder.activate($index)">{{scaffolder.label($index, "Iframe " + ($index+1))}}</a></li></ul></aside><iframe frameborder="0" class="scaffolder__iframe" width="{{iframeWidth($index, $first, $last)}}" height="{{iframeHeight($index, $first, $last)}}" ng-class="{\'scaffolder__iframe--last\': $last, \'scaffolder__iframe--first\': $first}" ng-src="{{scaffolder.url($index)}}" ng-show="scaffolder.isVisible($index)" ng-repeat="url in urls track by $index"></iframe></div>')}])}();