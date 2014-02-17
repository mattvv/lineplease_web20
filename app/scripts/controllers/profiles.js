'use strict';
/*gloabl Parse:false*/

var profilesControllers = angular.module('profilesControllers', []);
profilesControllers
  .controller('ProfileIndexController', ['$scope', '$location', 
  	function ($scope, $location) {
  		$scope.logOut = function() {
		    Parse.User.logOut();
		    $location.path('/');
  		}
  	}])