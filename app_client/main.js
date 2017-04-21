(function() {

  angular.module('nerveCenter',
    ['ngRoute', 'ngAnimate', 'ngSanitize', 'ui.bootstrap',
     'gridster']);

  function config($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'dashboard/dashboard.view.html',
        controller: 'dashboardCtrl',
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
