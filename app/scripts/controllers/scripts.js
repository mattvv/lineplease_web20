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
  .controller('ScriptNewController', ['flash', 'ParseQueryAngular', 'ScriptService', 'ConversionService', '$state', '$scope', '$rootScope',
   function(flash, ParseQueryAngular, ScriptService, ConversionService, $state, $scope, $rootScope) {
    $scope.docData = null;
    $scope.filename = null;

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

    $scope.importScript = function(name, filename) {
      var file = new Parse.File($scope.filename, { base64: $scope.docData });
      $rootScope.isViewLoading = true;

      ParseQueryAngular(file, {functionToCall: 'save', params:null}).then(function() {
        var conversion = new ConversionService.model();
        conversion.set('name', name);
        conversion.set('username', Parse.User.current().get('username'));
        conversion.set('user', Parse.User.current());
        conversion.set('file', file);
        return conversion.saveParse();
      }).then(function(conversion) {
        conversion.enqueue();
      }).then(function() {
        $rootScope.isViewLoading = false;
        $state.transitionTo('conversions');
      }, function(error) {
        $rootScope.isViewLoading = false;
        flash.error = error;
      })

    }

   $('#upload').change(function() {
      var filename = $('#upload').val().split('/').pop().split('\\').pop();
      $scope.$apply(function() {
        $scope.filename = filename;
      })
    });

    $scope.$watch('upload', function(newVal) {
      if (newVal) {
        var matches = newVal.match(/^data:.+\/(.+);base64,(.*)$/);
        var base64Data = matches[2];
        $scope.docData = base64Data;
      }
    })
  }])