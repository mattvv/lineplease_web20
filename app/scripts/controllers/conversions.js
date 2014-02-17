'use strict';
/*gloabl Parse:false*/

var conversionsControllers = angular.module('conversionsControllers', []);
conversionsControllers
  .controller('ConversionIndexController', ['$scope', '$location', 'conversions', 
  	function ($scope, $location, conversions) {
  		$scope.conversions = conversions.models;

  		$scope.openScript = function(conversion) {
  			if (typeof conversion.scriptId != undefined) {
  				$location.path('/scripts/' + conversion.get('scriptId'));
  			}
  		}
  	}])