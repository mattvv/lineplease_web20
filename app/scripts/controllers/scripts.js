'use strict';
/*gloabl Parse:false*/

var scriptsControllers = angular.module('scriptsControllers', []);
scriptsControllers
  .controller('ScriptIndexController', ['$scope', '$location', 'scripts', '$rootScope',
  	function ($scope, $location, scripts, $rootScope) {
  		$scope.scripts = scripts.models;

  		$scope.openScript = function(script) {
  			console.log('openscript ' + script.get('name'));
  			$location.path('/scripts/' + script.id);
  		}

      $scope.removeScript = function(script) {
        $rootScope.isViewLoading = true;
        script.deleteScript().then(function() {
          var index = $scope.scripts.indexOf(script);

          if (index > -1) {
            $scope.scripts.splice(index, 1);
          }
          $rootScope.isViewLoading = false;
        }, function(error) {
          $rootScope.isViewLoading = false;
          console.log('could not delete script ' + error);
        });
      }
  	}])
  .controller('ScriptNewController', ['ScriptService', '$state', '$scope', '$rootScope',
   function(ScriptService, $state, $scope, $rootScope) {
    $scope.createScript = function(name) {
      //create a new script
      var script = new ScriptService.model();
      script.set('name', name);
      script.set('username', Parse.User.current().get('username'));
      script.set('user', Parse.User.current());
      $rootScope.isViewLoading = true;
      script.saveParse().then(function() {
        $state.transitionTo('scripts');
      });
    }
  }])