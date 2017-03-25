(function () {
  angular.module('nerveCenter',
    ['ngRoute', 'ngAnimate', 'ngSanitize',
      'ui.bootstrap', 'gridster', 'pr.longpress', 'pg-ng-dropdown']);

  function config ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'dashboard/dashboard.view.html',
        controller: 'dashboardCtrl as $ctrl',
        controllerAs: 'vm'
      })
      .when('/register', {
        templateUrl: '/auth/register/register.view.html',
        controller: 'registerCtrl',
        controllerAs: 'vm'
      })
      .when('/login', {
        templateUrl: '/auth/login/login.view.html',
        controller: 'loginCtrl',
        controllerAs: 'vm'
      })
      .when('/user', {
        templateUrl: '/profile/profile.view.html',
        controller: 'profileCtrl',
        controllerAs: 'vm'
      })
      .otherwise({redirectTo: '/'});

    // HTML5 History API
    $locationProvider.html5Mode(true);
  }

  function run($rootScope, $location, $http, auth) {
    $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
      if ($location.path() === '/profile' && !auth.isLoggedIn()) {
        $location.path('/');
      }
    });
  }

  angular
    .module('nerveCenter')
    .config(['$routeProvider', '$locationProvider', config])
    .run(['$rootScope', '$location', '$uibModal', 'auth', run]);

})();
