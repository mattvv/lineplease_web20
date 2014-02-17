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

      $scope.removeScript = function(script) {
        console.log('really remove!!! ' + script.id);

        script.deleteScript().then(function() {
          var index = $scope.scripts.indexOf(script);

          if (index > -1) {
            $scope.scripts.splice(index, 1);
          }
        }, function(error) {
          console.log('could not delete script ' + error);
        });
      }
  	}])
  .controller('ScriptNewController', ['ScriptService', '$state', '$scope', function(ScriptService, $state, $scope) {
    $scope.createScript = function(name) {
      //create a new script
      var script = new ScriptService.model();
      script.set('name', name);
      script.set('username', Parse.User.current().get('username'));
      script.set('user', Parse.User.current());
      //todo: some kind of loader needs to be put in
      script.saveParse().then(function() {
        $state.transitionTo('scripts');
      });
    }
  }])