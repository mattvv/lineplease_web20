'use strict';
/*gloabl Parse:false*/

var scriptsControllers = angular.module('scriptsControllers', []);
scriptsControllers
  .controller('ScriptIndexController', ['$scope', '$location', 'scripts', 
  	function ($scope, $location, scripts) {
  		$scope.scripts = scripts.models;

  		$scope.openScript = function(script) {
  			console.log('openscript ' + script.get('name'));
  			$location.path('/scripts/' + script.id);
  		}
  	}])
  .controller('ScriptNewController', [function() {

  }])