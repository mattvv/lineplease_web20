'use strict';

angular.module('linepleaseApp', [
    'ui.router',
    'ParseServices',
    'FacebookPatch',
    'ExternalDataServices',
    'ui.sortable',
    'angular-flash.service',
    'angular-flash.flash-alert-directive',

    'usersControllers',
    'scriptsControllers',
    'profilesControllers',
    'linesControllers'
  ])
  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      //outside views
      .state('home', {
        url: '/',
        templateUrl: 'views/home.html',
        controller: 'HomeController',
        menu: 'hidden'
      })
      .state('users_new', {
        url: '/users/new',
        templateUrl: 'views/users/new.html',
        menu: 'hidden'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'views/users/login.html',
        controller: 'LoginController',
        menu: 'hidden'
      })
      .state('logout', {
        url: '/logout',
        templateUrl: 'views/users/login.html',
        controller: 'LogoutController'
      })
      .state('forgot_password', {
        url: '/forgot_password',
        templateUrl: 'views/users/forgot_password.html',
        controller: 'ForgotPasswordUsersController',
        menu: 'hidden'
      })

      //scripts
      .state('scripts', {
        url: '/scripts',
        templateUrl: 'views/scripts/index.html',
        controller: 'ScriptIndexController',
        resolve: {
          'scripts': ['ScriptService', function(ScriptService) {
            var scripts = new ScriptService.collection();
            return scripts.loadMyScripts();
          }]
        },
        title: 'Scripts'
      })

      .state('scripts_new', {
        url: '/scripts',
        templateUrl: 'views/scripts/new.html',
        controller: 'ScriptNewController',
        title: 'Create Script'
      })

      //lines
      .state('lines', {
        url: '/scripts/:scriptId',
        templateUrl: 'views/lines/index.html',
        controller: 'LineIndexController',
        resolve: {
          'lines': ['LineService', '$stateParams', function(LineService, $stateParams) {
            var lines = new LineService.collection();
            return lines.loadLines($stateParams.scriptId);
          }]
        },
        lineview: true
      })

      //profile
      .state('profile', {
        url: '/profile',
        templateUrl: 'views/profile/index.html',
        controller: 'ProfileIndexController',
      })

      $urlRouterProvider.otherwise('/scripts');
  }])
  .run(['ParseSDK', 'ExtendParseSDK', '$rootScope', '$location', 'flash',
    function(ParseSDK, ExtendParseSDK, $rootScope, $location, flash) { 
      $rootScope.$on('$stateChangeStart', function(event, toState) {
        flash.clean();
        $rootScope.menu = toState.menu;
        $rootScope.title = toState.title; 
        $rootScope.lineview = toState.lineview;
        $('.menu').hide(); //ensure menu is hidden between transitions (closes menu if you have clicked on it frmo another page)
      });

      $('.navbar ul li a').on('click', function() {
        $(this).parent().parent().find('ul').toggle(400);
      })

      $('.blur').blurjs({
        source: 'body',
        radius: 7,
        overlay: 'rgba(255,255,255,0.4)'
      }); 
    
      $rootScope.$watch(function() { return $location.path(); }, function(newValue) {
        var loggedOutRoutes = ['/login', '/users/new', '/', '/forgot_password'];

        if (Parse.User.current()) {
          Parse.User.current().fetch(); //ensure user is up to date
        }

        if (!Parse.User.current() && !_.contains(loggedOutRoutes, newValue)) {
          $location.path('/');
        }
      });
    }]);
