/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

	'use strict';

	import './dashboard/dashboard';
	// import auth from './auth/dashboard';

	angular
	  .module('nerveCenter', ['ngRoute', 'ngAnimate', 'ngSanitize', 'ui.bootstrap',
	                          'gridster', 'infinite-scroll', 'ds.clock',
	                          'nerveCenter.dashboard'])
	  .config(['$routeProvider', '$locationProvider', config])
	  .run(['$rootScope', '$location', '$uibModal', 'auth', run]);

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
	  $rootScope.$on('$routeChangeStart', (event, nextRoute, currentRoute) => {
	    if ($location.path() === '/profile' && !auth.isLoggedIn()) {
	      $location.path('/');
	    }
	  });
	}



/***/ })
/******/ ]);