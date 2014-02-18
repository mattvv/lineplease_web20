'use strict';
/*global Parse:false */

var usersControllers = angular.module('usersControllers', []);
usersControllers
  .controller('HomeController', ['$scope', '$location', function ($scope, $location) {
    $scope.fbLogin = function() {
      if (Parse.User.current() === null) {
        $location.path('/scripts');
      }
      Parse.FacebookUtils.logIn(null, {
        success: function() {
          $location.path('/scripts');
        },
        error: function() {
          console.log('User cancelled the Facebook login or did not fully authorize.');
        }
      });
    };
  }])
  .controller('LoginController', ['$scope', '$location', function ($scope, $location) {
    $scope.email = '';
    $scope.password = '';
    $scope.keep = true;

    $scope.login = function(email, password) {
      // if ($scope.loginForm.$valid) {
        //todo: show a loading view or spinner
        Parse.User.logIn(email, password, {
          success: function() {
            //todo: hide loading view or spinner
            //we logged in, redirect user to the main page.
            $location.path('/scripts');
            $scope.$apply(); //required to force the redirect since we're outside angular (in parse.login)
          },
          error: function() {
            //todo: hide loading view or spinner
            //@sahiga: display login error in view somehow elegantly
            $scope.loginForm.badCredentials = true;
            $scope.$apply();
          }
        });
      // } else {
      //   $scope.loginForm.submitted = true;
      // }
      };
  }])
  .controller('LogoutController', ['$scope', '$location', function($scope, $location) {
    Parse.User.logOut();
    $location.path('/');
  }])
  .controller('ForgotPasswordUsersController', ['$scope', '$location', 'flash', '$rootScope', function($scope, $location, flash, $rootScope) {
    console.log('in forgotpassword users controller');
    $scope.email = '';

    $scope.resetPassword = function(email) {
      $rootScope.isViewLoading = true;
      Parse.User.requestPasswordReset(email).then(function() {
        $rootScope.isViewLoading = false;
        //todo: prompt user with a message their email is resete
        flash.success = 'Please check your email - your password has been sent!';
        $scope.$apply();
      }, function(error) {
        $rootScope.isViewLoading = false;
        flash.error = 'Could not find your email - please try adding a space at the end';
        $scope.$apply();
        console.log(error);
      });
    };
  }]);