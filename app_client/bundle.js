(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
      }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
        var n = t[o][1][e];return s(n ? n : e);
      }, l, l.exports, e, t, n, r);
    }return n[o].exports;
  }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) s(r[o]);return s;
})({ 1: [function (require, module, exports) {
    (function () {

      angular.module('nerveCenter', ['ngRoute', 'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'gridster', 'infinite-scroll', 'ds.clock']);

      function config($routeProvider, $locationProvider) {
        $routeProvider.when('/', {
          templateUrl: 'dashboard/dashboard.view.html',
          controller: 'dashboardCtrl'
        }).otherwise({ redirectTo: '/' });

        // HTML5 History API
        $locationProvider.html5Mode(true);
      }

      function run($rootScope, $location, $http, auth) {
        $rootScope.$on('$routeChangeStart', function (event, nextRoute, currentRoute) {
          if ($location.path() === '/profile' && !auth.isLoggedIn()) {
            $location.path('/');
          }
        });
      }

      angular.module('nerveCenter').config(['$routeProvider', '$locationProvider', config]).run(['$rootScope', '$location', '$uibModal', 'auth', run]);
    })();

    (function () {
      angular.module('nerveCenter').controller('authCtrl', authCtrl);

      authCtrl.$inject = ['$location', 'auth', 'apiData'];
      function authCtrl($location, auth, apiData) {
        var $auth = this;

        $auth.credentials = {
          email: "",
          password: ""
        };

        $auth.onReg = function () {
          auth.register($auth.credentials).error(function (err) {
            alert("Sorry, you didn't fill in both fields.\nPlease try again.");
          }).then(function () {
            auth.login($auth.credentials);
            $location.path('../dashboard/dashboard.view');
          });
        };

        $auth.user = {};

        $auth.onLogin = function () {
          auth.login($auth.credentials).error(function (err) {
            alert("Sorry, the username and password you entered don't match.\nPlease try again.");
          }).then(function () {
            $location.path('../dashboard/dashboard.view');
          });
        };
      }
    })();

    (function () {

      angular.module('nerveCenter').service('auth', auth);

      auth.$inject = ['$http', '$window'];
      function auth($http, $window) {

        var saveToken = function (token) {
          $window.localStorage['mean-token'] = token;
        };

        var getToken = function () {
          return $window.localStorage['mean-token'];
        };

        var isLoggedIn = function () {
          var token = getToken();
          var payload;

          if (token) {
            payload = token.split('.')[1];
            payload = $window.atob(payload);
            payload = JSON.parse(payload);

            return payload.exp > Date.now() / 1000;
          } else {
            return false;
          }
        };

        var currentUser = function () {
          if (isLoggedIn()) {
            var token = getToken();
            var payload = token.split('.')[1];
            payload = $window.atob(payload);
            payload = JSON.parse(payload);
            return {
              id: payload._id,
              email: payload.email,
              widgets: payload.widgets
            };
          }
        };

        register = function (user) {
          return $http.post('/api/register', user).success(function (data) {
            saveToken(data.token);
          });
        };

        login = function (user) {
          return $http.post('/api/login', user).success(function (data) {
            saveToken(data.token);
          });
        };

        logout = function () {
          $window.localStorage.removeItem('mean-token');
        };

        return {
          currentUser: currentUser,
          saveToken: saveToken,
          getToken: getToken,
          isLoggedIn: isLoggedIn,
          register: register,
          login: login,
          logout: logout
        };
      }
    })();

    (function () {

      angular.module('nerveCenter').controller('dashboardCtrl', dashboardCtrl);

      function dashboardCtrl($scope, $http, $location, $uibModal, $log, $document, $filter, $window, apiData, auth) {

        var $dshBrd = this;

        $scope.draggable = false;
        $scope.deleteEnabled = false;
        $scope.urlsEnabled = true;
        $scope.areIconsLoaded = false;
        $scope.deleteIcon = 'img/_x.png';
        $scope.lockIcon = 'img/_locked.png';

        updateWidgets();
        getIcons();

        function instantiateGridster() {
          var width = this.window.outerWidth;
          var adjustedGridOptions = gridOptions;
          if (width > 500) {
            adjustedGridOptions.columns = 7;
          } else {
            adjustedGridOptions.columns = 3;
          }
          return adjustedGridOptions;
        }

        function checkScreenSize() {
          var start = $window.outerWidth;
          if (start > 500) {
            $dshBrd.screenSize = 'lg';
          } else {
            $dshBrd.screenSize = 'sm';
          }
        }

        function updateToolIconSize() {
          $scope.toolIconSize = $dshBrd.screenSize == 'sm' ? $scope.toolIconSize = 28 + 'px' : $scope.toolIconSize = 20 + 'px';
        }

        updateToolIconSize();

        function updateWidgets() {
          checkScreenSize();
          $dshBrd.lastScreenSize = inputScreenSize($window.outerWidth);
          apiData.getProfile().success(function (user) {
            $dshBrd.widgetsLg = angular.fromJson(user.widgetsLg);
            $dshBrd.widgetsSm = angular.fromJson(user.widgetsSm);
          }).error(function () {
            $scope.openAuthModal();
          }).finally(function () {
            $scope.widgets = $dshBrd.screenSize == 'lg' ? $dshBrd.widgetsLg : $dshBrd.widgetsSm;
            console.log($scope.widgets);
            $scope.gridOptions = instantiateGridster();
            $dshBrd.currentWidth = $window.outerWidth;
          });
        }

        $dshBrd.saveWidgets = function () {
          checkScreenSize();

          if ($dshBrd.screenSize == 'lg') {
            $dshBrd.widgetsLg = $scope.widgets;
          } else {
            $dshBrd.widgetsSm = $scope.widgets;
          }

          console.log('Save: ', $scope.widgets);

          data = [$dshBrd.widgetsLg, $dshBrd.widgetsSm];

          apiData.updateWidgets(data).success(function (data) {
            console.log("Success!: ", data);
          }).error(function (e) {
            console.log(e);
          });
        };

        $scope.createWidget = function () {
          var widgetUrl = $scope.widgetUrl;
          var widgetWeight = $scope.widgetWeight;
          var widgetIcon = $scope.selectedIcon;
          console.log(widgetIcon);

          var defaultIcon = "img/_blank.png";
          // Form validation
          if (!widgetUrl && widgetIcon === defaultIcon) {
            window.alert("Please Enter URL and Select an Icon");
            return;
          } else if (!widgetUrl) {
            window.alert("Please Enter URL");
            return;
          } else if (widgetIcon === defaultIcon) {
            window.alert("Please Select an Icon");
            return;
          }

          $scope.widgetTemplate = '/dashboard/widgetTemplates/link-widget.template.html';
          $scope.getWidgetTemplate = function () {
            return '/dashboard/widgetTemplates/link-widget.template.html';
          };

          function pushNewWidget(size) {
            if (size === 'lg') {
              var len = $dshBrd.widgetsLg.length;
              var columns = 7;
              var newWidget = createNewWidget(len, columns);
              $dshBrd.widgetsLg.push(newWidget);
            } else if (size === 'sm') {
              var len = $dshBrd.widgetsSm.length;
              var columns = 3;
              var newWidget = createNewWidget(len, columns);
              $dshBrd.widgetsSm.push(newWidget);
            }
          }

          function createNewWidget(len, columns) {
            var newWidget = {
              icon: widgetIcon,
              url: widgetUrl,
              row: Math.floor(len / columns),
              col: len % columns + 1
            };
            return newWidget;
          }

          pushNewWidget('lg');
          pushNewWidget('sm');

          $dshBrd.saveWidgets();
          $location.path('dashboard.view');
        };

        $scope.importWidgets = function () {
          var widgetString = angular.fromJson($scope.widgetString);
          $scope.widgets = widgetString;

          checkScreenSize();
          if ($dshBrd.screenSize == 'lg') {
            $dshBrd.widgetsLg = widgetString;
          } else {
            $dshBrd.widgetsSm = widgetString;
          }

          $dshBrd.saveWidgets();
          $location.path('dashboard.view');
        };

        $scope.deleteWidget = function (widget) {
          console.log("Delete: ", widget);
          $scope.widgets = $scope.widgets.filter(function (element) {
            return element.url != widget.url;
          });

          $dshBrd.saveWidgets();
        };

        $scope.toggleDraggable = function () {
          gridOptions.draggable.enabled = !gridOptions.draggable.enabled;
          $scope.urlsEnabled = !$scope.urlsEnabled;

          if ($scope.deleteEnabled) {
            $scope.deleteEnabled = false;
            $scope.deleteIcon = 'img/_x.png';
          }

          if (gridOptions.draggable.enabled) {
            $scope.lockIcon = 'img/_lockedRed.png';
          } else {
            $scope.lockIcon = 'img/_locked.png';
          }

          if (!gridOptions.draggable.enabled) $dshBrd.saveWidgets();
        };

        $scope.toggleDelete = function () {
          $scope.deleteEnabled = !$scope.deleteEnabled;
          $scope.urlsEnabled = !$scope.urlsEnabled;

          if ($scope.deleteEnabled) {
            $scope.deleteIcon = 'img/_xRed.png';
          } else {
            $scope.deleteIcon = 'img/_x.png';
          }

          if (gridOptions.draggable.enabled) {
            gridOptions.draggable.enabled = false;
            $scope.lockIcon = 'img/_locked.png';
          }
        };

        function getIcons() {
          apiData.getIcons().success(function (icons) {
            $dshBrd.icons = icons;
          }).finally(function () {
            $dshBrd.allIcons = [];
            var len = $dshBrd.icons.length;

            for (i = 0; i < len; i++) {
              var iconObj = {};
              var iconString = 'img/ico/' + $dshBrd.icons[i];
              iconObj.path = iconString;
              $dshBrd.allIcons.push(iconObj);
            }
            $scope.shownIcons = [];
            $scope.loadSomeIcons();
          });
        }

        $scope.loadAllIcons = function () {
          var shownLen = $scope.shownIcons.length;
          var totalIcons = $dshBrd.allIcons.length;
          var iconsRemaining = totalIcons - shownLen - 1;
          $scope.areIconsLoaded = true;
          for (var i = shownLen; i <= iconsRemaining; i++) {
            var newIco = $dshBrd.allIcons[shownLen + i];
            $scope.shownIcons.push(newIco);
          }
          console.log($scope.shownIcons);
        };

        $scope.loadSomeIcons = function () {
          var shownLen = $scope.shownIcons.length;
          for (var i = 1; i <= 24; i++) {
            var newIco = $dshBrd.allIcons[shownLen + i];
            $scope.shownIcons.push(newIco);
          }
        };

        $scope.gridsterModalOptions = gridsterModalOptions;
        $scope.selectedIcon = "img/_blank.png";

        $scope.selectIcon = function (iconPath) {
          $scope.selectedIcon = iconPath;
        };

        $scope.openMainModal = function (size, parentSelector) {
          gridOptions.draggable.enabled = false;
          $scope.deleteEnabled = false;

          var parentElem = parentSelector ? angular.element($document[0].querySelector('.modal-demo')) : undefined;

          var modalInstance = $uibModal.open({
            templateUrl: 'mainModal.html',
            controller: 'dashboardCtrl',
            size: 'lg',
            appendTo: parentElem
          });
        };

        $scope.openAuthModal = function (size, parentSelector) {
          var parentElem = parentSelector ? angular.element($document[0].querySelector('.main-modal')) : undefined;

          var modalInstance = $uibModal.open({
            templateUrl: 'authModal.html',
            controller: 'authCtrl',
            controllerAs: '$auth',
            appendTo: parentElem
          });
        };

        $scope.onLogout = function () {
          auth.logout();
          $location.path('dashboard.view');
        };

        $scope.syncWidgets = function () {
          $dshBrd.widgetsLg = $scope.widgets;
          $dshBrd.widgetsSm = $scope.widgets;
          $dshBrd.saveWidgets();
          $location.path('dashboard.view');
        };

        $scope.resetWidgets = function () {
          checkScreenSize();

          apiData.getDefaultGrid().success(function (defaultGrid) {
            defaultGrid = angular.fromJson(defaultGrid);
            $scope.widgets = defaultGrid;
            if ($dshBrd.screenSize == 'lg') {
              $dshBrd.widgetsLg = defaultGrid;
            } else {
              $dshBrd.widgetsSm = defaultGrid;
            }
          }).error(function (e) {
            console.log(e);
          }).finally(function () {
            $dshBrd.saveWidgets();
            $location.path('dashboard.view');
          });
        };

        $scope.clearGrid = function () {
          $scope.widgets = [];
          if ($dshBrd.screenSize == 'lg') {
            $dshBrd.widgetsLg = [];
          } else {
            $dshBrd.widgetsSm = [];
          }
          $dshBrd.saveWidgets();
          $location.path('dashboard.view');
        };

        var resizeBreaks = {
          'sm': 500
        };

        function inputScreenSize(width) {
          if (width > 500) {
            return 'lg';
          } else {
            return 'sm';
          }
        }

        function logIt(type) {
          console.log("Type:", type);
        }

        angular.element($window).bind('resize', function () {
          var oldWidth = $dshBrd.currentWidth;
          var oldSize = $dshBrd.lastScreenSize;
          var newWidth = $window.outerWidth;
          var newSize = inputScreenSize(newWidth);

          if (oldSize !== newSize) {
            $location.path('dashboard.view');
          }

          $dshBrd.lastScreenSize = newSize;
        });

        $scope.logIt = function (widget) {
          console.log(widget);
        };
      };
    })();

    (function () {

      angular.module('nerveCenter').directive('clockWidget', clockWidget);

      function clockWidget() {
        return {
          restrict: 'AEC',
          templateUrl: function (elem, attrs) {
            return "/dashboard/widgetTemplates/clock-widget.template.html";
          }
        };
      };
    })();

    (function () {

      angular.module('nerveCenter').directive('renderWidget', renderWidget);

      function renderWidget() {
        return {
          restrict: 'AEC',
          templateUrl: function (elem, attrs) {
            console.log(attrs);
            return "/dashboard/widgetTemplates/" + attrs.type + ".template.html";
          }
        };
      };
    })();

    (function () {

      angular.module('nerveCenter').directive('scrolly', scrolly);

      function scrolly($window) {
        return {
          restrict: 'AEC',
          link: function (scope, element, attrs) {
            var raw = element[0];
            console.log('loading directive');

            element.bind('scroll', function () {
              console.log('in scroll');
              console.log(raw.scrollTop + raw.offsetHeight);
              console.log(raw.scrollHeight);
              if (raw.scrollTop + raw.offsetHeight > raw.scrollHeight) {
                scope.$apply(attrs.scrolly);
              }
            });
          }
          // return {
          //   restrict: 'A',
          //   link: function(scope, element, attrs) {
          //     var raw = element[0];

          //     element.bind('scroll', function () {
          //       // var yPosition = raw.scrollTop + raw.offsetHeight;
          //       // if (yPosition > scope.lastYPosition) {
          //         console.log('in scroll');
          //         console.log(raw.scrollTop + raw.offsetHeight);
          //         console.log(raw.scrollHeight);
          //       // }
          //       scope.lastYPosition = yPosition;
          //     });
          //   }
          // };
        };
      };
    });

    (function () {

      angular.module('nerveCenter').directive('selectText', selectText);

      function selectText($window) {
        return {
          link: function (scope, element) {
            element.on('click', function () {
              var selection = $window.getSelection();
              var range = document.createRange();
              range.selectNodeContents(element[0]);
              selection.removeAllRanges();
              selection.addRange(range);
            });
          }
        };
      }
    })();

    (function () {

      angular.module('nerveCenter').service('apiData', apiData);

      apiData.$inject = ['$http', 'auth'];
      function apiData($http, auth) {

        var getProfile = function () {
          return $http.get('/api/user', {
            headers: {
              Authorization: 'Bearer ' + auth.getToken()
            }
          });
        };

        var updateWidgets = function (data) {
          return $http.put('/api/user', data, {
            headers: {
              Authorization: 'Bearer ' + auth.getToken()
            }
          });
        };

        var getIcons = function (data) {
          return $http.get('/api/ico', data, {
            headers: {
              Authorization: 'Bearer ' + auth.getToken()
            }
          });
        };

        var getDefaultGrid = function (data) {
          return $http.get('/api/defaultgrid', data, {
            headers: {
              Authorization: 'Bearer ' + auth.getToken()
            }
          });
        };

        return {
          getProfile: getProfile,
          updateWidgets: updateWidgets,
          getIcons: getIcons,
          getDefaultGrid: getDefaultGrid
        };
      }
    })();

    var allIcons = [{ icon: "img/BNK.png" }, { icon: "img/CNN.png" }, { icon: "img/Drive.png" }, { icon: "img/FreePress.png" }, { icon: "img/GitHub.png" }, { icon: "img/Google.png" }, { icon: "img/Image.png" }, { icon: "img/Indeed.png" }, { icon: "img/Launch.png" }, { icon: "img/Linked.png" }, { icon: "img/Notes.png" }, { icon: "img/ReadLater.png" }, { icon: "img/RTorrent.png" }, { icon: "img/Slack.png" }, { icon: "img/Tape.png" }, { icon: "img/Trend.png" }, { icon: "img/Tube.png" }, { icon: "img/Twitter.png" }, { icon: "img/Wiki.png" }];

    var gridOptions = {
      columns: 7,
      pushing: true,
      floating: true,
      swapping: true,
      width: 'auto',
      colWidth: 'auto',
      rowHeight: 'match',
      margins: [10, 10],
      outerMargin: true,
      sparse: false,
      isMobile: false,
      mobileBreakPoint: 600,
      mobileModeEnabled: false,
      defaultSizeX: 1,
      defaultSizeY: 1,
      resizable: {
        enabled: false
      },
      draggable: {
        enabled: false,
        stop: function (event, $element, widget) {
          console.log($element.scope().gridster.grid);
          // console.log($element.scope().gridster.grid);
        }
      }
    };

    var gridsterModalOptions = {
      columns: 6,
      pushing: true,
      floating: true,
      swapping: true,
      width: 'auto',
      colWidth: 'auto',
      rowHeight: 'match',
      margins: [10, 10],
      outerMargin: true,
      sparse: false,
      isMobile: false,
      mobileBreakPoint: 600,
      mobileModeEnabled: false,
      minColumns: 1,
      minRows: 1,
      maxRows: 100,
      defaultSizeX: 1,
      defaultSizeY: 1,
      minSizeX: 1,
      maxSizeX: null,
      minSizeY: 1,
      maxSizeY: null,
      resizable: {
        enabled: false,
        handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
        start: function (event, $element, widget) {},
        resize: function (event, $element, widget) {},
        stop: function (event, $element, widget) {}
      },
      draggable: {
        enabled: false,
        handle: '.my-class',
        start: function (event, $element, widget) {},
        drag: function (event, $element, widget) {},
        stop: function (event, $element, widget) {}
      }
    };

    var calcGridOptions = {
      columns: 6,
      pushing: true,
      floating: true,
      swapping: true,
      width: 'auto',
      colWidth: 'auto',
      rowHeight: 'match',
      margins: [9, 9],
      outerMargin: true,
      sparse: false,
      isMobile: false,
      mobileBreakPoint: 600,
      mobileModeEnabled: false,
      defaultSizeX: 1,
      defaultSizeY: 1,
      resizable: {
        enabled: false
      },
      draggable: {
        enabled: false,
        stop: function (event, $element, widget) {
          console.log($element.scope().gridster.grid);
          // console.log($element.scope().gridster.grid);
        }
      }
    };

    (function () {

      angular.module('nerveCenter').factory('ncCalcButtons', ncCalcButtons);

      function ncCalcButtons() {
        var factory = {};

        factory.digits = function () {
          var buttonKeys = ['7', '8', '9', '0', 'c', '<-', '4', '5', '6', '.', '-', '+', '1', '2', '3', '=', '/', '*'];

          var len = buttonKeys.length - 1;

          var i;
          var buttons = [];

          for (i = 0; i <= len; i++) {
            newObj = {};
            newObj.key = buttonKeys[i];
            newObj.col = Math.floor((i + 1) / 6);
            newObj.row = i - 6 * newObj.col;
            buttons.push(newObj);
          }

          return buttons;
        };
        return factory;
      }
    })();

    (function () {

      angular.module('nerveCenter').controller('ncCalcCtrl', ncCalcCtrl);

      function ncCalcCtrl($scope, ncCalcButtons) {
        $scope.out = '';
        $scope.result = 0;
        $scope.calcGridOptions = calcGridOptions;

        $scope.display = function (number) {

          if ($scope.out != 'undefined' && number != '=' && number != 'c' && number != '<-') {
            $scope.out = $scope.out + number;
          }

          if ($scope.calinput != '') {
            switch (number) {

              case 'c':
                //Cancel
                //resets display
                $scope.out = '';
                break;

              case '<-':
                //Backspace
                $scope.out = $scope.out.slice(0, -1);
                break;

              case '=':
                //Calculate
                if ($scope.checksymbol($scope.out)) {
                  $scope.out = eval($scope.out).toString();
                }
                break;

              default:
                break;
            }
          }
        };

        /* 
        Check whether the string contains a restricted charater
        in first or last postion
        @param string number
        */
        $scope.checksymbol = function (number) {
          var notallow = ['+', '-', '/', '*', '.', ''];
          if (notallow.indexOf(number.slice(-1)) > -1 || notallow.indexOf(number.slice(0, 1)) > -1) {
            return false;
          }
          return true;
        };

        //Set the keyboard values using the factory method.  
        $scope.mykeys = ncCalcButtons.digits();
      }
    })();

    (function () {

      angular.module('nerveCenter').directive('ncCalc', ncCalc);

      function ncCalc() {
        return {
          restrict: 'AEC',
          controller: 'ncCalcCtrl',
          templateUrl: '/dashboard/nc-calc/nc-calc.template.html'
          // template: '<div  class="calculator">'
          //           +'<div class="u4 display">'
          //           +'<div class="display-inner">{{out}}</div>'
          //           +'</div>'
          //           +'<button ng-repeat="calkey in mykeys track by $index" ng-click="display(calkey)" '
          //           +'ng-class="{\'u2\': calkey == \'0\' || calkey == \'<-\', \'button-blue\' : calkey == \'=\' , \'button-red\' : calkey == \'c\' }"'
          //           +'class="u1 button button-gray" >'
          //           +'<div ng-if="calkey!=\'<-\'">{{calkey}}</div>'
          //           +'<div ng-if="calkey==\'<-\'">B</div>'
          //           +'</button>'
          //           +'</div>'
          //           +'</div>'
        };
      }
    })();
  }, {}] }, {}, [1])(function () {

  angular.module('nerveCenter', ['ngRoute', 'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'gridster', 'infinite-scroll', 'ds.clock']);

  function config($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
      templateUrl: 'dashboard/dashboard.view.html',
      controller: 'dashboardCtrl'
    }).otherwise({ redirectTo: '/' });

    // HTML5 History API
    $locationProvider.html5Mode(true);
  }

  function run($rootScope, $location, $http, auth) {
    $rootScope.$on('$routeChangeStart', function (event, nextRoute, currentRoute) {
      if ($location.path() === '/profile' && !auth.isLoggedIn()) {
        $location.path('/');
      }
    });
  }

  angular.module('nerveCenter').config(['$routeProvider', '$locationProvider', config]).run(['$rootScope', '$location', '$uibModal', 'auth', run]);
})();

(function () {
  angular.module('nerveCenter').controller('authCtrl', authCtrl);

  authCtrl.$inject = ['$location', 'auth', 'apiData'];
  function authCtrl($location, auth, apiData) {
    var $auth = this;

    $auth.credentials = {
      email: "",
      password: ""
    };

    $auth.onReg = function () {
      auth.register($auth.credentials).error(function (err) {
        alert("Sorry, you didn't fill in both fields.\nPlease try again.");
      }).then(function () {
        auth.login($auth.credentials);
        $location.path('../dashboard/dashboard.view');
      });
    };

    $auth.user = {};

    $auth.onLogin = function () {
      auth.login($auth.credentials).error(function (err) {
        alert("Sorry, the username and password you entered don't match.\nPlease try again.");
      }).then(function () {
        $location.path('../dashboard/dashboard.view');
      });
    };
  }
})();

(function () {

  angular.module('nerveCenter').service('auth', auth);

  auth.$inject = ['$http', '$window'];
  function auth($http, $window) {

    var saveToken = function (token) {
      $window.localStorage['mean-token'] = token;
    };

    var getToken = function () {
      return $window.localStorage['mean-token'];
    };

    var isLoggedIn = function () {
      var token = getToken();
      var payload;

      if (token) {
        payload = token.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);

        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    };

    var currentUser = function () {
      if (isLoggedIn()) {
        var token = getToken();
        var payload = token.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);
        return {
          id: payload._id,
          email: payload.email,
          widgets: payload.widgets
        };
      }
    };

    register = function (user) {
      return $http.post('/api/register', user).success(function (data) {
        saveToken(data.token);
      });
    };

    login = function (user) {
      return $http.post('/api/login', user).success(function (data) {
        saveToken(data.token);
      });
    };

    logout = function () {
      $window.localStorage.removeItem('mean-token');
    };

    return {
      currentUser: currentUser,
      saveToken: saveToken,
      getToken: getToken,
      isLoggedIn: isLoggedIn,
      register: register,
      login: login,
      logout: logout
    };
  }
})();

(function () {

  angular.module('nerveCenter').controller('dashboardCtrl', dashboardCtrl);

  function dashboardCtrl($scope, $http, $location, $uibModal, $log, $document, $filter, $window, apiData, auth) {

    var $dshBrd = this;

    $scope.draggable = false;
    $scope.deleteEnabled = false;
    $scope.urlsEnabled = true;
    $scope.areIconsLoaded = false;
    $scope.deleteIcon = 'img/_x.png';
    $scope.lockIcon = 'img/_locked.png';

    updateWidgets();
    getIcons();

    function instantiateGridster() {
      var width = this.window.outerWidth;
      var adjustedGridOptions = gridOptions;
      if (width > 500) {
        adjustedGridOptions.columns = 7;
      } else {
        adjustedGridOptions.columns = 3;
      }
      return adjustedGridOptions;
    }

    function checkScreenSize() {
      var start = $window.outerWidth;
      if (start > 500) {
        $dshBrd.screenSize = 'lg';
      } else {
        $dshBrd.screenSize = 'sm';
      }
    }

    function updateToolIconSize() {
      $scope.toolIconSize = $dshBrd.screenSize == 'sm' ? $scope.toolIconSize = 28 + 'px' : $scope.toolIconSize = 20 + 'px';
    }

    updateToolIconSize();

    function updateWidgets() {
      checkScreenSize();
      $dshBrd.lastScreenSize = inputScreenSize($window.outerWidth);
      apiData.getProfile().success(function (user) {
        $dshBrd.widgetsLg = angular.fromJson(user.widgetsLg);
        $dshBrd.widgetsSm = angular.fromJson(user.widgetsSm);
      }).error(function () {
        $scope.openAuthModal();
      }).finally(function () {
        $scope.widgets = $dshBrd.screenSize == 'lg' ? $dshBrd.widgetsLg : $dshBrd.widgetsSm;
        console.log($scope.widgets);
        $scope.gridOptions = instantiateGridster();
        $dshBrd.currentWidth = $window.outerWidth;
      });
    }

    $dshBrd.saveWidgets = function () {
      checkScreenSize();

      if ($dshBrd.screenSize == 'lg') {
        $dshBrd.widgetsLg = $scope.widgets;
      } else {
        $dshBrd.widgetsSm = $scope.widgets;
      }

      console.log('Save: ', $scope.widgets);

      data = [$dshBrd.widgetsLg, $dshBrd.widgetsSm];

      apiData.updateWidgets(data).success(function (data) {
        console.log("Success!: ", data);
      }).error(function (e) {
        console.log(e);
      });
    };

    $scope.createWidget = function () {
      var widgetUrl = $scope.widgetUrl;
      var widgetWeight = $scope.widgetWeight;
      var widgetIcon = $scope.selectedIcon;
      console.log(widgetIcon);

      var defaultIcon = "img/_blank.png";
      // Form validation
      if (!widgetUrl && widgetIcon === defaultIcon) {
        window.alert("Please Enter URL and Select an Icon");
        return;
      } else if (!widgetUrl) {
        window.alert("Please Enter URL");
        return;
      } else if (widgetIcon === defaultIcon) {
        window.alert("Please Select an Icon");
        return;
      }

      $scope.widgetTemplate = '/dashboard/widgetTemplates/link-widget.template.html';
      $scope.getWidgetTemplate = function () {
        return '/dashboard/widgetTemplates/link-widget.template.html';
      };

      function pushNewWidget(size) {
        if (size === 'lg') {
          var len = $dshBrd.widgetsLg.length;
          var columns = 7;
          var newWidget = createNewWidget(len, columns);
          $dshBrd.widgetsLg.push(newWidget);
        } else if (size === 'sm') {
          var len = $dshBrd.widgetsSm.length;
          var columns = 3;
          var newWidget = createNewWidget(len, columns);
          $dshBrd.widgetsSm.push(newWidget);
        }
      }

      function createNewWidget(len, columns) {
        var newWidget = {
          icon: widgetIcon,
          url: widgetUrl,
          row: Math.floor(len / columns),
          col: len % columns + 1
        };
        return newWidget;
      }

      pushNewWidget('lg');
      pushNewWidget('sm');

      $dshBrd.saveWidgets();
      $location.path('dashboard.view');
    };

    $scope.importWidgets = function () {
      var widgetString = angular.fromJson($scope.widgetString);
      $scope.widgets = widgetString;

      checkScreenSize();
      if ($dshBrd.screenSize == 'lg') {
        $dshBrd.widgetsLg = widgetString;
      } else {
        $dshBrd.widgetsSm = widgetString;
      }

      $dshBrd.saveWidgets();
      $location.path('dashboard.view');
    };

    $scope.deleteWidget = function (widget) {
      console.log("Delete: ", widget);
      $scope.widgets = $scope.widgets.filter(function (element) {
        return element.url != widget.url;
      });

      $dshBrd.saveWidgets();
    };

    $scope.toggleDraggable = function () {
      gridOptions.draggable.enabled = !gridOptions.draggable.enabled;
      $scope.urlsEnabled = !$scope.urlsEnabled;

      if ($scope.deleteEnabled) {
        $scope.deleteEnabled = false;
        $scope.deleteIcon = 'img/_x.png';
      }

      if (gridOptions.draggable.enabled) {
        $scope.lockIcon = 'img/_lockedRed.png';
      } else {
        $scope.lockIcon = 'img/_locked.png';
      }

      if (!gridOptions.draggable.enabled) $dshBrd.saveWidgets();
    };

    $scope.toggleDelete = function () {
      $scope.deleteEnabled = !$scope.deleteEnabled;
      $scope.urlsEnabled = !$scope.urlsEnabled;

      if ($scope.deleteEnabled) {
        $scope.deleteIcon = 'img/_xRed.png';
      } else {
        $scope.deleteIcon = 'img/_x.png';
      }

      if (gridOptions.draggable.enabled) {
        gridOptions.draggable.enabled = false;
        $scope.lockIcon = 'img/_locked.png';
      }
    };

    function getIcons() {
      apiData.getIcons().success(function (icons) {
        $dshBrd.icons = icons;
      }).finally(function () {
        $dshBrd.allIcons = [];
        var len = $dshBrd.icons.length;

        for (i = 0; i < len; i++) {
          var iconObj = {};
          var iconString = 'img/ico/' + $dshBrd.icons[i];
          iconObj.path = iconString;
          $dshBrd.allIcons.push(iconObj);
        }
        $scope.shownIcons = [];
        $scope.loadSomeIcons();
      });
    }

    $scope.loadAllIcons = function () {
      var shownLen = $scope.shownIcons.length;
      var totalIcons = $dshBrd.allIcons.length;
      var iconsRemaining = totalIcons - shownLen - 1;
      $scope.areIconsLoaded = true;
      for (var i = shownLen; i <= iconsRemaining; i++) {
        var newIco = $dshBrd.allIcons[shownLen + i];
        $scope.shownIcons.push(newIco);
      }
      console.log($scope.shownIcons);
    };

    $scope.loadSomeIcons = function () {
      var shownLen = $scope.shownIcons.length;
      for (var i = 1; i <= 24; i++) {
        var newIco = $dshBrd.allIcons[shownLen + i];
        $scope.shownIcons.push(newIco);
      }
    };

    $scope.gridsterModalOptions = gridsterModalOptions;
    $scope.selectedIcon = "img/_blank.png";

    $scope.selectIcon = function (iconPath) {
      $scope.selectedIcon = iconPath;
    };

    $scope.openMainModal = function (size, parentSelector) {
      gridOptions.draggable.enabled = false;
      $scope.deleteEnabled = false;

      var parentElem = parentSelector ? angular.element($document[0].querySelector('.modal-demo')) : undefined;

      var modalInstance = $uibModal.open({
        templateUrl: 'mainModal.html',
        controller: 'dashboardCtrl',
        size: 'lg',
        appendTo: parentElem
      });
    };

    $scope.openAuthModal = function (size, parentSelector) {
      var parentElem = parentSelector ? angular.element($document[0].querySelector('.main-modal')) : undefined;

      var modalInstance = $uibModal.open({
        templateUrl: 'authModal.html',
        controller: 'authCtrl',
        controllerAs: '$auth',
        appendTo: parentElem
      });
    };

    $scope.onLogout = function () {
      auth.logout();
      $location.path('dashboard.view');
    };

    $scope.syncWidgets = function () {
      $dshBrd.widgetsLg = $scope.widgets;
      $dshBrd.widgetsSm = $scope.widgets;
      $dshBrd.saveWidgets();
      $location.path('dashboard.view');
    };

    $scope.resetWidgets = function () {
      checkScreenSize();

      apiData.getDefaultGrid().success(function (defaultGrid) {
        defaultGrid = angular.fromJson(defaultGrid);
        $scope.widgets = defaultGrid;
        if ($dshBrd.screenSize == 'lg') {
          $dshBrd.widgetsLg = defaultGrid;
        } else {
          $dshBrd.widgetsSm = defaultGrid;
        }
      }).error(function (e) {
        console.log(e);
      }).finally(function () {
        $dshBrd.saveWidgets();
        $location.path('dashboard.view');
      });
    };

    $scope.clearGrid = function () {
      $scope.widgets = [];
      if ($dshBrd.screenSize == 'lg') {
        $dshBrd.widgetsLg = [];
      } else {
        $dshBrd.widgetsSm = [];
      }
      $dshBrd.saveWidgets();
      $location.path('dashboard.view');
    };

    var resizeBreaks = {
      'sm': 500
    };

    function inputScreenSize(width) {
      if (width > 500) {
        return 'lg';
      } else {
        return 'sm';
      }
    }

    function logIt(type) {
      console.log("Type:", type);
    }

    angular.element($window).bind('resize', function () {
      var oldWidth = $dshBrd.currentWidth;
      var oldSize = $dshBrd.lastScreenSize;
      var newWidth = $window.outerWidth;
      var newSize = inputScreenSize(newWidth);

      if (oldSize !== newSize) {
        $location.path('dashboard.view');
      }

      $dshBrd.lastScreenSize = newSize;
    });

    $scope.logIt = function (widget) {
      console.log(widget);
    };
  };
})();

(function () {

  angular.module('nerveCenter').directive('clockWidget', clockWidget);

  function clockWidget() {
    return {
      restrict: 'AEC',
      templateUrl: function (elem, attrs) {
        return "/dashboard/widgetTemplates/clock-widget.template.html";
      }
    };
  };
})();

(function () {

  angular.module('nerveCenter').directive('renderWidget', renderWidget);

  function renderWidget() {
    return {
      restrict: 'AEC',
      templateUrl: function (elem, attrs) {
        console.log(attrs);
        return "/dashboard/widgetTemplates/" + attrs.type + ".template.html";
      }
    };
  };
})();

(function () {

  angular.module('nerveCenter').directive('scrolly', scrolly);

  function scrolly($window) {
    return {
      restrict: 'AEC',
      link: function (scope, element, attrs) {
        var raw = element[0];
        console.log('loading directive');

        element.bind('scroll', function () {
          console.log('in scroll');
          console.log(raw.scrollTop + raw.offsetHeight);
          console.log(raw.scrollHeight);
          if (raw.scrollTop + raw.offsetHeight > raw.scrollHeight) {
            scope.$apply(attrs.scrolly);
          }
        });
      }
      // return {
      //   restrict: 'A',
      //   link: function(scope, element, attrs) {
      //     var raw = element[0];

      //     element.bind('scroll', function () {
      //       // var yPosition = raw.scrollTop + raw.offsetHeight;
      //       // if (yPosition > scope.lastYPosition) {
      //         console.log('in scroll');
      //         console.log(raw.scrollTop + raw.offsetHeight);
      //         console.log(raw.scrollHeight);
      //       // }
      //       scope.lastYPosition = yPosition;
      //     });
      //   }
      // };
    };
  };
});

(function () {

  angular.module('nerveCenter').directive('selectText', selectText);

  function selectText($window) {
    return {
      link: function (scope, element) {
        element.on('click', function () {
          var selection = $window.getSelection();
          var range = document.createRange();
          range.selectNodeContents(element[0]);
          selection.removeAllRanges();
          selection.addRange(range);
        });
      }
    };
  }
})();

(function () {

  angular.module('nerveCenter').service('apiData', apiData);

  apiData.$inject = ['$http', 'auth'];
  function apiData($http, auth) {

    var getProfile = function () {
      return $http.get('/api/user', {
        headers: {
          Authorization: 'Bearer ' + auth.getToken()
        }
      });
    };

    var updateWidgets = function (data) {
      return $http.put('/api/user', data, {
        headers: {
          Authorization: 'Bearer ' + auth.getToken()
        }
      });
    };

    var getIcons = function (data) {
      return $http.get('/api/ico', data, {
        headers: {
          Authorization: 'Bearer ' + auth.getToken()
        }
      });
    };

    var getDefaultGrid = function (data) {
      return $http.get('/api/defaultgrid', data, {
        headers: {
          Authorization: 'Bearer ' + auth.getToken()
        }
      });
    };

    return {
      getProfile: getProfile,
      updateWidgets: updateWidgets,
      getIcons: getIcons,
      getDefaultGrid: getDefaultGrid
    };
  }
})();

var allIcons = [{ icon: "img/BNK.png" }, { icon: "img/CNN.png" }, { icon: "img/Drive.png" }, { icon: "img/FreePress.png" }, { icon: "img/GitHub.png" }, { icon: "img/Google.png" }, { icon: "img/Image.png" }, { icon: "img/Indeed.png" }, { icon: "img/Launch.png" }, { icon: "img/Linked.png" }, { icon: "img/Notes.png" }, { icon: "img/ReadLater.png" }, { icon: "img/RTorrent.png" }, { icon: "img/Slack.png" }, { icon: "img/Tape.png" }, { icon: "img/Trend.png" }, { icon: "img/Tube.png" }, { icon: "img/Twitter.png" }, { icon: "img/Wiki.png" }];

var gridOptions = {
  columns: 7,
  pushing: true,
  floating: true,
  swapping: true,
  width: 'auto',
  colWidth: 'auto',
  rowHeight: 'match',
  margins: [10, 10],
  outerMargin: true,
  sparse: false,
  isMobile: false,
  mobileBreakPoint: 600,
  mobileModeEnabled: false,
  defaultSizeX: 1,
  defaultSizeY: 1,
  resizable: {
    enabled: false
  },
  draggable: {
    enabled: false,
    stop: function (event, $element, widget) {
      console.log($element.scope().gridster.grid);
      // console.log($element.scope().gridster.grid);
    }
  }
};

var gridsterModalOptions = {
  columns: 6,
  pushing: true,
  floating: true,
  swapping: true,
  width: 'auto',
  colWidth: 'auto',
  rowHeight: 'match',
  margins: [10, 10],
  outerMargin: true,
  sparse: false,
  isMobile: false,
  mobileBreakPoint: 600,
  mobileModeEnabled: false,
  minColumns: 1,
  minRows: 1,
  maxRows: 100,
  defaultSizeX: 1,
  defaultSizeY: 1,
  minSizeX: 1,
  maxSizeX: null,
  minSizeY: 1,
  maxSizeY: null,
  resizable: {
    enabled: false,
    handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
    start: function (event, $element, widget) {},
    resize: function (event, $element, widget) {},
    stop: function (event, $element, widget) {}
  },
  draggable: {
    enabled: false,
    handle: '.my-class',
    start: function (event, $element, widget) {},
    drag: function (event, $element, widget) {},
    stop: function (event, $element, widget) {}
  }
};

var calcGridOptions = {
  columns: 6,
  pushing: true,
  floating: true,
  swapping: true,
  width: 'auto',
  colWidth: 'auto',
  rowHeight: 'match',
  margins: [9, 9],
  outerMargin: true,
  sparse: false,
  isMobile: false,
  mobileBreakPoint: 600,
  mobileModeEnabled: false,
  defaultSizeX: 1,
  defaultSizeY: 1,
  resizable: {
    enabled: false
  },
  draggable: {
    enabled: false,
    stop: function (event, $element, widget) {
      console.log($element.scope().gridster.grid);
      // console.log($element.scope().gridster.grid);
    }
  }
};

(function () {

  angular.module('nerveCenter').factory('ncCalcButtons', ncCalcButtons);

  function ncCalcButtons() {
    var factory = {};

    factory.digits = function () {
      var buttonKeys = ['7', '8', '9', '0', 'c', '<-', '4', '5', '6', '.', '-', '+', '1', '2', '3', '=', '/', '*'];

      var len = buttonKeys.length - 1;

      var i;
      var buttons = [];

      for (i = 0; i <= len; i++) {
        newObj = {};
        newObj.key = buttonKeys[i];
        newObj.col = Math.floor((i + 1) / 6);
        newObj.row = i - 6 * newObj.col;
        buttons.push(newObj);
      }

      return buttons;
    };
    return factory;
  }
})();

(function () {

  angular.module('nerveCenter').controller('ncCalcCtrl', ncCalcCtrl);

  function ncCalcCtrl($scope, ncCalcButtons) {
    $scope.out = '';
    $scope.result = 0;
    $scope.calcGridOptions = calcGridOptions;

    $scope.display = function (number) {

      if ($scope.out != 'undefined' && number != '=' && number != 'c' && number != '<-') {
        $scope.out = $scope.out + number;
      }

      if ($scope.calinput != '') {
        switch (number) {

          case 'c':
            //Cancel
            //resets display
            $scope.out = '';
            break;

          case '<-':
            //Backspace
            $scope.out = $scope.out.slice(0, -1);
            break;

          case '=':
            //Calculate
            if ($scope.checksymbol($scope.out)) {
              $scope.out = eval($scope.out).toString();
            }
            break;

          default:
            break;
        }
      }
    };

    /* 
    Check whether the string contains a restricted charater
    in first or last postion
    @param string number
    */
    $scope.checksymbol = function (number) {
      var notallow = ['+', '-', '/', '*', '.', ''];
      if (notallow.indexOf(number.slice(-1)) > -1 || notallow.indexOf(number.slice(0, 1)) > -1) {
        return false;
      }
      return true;
    };

    //Set the keyboard values using the factory method.  
    $scope.mykeys = ncCalcButtons.digits();
  }
})();

(function () {

  angular.module('nerveCenter').directive('ncCalc', ncCalc);

  function ncCalc() {
    return {
      restrict: 'AEC',
      controller: 'ncCalcCtrl',
      templateUrl: '/dashboard/nc-calc/nc-calc.template.html'
      // template: '<div  class="calculator">'
      //           +'<div class="u4 display">'
      //           +'<div class="display-inner">{{out}}</div>'
      //           +'</div>'
      //           +'<button ng-repeat="calkey in mykeys track by $index" ng-click="display(calkey)" '
      //           +'ng-class="{\'u2\': calkey == \'0\' || calkey == \'<-\', \'button-blue\' : calkey == \'=\' , \'button-red\' : calkey == \'c\' }"'
      //           +'class="u1 button button-gray" >'
      //           +'<div ng-if="calkey!=\'<-\'">{{calkey}}</div>'
      //           +'<div ng-if="calkey==\'<-\'">B</div>'
      //           +'</button>'
      //           +'</div>'
      //           +'</div>'
    };
  }
})();



},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHBfY2xpZW50XFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJhcHBfY2xpZW50XFxhcHBfY2xpZW50XFxhcHAubWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7Ozs7Ozs7Ozs7O0FDQUEsS0FBQyxZQUFZLEFBRVg7O2NBQUEsQUFBUSxPQUFSLEFBQWUsZUFDYixDQUFBLEFBQUMsV0FBRCxBQUFZLGFBQVosQUFBeUIsY0FBekIsQUFBdUMsZ0JBQXZDLEFBQ0MsWUFERCxBQUNhLG1CQUZmLEFBQ0UsQUFDZ0MsQUFFbEM7O2VBQUEsQUFBUyxPQUFULEFBQWdCLGdCQUFoQixBQUFnQyxtQkFBbUIsQUFDakQ7dUJBQUEsQUFDRyxLQURILEFBQ1E7dUJBQUssQUFDSSxBQUNiO3NCQUhKLEFBQ2EsQUFFRztBQUZILEFBQ1QsV0FGSixBQUtHLFVBQVUsRUFBQyxZQUxkLEFBS2EsQUFBYSxBQUUxQjs7QUFDQTswQkFBQSxBQUFrQixVQUFsQixBQUE0QixBQUM3QjtBQUVEOztlQUFBLEFBQVMsSUFBVCxBQUFhLFlBQWIsQUFBeUIsV0FBekIsQUFBb0MsT0FBcEMsQUFBMkMsTUFBTSxBQUMvQzttQkFBQSxBQUFXLElBQVgsQUFBZSxxQkFBcUIsVUFBQSxBQUFTLE9BQVQsQUFBZ0IsV0FBaEIsQUFBMkIsY0FBYyxBQUMzRTtjQUFJLFVBQUEsQUFBVSxXQUFWLEFBQXFCLGNBQWMsQ0FBQyxLQUF4QyxBQUF3QyxBQUFLLGNBQWMsQUFDekQ7c0JBQUEsQUFBVSxLQUFWLEFBQWUsQUFDaEI7QUFDRjtBQUpELEFBS0Q7QUFFRDs7Y0FBQSxBQUNHLE9BREgsQUFDVSxlQURWLEFBRUcsT0FBTyxDQUFBLEFBQUMsa0JBQUQsQUFBbUIscUJBRjdCLEFBRVUsQUFBd0MsU0FGbEQsQUFHRyxJQUFJLENBQUEsQUFBQyxjQUFELEFBQWUsYUFBZixBQUE0Qixh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SyxTQUFBLEFBQVMsUUFBUSxPQUFBLEFBQU8sTUFBUCxBQUFhLEdBQTlCLEFBQWlCLEFBQWUsTUFBSSxDQUFsRixBQUFtRixHQUFHLEFBQ3BGO21CQUFBLEFBQU8sQUFDUjtBQUNEO2lCQUFBLEFBQU8sQUFDUjtBQU5ELEFBUUE7O0FBQ0E7ZUFBQSxBQUFPLFNBQVMsY0FBaEIsQUFBZ0IsQUFBYyxBQUUvQjtBQUNGO0FBaEVEOztBQW1FQSxLQUFDLFlBQVksQUFFWDs7Y0FBQSxBQUNHLE9BREgsQUFDVSxlQURWLEFBRUcsVUFGSCxBQUVhLFVBRmIsQUFFdUIsQUFFdkI7O2VBQUEsQUFBUyxTQUFTLEFBQ2hCOztvQkFBTyxBQUNLLEFBQ1Y7c0JBRkssQUFFTyxBQUNaO3VCQUFhLEFBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBZkYsQUFBTyxBQWlCUjtBQWpCUSxBQUNMO0FBaUJMO0FBekJELEFBNEJBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uICgpIHtcblxuICBhbmd1bGFyLm1vZHVsZSgnbmVydmVDZW50ZXInLFxuICAgIFsnbmdSb3V0ZScsICduZ0FuaW1hdGUnLCAnbmdTYW5pdGl6ZScsICd1aS5ib290c3RyYXAnLFxuICAgICAnZ3JpZHN0ZXInLCAnaW5maW5pdGUtc2Nyb2xsJywgJ2RzLmNsb2NrJ10pO1xuXG4gIGZ1bmN0aW9uIGNvbmZpZygkcm91dGVQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIHtcbiAgICAkcm91dGVQcm92aWRlclxuICAgICAgLndoZW4oJy8nLCB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAnZGFzaGJvYXJkL2Rhc2hib2FyZC52aWV3Lmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnZGFzaGJvYXJkQ3RybCcsXG4gICAgICB9KVxuICAgICAgLm90aGVyd2lzZSh7cmVkaXJlY3RUbzogJy8nfSk7XG5cbiAgICAvLyBIVE1MNSBIaXN0b3J5IEFQSVxuICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1bigkcm9vdFNjb3BlLCAkbG9jYXRpb24sICRodHRwLCBhdXRoKSB7XG4gICAgJHJvb3RTY29wZS4kb24oJyRyb3V0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24oZXZlbnQsIG5leHRSb3V0ZSwgY3VycmVudFJvdXRlKSB7XG4gICAgICBpZiAoJGxvY2F0aW9uLnBhdGgoKSA9PT0gJy9wcm9maWxlJyAmJiAhYXV0aC5pc0xvZ2dlZEluKCkpIHtcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCduZXJ2ZUNlbnRlcicpXG4gICAgLmNvbmZpZyhbJyRyb3V0ZVByb3ZpZGVyJywgJyRsb2NhdGlvblByb3ZpZGVyJywgY29uZmlnXSlcbiAgICAucnVuKFsnJHJvb3RTY29wZScsICckbG9jYXRpb24nLCAnJHVpYk1vZGFsJywgJ2F1dGgnLCBydW5dKTtcblxufSkoKTtcblxuKGZ1bmN0aW9uICgpIHtcbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ25lcnZlQ2VudGVyJylcbiAgICAuY29udHJvbGxlcignYXV0aEN0cmwnLCBhdXRoQ3RybCk7XG5cbiAgYXV0aEN0cmwuJGluamVjdCA9IFsnJGxvY2F0aW9uJywgJ2F1dGgnLCAnYXBpRGF0YSddO1xuICBmdW5jdGlvbiBhdXRoQ3RybCgkbG9jYXRpb24sIGF1dGgsIGFwaURhdGEpIHtcbiAgICB2YXIgJGF1dGggPSB0aGlzO1xuXG4gICAgJGF1dGguY3JlZGVudGlhbHMgPSB7XG4gICAgICBlbWFpbCA6IFwiXCIsXG4gICAgICBwYXNzd29yZCA6IFwiXCJcbiAgICB9O1xuXG4gICAgJGF1dGgub25SZWcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBhdXRoXG4gICAgICAgIC5yZWdpc3RlcigkYXV0aC5jcmVkZW50aWFscylcbiAgICAgICAgLmVycm9yKGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgIGFsZXJ0KFwiU29ycnksIHlvdSBkaWRuJ3QgZmlsbCBpbiBib3RoIGZpZWxkcy5cXG5QbGVhc2UgdHJ5IGFnYWluLlwiKTtcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGF1dGgubG9naW4oJGF1dGguY3JlZGVudGlhbHMpXG4gICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy4uL2Rhc2hib2FyZC9kYXNoYm9hcmQudmlldycpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFxuICAgICRhdXRoLnVzZXIgPSB7fTtcblxuICAgICRhdXRoLm9uTG9naW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICBhdXRoXG4gICAgICAgIC5sb2dpbigkYXV0aC5jcmVkZW50aWFscylcbiAgICAgICAgLmVycm9yKGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgIGFsZXJ0KFwiU29ycnksIHRoZSB1c2VybmFtZSBhbmQgcGFzc3dvcmQgeW91IGVudGVyZWQgZG9uJ3QgbWF0Y2guXFxuUGxlYXNlIHRyeSBhZ2Fpbi5cIik7XG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnLi4vZGFzaGJvYXJkL2Rhc2hib2FyZC52aWV3Jyk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG59KSgpO1xuXG4oZnVuY3Rpb24gKCkge1xuXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCduZXJ2ZUNlbnRlcicpXG4gICAgLnNlcnZpY2UoJ2F1dGgnLCBhdXRoKTtcblxuICBhdXRoLiRpbmplY3QgPSBbJyRodHRwJywgJyR3aW5kb3cnXTtcbiAgZnVuY3Rpb24gYXV0aCgkaHR0cCwgJHdpbmRvdykge1xuXG4gICAgdmFyIHNhdmVUb2tlbiA9IGZ1bmN0aW9uKHRva2VuKSB7XG4gICAgICAkd2luZG93LmxvY2FsU3RvcmFnZVsnbWVhbi10b2tlbiddID0gdG9rZW47XG4gICAgfTtcblxuICAgIHZhciBnZXRUb2tlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAkd2luZG93LmxvY2FsU3RvcmFnZVsnbWVhbi10b2tlbiddO1xuICAgIH07XG5cbiAgICB2YXIgaXNMb2dnZWRJbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB0b2tlbiA9IGdldFRva2VuKCk7XG4gICAgICB2YXIgcGF5bG9hZDtcblxuICAgICAgaWYodG9rZW4pe1xuICAgICAgICBwYXlsb2FkID0gdG9rZW4uc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgcGF5bG9hZCA9ICR3aW5kb3cuYXRvYihwYXlsb2FkKTtcbiAgICAgICAgcGF5bG9hZCA9IEpTT04ucGFyc2UocGF5bG9hZCk7XG5cbiAgICAgICAgcmV0dXJuIHBheWxvYWQuZXhwID4gRGF0ZS5ub3coKSAvIDEwMDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciBjdXJyZW50VXNlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmKGlzTG9nZ2VkSW4oKSl7XG4gICAgICAgIHZhciB0b2tlbiA9IGdldFRva2VuKCk7XG4gICAgICAgIHZhciBwYXlsb2FkID0gdG9rZW4uc3BsaXQoJy4nKVsxXTtcbiAgICAgICAgcGF5bG9hZCA9ICR3aW5kb3cuYXRvYihwYXlsb2FkKTtcbiAgICAgICAgcGF5bG9hZCA9IEpTT04ucGFyc2UocGF5bG9hZCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaWQgOiBwYXlsb2FkLl9pZCxcbiAgICAgICAgICBlbWFpbCA6IHBheWxvYWQuZW1haWwsXG4gICAgICAgICAgd2lkZ2V0cyA6IHBheWxvYWQud2lkZ2V0c1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZWdpc3RlciA9IGZ1bmN0aW9uKHVzZXIpIHtcbiAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL3JlZ2lzdGVyJywgdXNlcikuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgc2F2ZVRva2VuKGRhdGEudG9rZW4pO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGxvZ2luID0gZnVuY3Rpb24odXNlcikge1xuICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9hcGkvbG9naW4nLCB1c2VyKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgc2F2ZVRva2VuKGRhdGEudG9rZW4pO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGxvZ291dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ21lYW4tdG9rZW4nKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGN1cnJlbnRVc2VyIDogY3VycmVudFVzZXIsXG4gICAgICBzYXZlVG9rZW4gOiBzYXZlVG9rZW4sXG4gICAgICBnZXRUb2tlbiA6IGdldFRva2VuLFxuICAgICAgaXNMb2dnZWRJbiA6IGlzTG9nZ2VkSW4sXG4gICAgICByZWdpc3RlciA6IHJlZ2lzdGVyLFxuICAgICAgbG9naW4gOiBsb2dpbixcbiAgICAgIGxvZ291dCA6IGxvZ291dFxuICAgIH07XG4gIH1cblxufSkoKTtcblxuXG4oZnVuY3Rpb24gKCkge1xuXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCduZXJ2ZUNlbnRlcicpXG4gICAgLmNvbnRyb2xsZXIoJ2Rhc2hib2FyZEN0cmwnLCBkYXNoYm9hcmRDdHJsKTtcblxuICBmdW5jdGlvbiBkYXNoYm9hcmRDdHJsKCRzY29wZSwgJGh0dHAsICRsb2NhdGlvbixcbiAgICAkdWliTW9kYWwsICRsb2csICRkb2N1bWVudCwgJGZpbHRlciwgJHdpbmRvdywgYXBpRGF0YSwgYXV0aCkge1xuXG4gICAgdmFyICRkc2hCcmQgPSB0aGlzO1xuXG4gICAgJHNjb3BlLmRyYWdnYWJsZSA9IGZhbHNlO1xuICAgICRzY29wZS5kZWxldGVFbmFibGVkID0gZmFsc2U7XG4gICAgJHNjb3BlLnVybHNFbmFibGVkID0gdHJ1ZTtcbiAgICAkc2NvcGUuYXJlSWNvbnNMb2FkZWQgPSBmYWxzZTtcbiAgICAkc2NvcGUuZGVsZXRlSWNvbiA9ICdpbWcvX3gucG5nJztcbiAgICAkc2NvcGUubG9ja0ljb24gPSAnaW1nL19sb2NrZWQucG5nJztcblxuICAgIHVwZGF0ZVdpZGdldHMoKTtcbiAgICBnZXRJY29ucygpO1xuXG4gICAgZnVuY3Rpb24gaW5zdGFudGlhdGVHcmlkc3RlcigpIHtcbiAgICAgIHZhciB3aWR0aCA9IHRoaXMud2luZG93Lm91dGVyV2lkdGg7XG4gICAgICB2YXIgYWRqdXN0ZWRHcmlkT3B0aW9ucyA9IGdyaWRPcHRpb25zO1xuICAgICAgaWYgKHdpZHRoID4gNTAwKSB7XG4gICAgICAgIGFkanVzdGVkR3JpZE9wdGlvbnMuY29sdW1ucyA9IDc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhZGp1c3RlZEdyaWRPcHRpb25zLmNvbHVtbnMgPSAzO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGFkanVzdGVkR3JpZE9wdGlvbnM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2hlY2tTY3JlZW5TaXplKCkge1xuICAgICAgdmFyIHN0YXJ0ID0gJHdpbmRvdy5vdXRlcldpZHRoO1xuICAgICAgaWYgKHN0YXJ0ID4gNTAwKSB7XG4gICAgICAgICRkc2hCcmQuc2NyZWVuU2l6ZSA9ICdsZyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkZHNoQnJkLnNjcmVlblNpemUgPSAnc20nO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZVRvb2xJY29uU2l6ZSgpIHsgXG4gICAgICAkc2NvcGUudG9vbEljb25TaXplID0gXG4gICAgICAgICRkc2hCcmQuc2NyZWVuU2l6ZSA9PSAnc20nXG4gICAgICAgID8gJHNjb3BlLnRvb2xJY29uU2l6ZSA9IDI4ICsgJ3B4J1xuICAgICAgICA6ICRzY29wZS50b29sSWNvblNpemUgPSAyMCArICdweCc7XG4gICAgfVxuXG4gICAgdXBkYXRlVG9vbEljb25TaXplKCk7XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVXaWRnZXRzKCkge1xuICAgICAgY2hlY2tTY3JlZW5TaXplKCk7XG4gICAgICAkZHNoQnJkLmxhc3RTY3JlZW5TaXplID0gaW5wdXRTY3JlZW5TaXplKCR3aW5kb3cub3V0ZXJXaWR0aCk7IFxuICAgICAgYXBpRGF0YS5nZXRQcm9maWxlKClcbiAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKHVzZXIpIHtcbiAgICAgICAgICAkZHNoQnJkLndpZGdldHNMZyA9IGFuZ3VsYXIuZnJvbUpzb24odXNlci53aWRnZXRzTGcpO1xuICAgICAgICAgICRkc2hCcmQud2lkZ2V0c1NtID0gYW5ndWxhci5mcm9tSnNvbih1c2VyLndpZGdldHNTbSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5lcnJvcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgJHNjb3BlLm9wZW5BdXRoTW9kYWwoKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmZpbmFsbHkoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICRzY29wZS53aWRnZXRzID0gXG4gICAgICAgICAgICAkZHNoQnJkLnNjcmVlblNpemUgPT0gJ2xnJ1xuICAgICAgICAgICAgPyAkZHNoQnJkLndpZGdldHNMZ1xuICAgICAgICAgICAgOiAkZHNoQnJkLndpZGdldHNTbTtcbiAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUud2lkZ2V0cyk7XG4gICAgICAgICAgJHNjb3BlLmdyaWRPcHRpb25zID0gaW5zdGFudGlhdGVHcmlkc3RlcigpO1xuICAgICAgICAgICRkc2hCcmQuY3VycmVudFdpZHRoID0gJHdpbmRvdy5vdXRlcldpZHRoO1xuICAgICAgICB9KTtcbiAgfVxuXG4gICRkc2hCcmQuc2F2ZVdpZGdldHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgY2hlY2tTY3JlZW5TaXplKCk7XG5cbiAgICBpZiAoJGRzaEJyZC5zY3JlZW5TaXplID09ICdsZycpIHtcbiAgICAgICRkc2hCcmQud2lkZ2V0c0xnID0gJHNjb3BlLndpZGdldHM7XG4gICAgfSBlbHNlIHtcbiAgICAgICRkc2hCcmQud2lkZ2V0c1NtID0gJHNjb3BlLndpZGdldHM7XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coJ1NhdmU6ICcsICRzY29wZS53aWRnZXRzKTtcblxuICAgIGRhdGEgPSBbXG4gICAgICAkZHNoQnJkLndpZGdldHNMZyxcbiAgICAgICRkc2hCcmQud2lkZ2V0c1NtXG4gICAgXTtcblxuICAgIGFwaURhdGEudXBkYXRlV2lkZ2V0cyhkYXRhKVxuICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJTdWNjZXNzITogXCIsIGRhdGEpXG4gICAgICB9KVxuICAgICAgLmVycm9yKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgfSk7XG4gIH1cblxuICAkc2NvcGUuY3JlYXRlV2lkZ2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB3aWRnZXRVcmwgPSAkc2NvcGUud2lkZ2V0VXJsO1xuICAgIHZhciB3aWRnZXRXZWlnaHQgPSAkc2NvcGUud2lkZ2V0V2VpZ2h0O1xuICAgIHZhciB3aWRnZXRJY29uID0gJHNjb3BlLnNlbGVjdGVkSWNvbjtcbiAgICBjb25zb2xlLmxvZyh3aWRnZXRJY29uKTtcblxuICAgIHZhciBkZWZhdWx0SWNvbiA9IFwiaW1nL19ibGFuay5wbmdcIjtcbiAgICAvLyBGb3JtIHZhbGlkYXRpb25cbiAgICBpZiAoIXdpZGdldFVybCAmJiB3aWRnZXRJY29uID09PSBkZWZhdWx0SWNvbikge1xuICAgICAgd2luZG93LmFsZXJ0KFwiUGxlYXNlIEVudGVyIFVSTCBhbmQgU2VsZWN0IGFuIEljb25cIik7XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIGlmICghd2lkZ2V0VXJsKSB7XG4gICAgICB3aW5kb3cuYWxlcnQoXCJQbGVhc2UgRW50ZXIgVVJMXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSBpZiAod2lkZ2V0SWNvbiA9PT0gZGVmYXVsdEljb24pIHtcbiAgICAgIHdpbmRvdy5hbGVydChcIlBsZWFzZSBTZWxlY3QgYW4gSWNvblwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAkc2NvcGUud2lkZ2V0VGVtcGxhdGUgPSAnL2Rhc2hib2FyZC93aWRnZXRUZW1wbGF0ZXMvbGluay13aWRnZXQudGVtcGxhdGUuaHRtbCc7XG4gICAgJHNjb3BlLmdldFdpZGdldFRlbXBsYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuICcvZGFzaGJvYXJkL3dpZGdldFRlbXBsYXRlcy9saW5rLXdpZGdldC50ZW1wbGF0ZS5odG1sJztcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gcHVzaE5ld1dpZGdldChzaXplKSB7XG4gICAgICBpZiAoc2l6ZSA9PT0gJ2xnJykge1xuICAgICAgICB2YXIgbGVuID0gJGRzaEJyZC53aWRnZXRzTGcubGVuZ3RoO1xuICAgICAgICB2YXIgY29sdW1ucyA9IDc7XG4gICAgICAgIHZhciBuZXdXaWRnZXQgPSBjcmVhdGVOZXdXaWRnZXQobGVuLCBjb2x1bW5zKTtcbiAgICAgICAgJGRzaEJyZC53aWRnZXRzTGcucHVzaChuZXdXaWRnZXQpO1xuICAgICAgfSBlbHNlIGlmIChzaXplID09PSAnc20nKSB7XG4gICAgICAgIHZhciBsZW4gPSAkZHNoQnJkLndpZGdldHNTbS5sZW5ndGg7XG4gICAgICAgIHZhciBjb2x1bW5zID0gMztcbiAgICAgICAgdmFyIG5ld1dpZGdldCA9IGNyZWF0ZU5ld1dpZGdldChsZW4sIGNvbHVtbnMpO1xuICAgICAgICAkZHNoQnJkLndpZGdldHNTbS5wdXNoKG5ld1dpZGdldCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3JlYXRlTmV3V2lkZ2V0KGxlbiwgY29sdW1ucykge1xuICAgICAgdmFyIG5ld1dpZGdldCA9IHtcbiAgICAgICAgaWNvbjogd2lkZ2V0SWNvbixcbiAgICAgICAgdXJsOiB3aWRnZXRVcmwsXG4gICAgICAgIHJvdzogTWF0aC5mbG9vcihsZW4gLyBjb2x1bW5zKSxcbiAgICAgICAgY29sOiAobGVuICUgY29sdW1ucykgKyAxXG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3V2lkZ2V0O1xuICAgIH1cblxuICAgIHB1c2hOZXdXaWRnZXQoJ2xnJyk7XG4gICAgcHVzaE5ld1dpZGdldCgnc20nKTtcblxuICAgICRkc2hCcmQuc2F2ZVdpZGdldHMoKTtcbiAgICAkbG9jYXRpb24ucGF0aCgnZGFzaGJvYXJkLnZpZXcnKTtcbiAgfVxuXG5cbiAgICAkc2NvcGUuaW1wb3J0V2lkZ2V0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB3aWRnZXRTdHJpbmcgPSBhbmd1bGFyLmZyb21Kc29uKCRzY29wZS53aWRnZXRTdHJpbmcpO1xuICAgICAgJHNjb3BlLndpZGdldHMgPSB3aWRnZXRTdHJpbmc7XG5cbiAgICAgIGNoZWNrU2NyZWVuU2l6ZSgpO1xuICAgICAgaWYgKCRkc2hCcmQuc2NyZWVuU2l6ZSA9PSAnbGcnKSB7XG4gICAgICAgICRkc2hCcmQud2lkZ2V0c0xnID0gd2lkZ2V0U3RyaW5nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJGRzaEJyZC53aWRnZXRzU20gPSB3aWRnZXRTdHJpbmc7XG4gICAgICB9XG5cbiAgICAgICRkc2hCcmQuc2F2ZVdpZGdldHMoKTtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCdkYXNoYm9hcmQudmlldycpO1xuICAgIH1cblxuICAgICRzY29wZS5kZWxldGVXaWRnZXQgPSBmdW5jdGlvbiAod2lkZ2V0KSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkRlbGV0ZTogXCIsIHdpZGdldCk7XG4gICAgICAkc2NvcGUud2lkZ2V0cyA9ICRzY29wZS53aWRnZXRzLmZpbHRlcihmdW5jdGlvbiAoZWxlbWVudCl7XG4gICAgICAgIHJldHVybiBlbGVtZW50LnVybCAhPSB3aWRnZXQudXJsO1xuICAgICAgfSk7XG5cbiAgICAgICRkc2hCcmQuc2F2ZVdpZGdldHMoKTtcbiAgICB9XG5cbiAgICAkc2NvcGUudG9nZ2xlRHJhZ2dhYmxlID0gZnVuY3Rpb24gKCkge1xuICAgICAgZ3JpZE9wdGlvbnMuZHJhZ2dhYmxlLmVuYWJsZWQgPSAhZ3JpZE9wdGlvbnMuZHJhZ2dhYmxlLmVuYWJsZWQ7XG4gICAgICAkc2NvcGUudXJsc0VuYWJsZWQgPSAhJHNjb3BlLnVybHNFbmFibGVkO1xuXG4gICAgICBpZiAoJHNjb3BlLmRlbGV0ZUVuYWJsZWQpIHtcbiAgICAgICAgJHNjb3BlLmRlbGV0ZUVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgJHNjb3BlLmRlbGV0ZUljb24gPSAnaW1nL194LnBuZyc7XG4gICAgICB9XG5cbiAgICAgIGlmIChncmlkT3B0aW9ucy5kcmFnZ2FibGUuZW5hYmxlZCkge1xuICAgICAgICAkc2NvcGUubG9ja0ljb24gPSAnaW1nL19sb2NrZWRSZWQucG5nJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICRzY29wZS5sb2NrSWNvbiA9ICdpbWcvX2xvY2tlZC5wbmcnO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWdyaWRPcHRpb25zLmRyYWdnYWJsZS5lbmFibGVkKVxuICAgICAgICAkZHNoQnJkLnNhdmVXaWRnZXRzKCk7XG4gICAgfVxuXG4gICAgJHNjb3BlLnRvZ2dsZURlbGV0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICRzY29wZS5kZWxldGVFbmFibGVkID0gISRzY29wZS5kZWxldGVFbmFibGVkO1xuICAgICAgJHNjb3BlLnVybHNFbmFibGVkID0gISRzY29wZS51cmxzRW5hYmxlZDtcblxuICAgICAgaWYgKCRzY29wZS5kZWxldGVFbmFibGVkKSB7XG4gICAgICAgICRzY29wZS5kZWxldGVJY29uID0gJ2ltZy9feFJlZC5wbmcnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJHNjb3BlLmRlbGV0ZUljb24gPSAnaW1nL194LnBuZyc7XG4gICAgICB9XG5cbiAgICAgIGlmIChncmlkT3B0aW9ucy5kcmFnZ2FibGUuZW5hYmxlZCkge1xuICAgICAgICBncmlkT3B0aW9ucy5kcmFnZ2FibGUuZW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAkc2NvcGUubG9ja0ljb24gPSAnaW1nL19sb2NrZWQucG5nJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRJY29ucygpIHtcbiAgICAgIGFwaURhdGEuZ2V0SWNvbnMoKVxuICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoaWNvbnMpIHtcbiAgICAgICAgICAkZHNoQnJkLmljb25zID0gaWNvbnM7XG4gICAgICAgIH0pXG4gICAgICAgIC5maW5hbGx5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAkZHNoQnJkLmFsbEljb25zID0gW107XG4gICAgICAgICAgdmFyIGxlbiA9ICRkc2hCcmQuaWNvbnMubGVuZ3RoO1xuXG4gICAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgaWNvbk9iaiA9IHt9O1xuICAgICAgICAgICAgdmFyIGljb25TdHJpbmcgPSAnaW1nL2ljby8nICsgJGRzaEJyZC5pY29uc1tpXTtcbiAgICAgICAgICAgIGljb25PYmoucGF0aCA9IGljb25TdHJpbmc7XG4gICAgICAgICAgICAkZHNoQnJkLmFsbEljb25zLnB1c2goaWNvbk9iaik7XG4gICAgICAgICAgfVxuICAgICAgICAgICRzY29wZS5zaG93bkljb25zID0gW107XG4gICAgICAgICAgJHNjb3BlLmxvYWRTb21lSWNvbnMoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgJHNjb3BlLmxvYWRBbGxJY29ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzaG93bkxlbiA9ICRzY29wZS5zaG93bkljb25zLmxlbmd0aDtcbiAgICAgIHZhciB0b3RhbEljb25zID0gJGRzaEJyZC5hbGxJY29ucy5sZW5ndGg7XG4gICAgICB2YXIgaWNvbnNSZW1haW5pbmcgPSB0b3RhbEljb25zIC0gc2hvd25MZW4gLSAxO1xuICAgICAgJHNjb3BlLmFyZUljb25zTG9hZGVkID0gdHJ1ZTtcbiAgICAgIGZvciAodmFyIGkgPSBzaG93bkxlbjsgaSA8PSBpY29uc1JlbWFpbmluZzsgaSsrKSB7XG4gICAgICAgIHZhciBuZXdJY28gPSAkZHNoQnJkLmFsbEljb25zW3Nob3duTGVuICsgaV1cbiAgICAgICAgJHNjb3BlLnNob3duSWNvbnMucHVzaChuZXdJY28pO1xuICAgICAgfVxuICAgICAgY29uc29sZS5sb2coJHNjb3BlLnNob3duSWNvbnMpO1xuICAgIH1cblxuICAgICRzY29wZS5sb2FkU29tZUljb25zID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNob3duTGVuID0gJHNjb3BlLnNob3duSWNvbnMubGVuZ3RoO1xuICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gMjQ7IGkrKykge1xuICAgICAgICB2YXIgbmV3SWNvID0gJGRzaEJyZC5hbGxJY29uc1tzaG93bkxlbiArIGldXG4gICAgICAgICRzY29wZS5zaG93bkljb25zLnB1c2gobmV3SWNvKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAkc2NvcGUuZ3JpZHN0ZXJNb2RhbE9wdGlvbnMgPSBncmlkc3Rlck1vZGFsT3B0aW9ucztcbiAgICAkc2NvcGUuc2VsZWN0ZWRJY29uID0gXCJpbWcvX2JsYW5rLnBuZ1wiO1xuXG4gICAgJHNjb3BlLnNlbGVjdEljb24gPSBmdW5jdGlvbiAoaWNvblBhdGgpIHtcbiAgICAgICRzY29wZS5zZWxlY3RlZEljb24gPSBpY29uUGF0aDtcbiAgICB9XG5cbiAgICAkc2NvcGUub3Blbk1haW5Nb2RhbCA9IGZ1bmN0aW9uIChzaXplLCBwYXJlbnRTZWxlY3Rvcikge1xuICAgICAgZ3JpZE9wdGlvbnMuZHJhZ2dhYmxlLmVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICRzY29wZS5kZWxldGVFbmFibGVkID0gZmFsc2U7XG5cbiAgICAgIHZhciBwYXJlbnRFbGVtID0gcGFyZW50U2VsZWN0b3IgP1xuICAgICAgICBhbmd1bGFyLmVsZW1lbnQoJGRvY3VtZW50WzBdLnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbC1kZW1vJykpIDogdW5kZWZpbmVkO1xuXG4gICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICR1aWJNb2RhbC5vcGVuKHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdtYWluTW9kYWwuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdkYXNoYm9hcmRDdHJsJyxcbiAgICAgICAgc2l6ZTogJ2xnJyxcbiAgICAgICAgYXBwZW5kVG86IHBhcmVudEVsZW1cbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkc2NvcGUub3BlbkF1dGhNb2RhbCA9IGZ1bmN0aW9uIChzaXplLCBwYXJlbnRTZWxlY3Rvcikge1xuICAgICAgdmFyIHBhcmVudEVsZW0gPSBwYXJlbnRTZWxlY3RvciA/XG4gICAgICAgIGFuZ3VsYXIuZWxlbWVudCgkZG9jdW1lbnRbMF0ucXVlcnlTZWxlY3RvcignLm1haW4tbW9kYWwnKSkgOiB1bmRlZmluZWQ7XG5cbiAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJHVpYk1vZGFsLm9wZW4oe1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ2F1dGhNb2RhbC5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ2F1dGhDdHJsJyxcbiAgICAgICAgY29udHJvbGxlckFzOiAnJGF1dGgnLFxuICAgICAgICBhcHBlbmRUbzogcGFyZW50RWxlbSxcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkc2NvcGUub25Mb2dvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBhdXRoLmxvZ291dCgpO1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJ2Rhc2hib2FyZC52aWV3Jyk7XG4gICAgfVxuXG4gICAgJHNjb3BlLnN5bmNXaWRnZXRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgJGRzaEJyZC53aWRnZXRzTGcgPSAkc2NvcGUud2lkZ2V0cztcbiAgICAgICRkc2hCcmQud2lkZ2V0c1NtID0gJHNjb3BlLndpZGdldHM7XG4gICAgICAkZHNoQnJkLnNhdmVXaWRnZXRzKCk7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnZGFzaGJvYXJkLnZpZXcnKTtcbiAgICB9XG5cbiAgICAkc2NvcGUucmVzZXRXaWRnZXRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgY2hlY2tTY3JlZW5TaXplKCk7XG5cbiAgICAgIGFwaURhdGEuZ2V0RGVmYXVsdEdyaWQoKVxuICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGVmYXVsdEdyaWQpIHtcbiAgICAgICAgICBkZWZhdWx0R3JpZCA9IGFuZ3VsYXIuZnJvbUpzb24oZGVmYXVsdEdyaWQpO1xuICAgICAgICAgICRzY29wZS53aWRnZXRzID0gZGVmYXVsdEdyaWQ7XG4gICAgICAgICAgaWYgKCRkc2hCcmQuc2NyZWVuU2l6ZSA9PSAnbGcnKSB7XG4gICAgICAgICAgICAkZHNoQnJkLndpZGdldHNMZyA9IGRlZmF1bHRHcmlkO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkZHNoQnJkLndpZGdldHNTbSA9IGRlZmF1bHRHcmlkO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLmVycm9yKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5maW5hbGx5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAkZHNoQnJkLnNhdmVXaWRnZXRzKCk7XG4gICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJ2Rhc2hib2FyZC52aWV3Jyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgICRzY29wZS5jbGVhckdyaWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkc2NvcGUud2lkZ2V0cyA9IFtdO1xuICAgICAgaWYgKCRkc2hCcmQuc2NyZWVuU2l6ZSA9PSAnbGcnKSB7XG4gICAgICAgICRkc2hCcmQud2lkZ2V0c0xnID0gW107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkZHNoQnJkLndpZGdldHNTbSA9IFtdO1xuICAgICAgfVxuICAgICAgJGRzaEJyZC5zYXZlV2lkZ2V0cygpO1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJ2Rhc2hib2FyZC52aWV3Jyk7XG4gICAgfVxuXG4gICAgdmFyIHJlc2l6ZUJyZWFrcyA9IHtcbiAgICAgICdzbScgOiA1MDBcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gaW5wdXRTY3JlZW5TaXplKHdpZHRoKSB7XG4gICAgICBpZiAod2lkdGggPiA1MDApIHtcbiAgICAgICAgcmV0dXJuICdsZyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gJ3NtJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2dJdCh0eXBlKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIlR5cGU6XCIsIHR5cGUpO1xuICAgIH1cblxuICAgIGFuZ3VsYXIuZWxlbWVudCgkd2luZG93KS5iaW5kKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgb2xkV2lkdGggPSAkZHNoQnJkLmN1cnJlbnRXaWR0aDtcbiAgICAgIHZhciBvbGRTaXplID0gJGRzaEJyZC5sYXN0U2NyZWVuU2l6ZTtcbiAgICAgIHZhciBuZXdXaWR0aCA9ICR3aW5kb3cub3V0ZXJXaWR0aDtcbiAgICAgIHZhciBuZXdTaXplID0gaW5wdXRTY3JlZW5TaXplKG5ld1dpZHRoKTtcblxuICAgICAgaWYgKG9sZFNpemUgIT09IG5ld1NpemUpIHtcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJ2Rhc2hib2FyZC52aWV3Jyk7XG4gICAgICB9XG5cbiAgICAgICRkc2hCcmQubGFzdFNjcmVlblNpemUgPSBuZXdTaXplO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLmxvZ0l0ID0gZnVuY3Rpb24gKHdpZGdldCkge1xuICAgICAgY29uc29sZS5sb2cod2lkZ2V0KTtcbiAgICB9XG5cbiAgfTtcbn0pKCk7XG5cblxuKGZ1bmN0aW9uICgpIHtcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnbmVydmVDZW50ZXInKVxuICAgIC5kaXJlY3RpdmUoJ2Nsb2NrV2lkZ2V0JywgY2xvY2tXaWRnZXQpO1xuXG4gIGZ1bmN0aW9uIGNsb2NrV2lkZ2V0KCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0FFQycsXG4gICAgICB0ZW1wbGF0ZVVybDogZnVuY3Rpb24gKGVsZW0sIGF0dHJzKSB7XG4gICAgICAgIHJldHVybiBcIi9kYXNoYm9hcmQvd2lkZ2V0VGVtcGxhdGVzL2Nsb2NrLXdpZGdldC50ZW1wbGF0ZS5odG1sXCI7XG4gICAgICB9XG4gICAgfVxuICB9O1xufSkoKTtcblxuXG4oZnVuY3Rpb24gKCkge1xuXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCduZXJ2ZUNlbnRlcicpXG4gICAgLmRpcmVjdGl2ZSgncmVuZGVyV2lkZ2V0JywgcmVuZGVyV2lkZ2V0KTtcblxuICBmdW5jdGlvbiByZW5kZXJXaWRnZXQoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnQUVDJyxcbiAgICAgIHRlbXBsYXRlVXJsOiBmdW5jdGlvbiAoZWxlbSwgYXR0cnMpIHtcbiAgICAgICAgY29uc29sZS5sb2coYXR0cnMpO1xuICAgICAgICByZXR1cm4gXCIvZGFzaGJvYXJkL3dpZGdldFRlbXBsYXRlcy9cIiArIGF0dHJzLnR5cGUgK1wiLnRlbXBsYXRlLmh0bWxcIjtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59KSgpO1xuXG5cbihmdW5jdGlvbiAoKSB7XG5cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ25lcnZlQ2VudGVyJylcbiAgICAuZGlyZWN0aXZlKCdzY3JvbGx5Jywgc2Nyb2xseSk7XG5cbiAgZnVuY3Rpb24gc2Nyb2xseSgkd2luZG93KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnQUVDJyxcbiAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgdmFyIHJhdyA9IGVsZW1lbnRbMF07XG4gICAgICAgIGNvbnNvbGUubG9nKCdsb2FkaW5nIGRpcmVjdGl2ZScpO1xuXG4gICAgICAgIGVsZW1lbnQuYmluZCgnc2Nyb2xsJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdpbiBzY3JvbGwnKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhyYXcuc2Nyb2xsVG9wICsgcmF3Lm9mZnNldEhlaWdodCk7XG4gICAgICAgICAgY29uc29sZS5sb2cocmF3LnNjcm9sbEhlaWdodCk7XG4gICAgICAgICAgaWYgKHJhdy5zY3JvbGxUb3AgKyByYXcub2Zmc2V0SGVpZ2h0ID4gcmF3LnNjcm9sbEhlaWdodCkge1xuICAgICAgICAgICAgc2NvcGUuJGFwcGx5KGF0dHJzLnNjcm9sbHkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICAvLyByZXR1cm4ge1xuICAgICAgLy8gICByZXN0cmljdDogJ0EnLFxuICAgICAgLy8gICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgIC8vICAgICB2YXIgcmF3ID0gZWxlbWVudFswXTtcblxuICAgICAgLy8gICAgIGVsZW1lbnQuYmluZCgnc2Nyb2xsJywgZnVuY3Rpb24gKCkge1xuICAgICAgLy8gICAgICAgLy8gdmFyIHlQb3NpdGlvbiA9IHJhdy5zY3JvbGxUb3AgKyByYXcub2Zmc2V0SGVpZ2h0O1xuICAgICAgLy8gICAgICAgLy8gaWYgKHlQb3NpdGlvbiA+IHNjb3BlLmxhc3RZUG9zaXRpb24pIHtcbiAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2coJ2luIHNjcm9sbCcpO1xuICAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhyYXcuc2Nyb2xsVG9wICsgcmF3Lm9mZnNldEhlaWdodCk7XG4gICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKHJhdy5zY3JvbGxIZWlnaHQpO1xuICAgICAgLy8gICAgICAgLy8gfVxuICAgICAgLy8gICAgICAgc2NvcGUubGFzdFlQb3NpdGlvbiA9IHlQb3NpdGlvbjtcbiAgICAgIC8vICAgICB9KTtcbiAgICAgIC8vICAgfVxuICAgICAgLy8gfTtcbiAgICB9O1xuICAgIH07XG4gIH0pO1xuXG5cbihmdW5jdGlvbiAoKSB7XG5cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ25lcnZlQ2VudGVyJylcbiAgICAuZGlyZWN0aXZlKCdzZWxlY3RUZXh0Jywgc2VsZWN0VGV4dCk7XG5cbiAgZnVuY3Rpb24gc2VsZWN0VGV4dCgkd2luZG93KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50KSB7XG4gICAgICAgIGVsZW1lbnQub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBzZWxlY3Rpb24gPSAkd2luZG93LmdldFNlbGVjdGlvbigpOyAgICAgICAgXG4gICAgICAgICAgdmFyIHJhbmdlID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKTtcbiAgICAgICAgICByYW5nZS5zZWxlY3ROb2RlQ29udGVudHMoZWxlbWVudFswXSk7XG4gICAgICAgICAgc2VsZWN0aW9uLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgICAgICAgIHNlbGVjdGlvbi5hZGRSYW5nZShyYW5nZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG59KSgpO1xuXG5cbihmdW5jdGlvbiAoKSB7XG5cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ25lcnZlQ2VudGVyJylcbiAgICAuc2VydmljZSgnYXBpRGF0YScsIGFwaURhdGEpO1xuXG4gIGFwaURhdGEuJGluamVjdCA9IFsnJGh0dHAnLCAnYXV0aCddO1xuICBmdW5jdGlvbiBhcGlEYXRhKCRodHRwLCBhdXRoKSB7XG5cbiAgICB2YXIgZ2V0UHJvZmlsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdXNlcicsIHtcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgIEF1dGhvcml6YXRpb246ICdCZWFyZXIgJysgYXV0aC5nZXRUb2tlbigpXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICB2YXIgdXBkYXRlV2lkZ2V0cyA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHJldHVybiAkaHR0cC5wdXQoJy9hcGkvdXNlcicsIGRhdGEsIHtcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgIEF1dGhvcml6YXRpb246ICdCZWFyZXIgJysgYXV0aC5nZXRUb2tlbigpXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICB2YXIgZ2V0SWNvbnMgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL2ljbycsIGRhdGEsIHtcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgIEF1dGhvcml6YXRpb246ICdCZWFyZXIgJysgYXV0aC5nZXRUb2tlbigpXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICB2YXIgZ2V0RGVmYXVsdEdyaWQgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9kZWZhdWx0Z3JpZCcsIGRhdGEsIHtcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgIEF1dGhvcml6YXRpb246ICdCZWFyZXIgJysgYXV0aC5nZXRUb2tlbigpXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgZ2V0UHJvZmlsZSA6IGdldFByb2ZpbGUsXG4gICAgICB1cGRhdGVXaWRnZXRzOiB1cGRhdGVXaWRnZXRzLFxuICAgICAgZ2V0SWNvbnM6IGdldEljb25zLFxuICAgICAgZ2V0RGVmYXVsdEdyaWQ6IGdldERlZmF1bHRHcmlkXG4gICAgfTtcblxuICB9XG5cbn0pKCk7XG5cblxudmFyIGFsbEljb25zID0gW1xuICB7IGljb246XCJpbWcvQk5LLnBuZ1wiIH0sXG4gIHsgaWNvbjpcImltZy9DTk4ucG5nXCIgfSxcbiAgeyBpY29uOlwiaW1nL0RyaXZlLnBuZ1wiIH0sXG4gIHsgaWNvbjpcImltZy9GcmVlUHJlc3MucG5nXCIgfSxcbiAgeyBpY29uOlwiaW1nL0dpdEh1Yi5wbmdcIiB9LFxuICB7IGljb246XCJpbWcvR29vZ2xlLnBuZ1wiIH0sXG4gIHsgaWNvbjpcImltZy9JbWFnZS5wbmdcIiB9LFxuICB7IGljb246XCJpbWcvSW5kZWVkLnBuZ1wiIH0sXG4gIHsgaWNvbjpcImltZy9MYXVuY2gucG5nXCIgfSxcbiAgeyBpY29uOlwiaW1nL0xpbmtlZC5wbmdcIiB9LFxuICB7IGljb246XCJpbWcvTm90ZXMucG5nXCIgfSxcbiAgeyBpY29uOlwiaW1nL1JlYWRMYXRlci5wbmdcIiB9LFxuICB7IGljb246XCJpbWcvUlRvcnJlbnQucG5nXCIgfSxcbiAgeyBpY29uOlwiaW1nL1NsYWNrLnBuZ1wiIH0sXG4gIHsgaWNvbjpcImltZy9UYXBlLnBuZ1wiIH0sXG4gIHsgaWNvbjpcImltZy9UcmVuZC5wbmdcIiB9LFxuICB7IGljb246XCJpbWcvVHViZS5wbmdcIiB9LFxuICB7IGljb246XCJpbWcvVHdpdHRlci5wbmdcIiB9LFxuICB7IGljb246XCJpbWcvV2lraS5wbmdcIiB9XG5dO1xuXG52YXIgZ3JpZE9wdGlvbnMgPSB7XG4gIGNvbHVtbnM6IDcsXG4gIHB1c2hpbmc6IHRydWUsXG4gIGZsb2F0aW5nOiB0cnVlLFxuICBzd2FwcGluZzogdHJ1ZSxcbiAgd2lkdGg6ICdhdXRvJyxcbiAgY29sV2lkdGg6ICdhdXRvJyxcbiAgcm93SGVpZ2h0OiAnbWF0Y2gnLFxuICBtYXJnaW5zOiBbMTAsIDEwXSxcbiAgb3V0ZXJNYXJnaW46IHRydWUsXG4gIHNwYXJzZTogZmFsc2UsXG4gIGlzTW9iaWxlOiBmYWxzZSxcbiAgbW9iaWxlQnJlYWtQb2ludDogNjAwLFxuICBtb2JpbGVNb2RlRW5hYmxlZDogZmFsc2UsXG4gIGRlZmF1bHRTaXplWDogMSxcbiAgZGVmYXVsdFNpemVZOiAxLFxuICByZXNpemFibGU6IHtcbiAgICBlbmFibGVkOiBmYWxzZSxcbiAgfSxcbiAgZHJhZ2dhYmxlOiB7XG4gICAgZW5hYmxlZDogZmFsc2UsXG4gICAgc3RvcDogZnVuY3Rpb24oZXZlbnQsICRlbGVtZW50LCB3aWRnZXQpIHtcbiAgICAgIGNvbnNvbGUubG9nKCRlbGVtZW50LnNjb3BlKCkuZ3JpZHN0ZXIuZ3JpZCk7XG4gICAgICAvLyBjb25zb2xlLmxvZygkZWxlbWVudC5zY29wZSgpLmdyaWRzdGVyLmdyaWQpO1xuICAgIH1cbiAgfVxufTtcblxuXG52YXIgZ3JpZHN0ZXJNb2RhbE9wdGlvbnMgPSB7XG4gIGNvbHVtbnM6IDYsXG4gIHB1c2hpbmc6IHRydWUsXG4gIGZsb2F0aW5nOiB0cnVlLFxuICBzd2FwcGluZzogdHJ1ZSxcbiAgd2lkdGg6ICdhdXRvJyxcbiAgY29sV2lkdGg6ICdhdXRvJyxcbiAgcm93SGVpZ2h0OiAnbWF0Y2gnLFxuICBtYXJnaW5zOiBbMTAsIDEwXSxcbiAgb3V0ZXJNYXJnaW46IHRydWUsXG4gIHNwYXJzZTogZmFsc2UsXG4gIGlzTW9iaWxlOiBmYWxzZSxcbiAgbW9iaWxlQnJlYWtQb2ludDogNjAwLFxuICBtb2JpbGVNb2RlRW5hYmxlZDogZmFsc2UsXG4gIG1pbkNvbHVtbnM6IDEsXG4gIG1pblJvd3M6IDEsXG4gIG1heFJvd3M6IDEwMCxcbiAgZGVmYXVsdFNpemVYOiAxLFxuICBkZWZhdWx0U2l6ZVk6IDEsXG4gIG1pblNpemVYOiAxLFxuICBtYXhTaXplWDogbnVsbCxcbiAgbWluU2l6ZVk6IDEsXG4gIG1heFNpemVZOiBudWxsLFxuICByZXNpemFibGU6IHtcbiAgICBlbmFibGVkOiBmYWxzZSxcbiAgICBoYW5kbGVzOiBbJ24nLCAnZScsICdzJywgJ3cnLCAnbmUnLCAnc2UnLCAnc3cnLCAnbncnXSxcbiAgICBzdGFydDogZnVuY3Rpb24oZXZlbnQsICRlbGVtZW50LCB3aWRnZXQpIHt9LFxuICAgIHJlc2l6ZTogZnVuY3Rpb24oZXZlbnQsICRlbGVtZW50LCB3aWRnZXQpIHt9LFxuICAgIHN0b3A6IGZ1bmN0aW9uKGV2ZW50LCAkZWxlbWVudCwgd2lkZ2V0KSB7fVxuICB9LFxuICBkcmFnZ2FibGU6IHtcbiAgICBlbmFibGVkOiBmYWxzZSxcbiAgICBoYW5kbGU6ICcubXktY2xhc3MnLFxuICAgIHN0YXJ0OiBmdW5jdGlvbihldmVudCwgJGVsZW1lbnQsIHdpZGdldCkge30sXG4gICAgZHJhZzogZnVuY3Rpb24oZXZlbnQsICRlbGVtZW50LCB3aWRnZXQpIHt9LFxuICAgIHN0b3A6IGZ1bmN0aW9uKGV2ZW50LCAkZWxlbWVudCwgd2lkZ2V0KSB7fVxuICB9XG59O1xuXG5cbnZhciBjYWxjR3JpZE9wdGlvbnMgPSB7XG4gIGNvbHVtbnM6IDYsXG4gIHB1c2hpbmc6IHRydWUsXG4gIGZsb2F0aW5nOiB0cnVlLFxuICBzd2FwcGluZzogdHJ1ZSxcbiAgd2lkdGg6ICdhdXRvJyxcbiAgY29sV2lkdGg6ICdhdXRvJyxcbiAgcm93SGVpZ2h0OiAnbWF0Y2gnLFxuICBtYXJnaW5zOiBbOSwgOV0sXG4gIG91dGVyTWFyZ2luOiB0cnVlLFxuICBzcGFyc2U6IGZhbHNlLFxuICBpc01vYmlsZTogZmFsc2UsXG4gIG1vYmlsZUJyZWFrUG9pbnQ6IDYwMCxcbiAgbW9iaWxlTW9kZUVuYWJsZWQ6IGZhbHNlLFxuICBkZWZhdWx0U2l6ZVg6IDEsXG4gIGRlZmF1bHRTaXplWTogMSxcbiAgcmVzaXphYmxlOiB7XG4gICAgZW5hYmxlZDogZmFsc2UsXG4gIH0sXG4gIGRyYWdnYWJsZToge1xuICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgIHN0b3A6IGZ1bmN0aW9uKGV2ZW50LCAkZWxlbWVudCwgd2lkZ2V0KSB7XG4gICAgICBjb25zb2xlLmxvZygkZWxlbWVudC5zY29wZSgpLmdyaWRzdGVyLmdyaWQpO1xuICAgICAgLy8gY29uc29sZS5sb2coJGVsZW1lbnQuc2NvcGUoKS5ncmlkc3Rlci5ncmlkKTtcbiAgICB9XG4gIH1cbn07XG5cblxuKGZ1bmN0aW9uICgpIHtcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnbmVydmVDZW50ZXInKVxuICAgIC5mYWN0b3J5KCduY0NhbGNCdXR0b25zJywgbmNDYWxjQnV0dG9ucyk7XG5cbiAgZnVuY3Rpb24gbmNDYWxjQnV0dG9ucygpIHtcbiAgICB2YXIgZmFjdG9yeSA9IHt9O1xuXG4gICAgZmFjdG9yeS5kaWdpdHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgYnV0dG9uS2V5cyA9IFsgXG4gICAgICAgICc3JywnOCcsJzknLCcwJywnYycsJzwtJyxcbiAgICAgICAgJzQnLCc1JywnNicsJy4nLCctJywnKycsXG4gICAgICAgICcxJywnMicsJzMnLCc9JywnLycsJyonXG4gICAgICBdO1xuXG4gICAgICB2YXIgbGVuID0gYnV0dG9uS2V5cy5sZW5ndGggLSAxO1xuXG4gICAgICB2YXIgaTtcbiAgICAgIHZhciBidXR0b25zID0gW107XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPD0gbGVuOyBpKyspIHtcbiAgICAgICAgbmV3T2JqID0ge307XG4gICAgICAgIG5ld09iai5rZXkgPSBidXR0b25LZXlzW2ldO1xuICAgICAgICBuZXdPYmouY29sID0gTWF0aC5mbG9vcigoaSsxKS82KTtcbiAgICAgICAgbmV3T2JqLnJvdyA9IGkgLSAoNiAqIG5ld09iai5jb2wpO1xuICAgICAgICBidXR0b25zLnB1c2gobmV3T2JqKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGJ1dHRvbnM7XG4gICAgfVxuICAgIHJldHVybiBmYWN0b3J5O1xuICB9XG5cbn0pKCk7XG5cblxuKGZ1bmN0aW9uICgpIHtcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnbmVydmVDZW50ZXInKVxuICAgIC5jb250cm9sbGVyKCduY0NhbGNDdHJsJywgbmNDYWxjQ3RybCk7XG5cbiAgZnVuY3Rpb24gbmNDYWxjQ3RybCgkc2NvcGUsIG5jQ2FsY0J1dHRvbnMpIHtcbiAgICAkc2NvcGUub3V0ID0gJyc7XG4gICAgJHNjb3BlLnJlc3VsdCA9IDA7XG4gICAgJHNjb3BlLmNhbGNHcmlkT3B0aW9ucyA9IGNhbGNHcmlkT3B0aW9ucztcblxuICAgICRzY29wZS5kaXNwbGF5ID0gZnVuY3Rpb24gKG51bWJlcikge1xuXG4gICAgICBpZiAoJHNjb3BlLm91dCAhPSAndW5kZWZpbmVkJ1xuICAgICAgICAgICAmJiBudW1iZXIgIT0gJz0nXG4gICAgICAgICAgICYmIG51bWJlciAhPSAnYydcbiAgICAgICAgICAgJiYgbnVtYmVyICE9ICc8LScpIHtcbiAgICAgICAgJHNjb3BlLm91dCA9ICRzY29wZS5vdXQrbnVtYmVyO1xuICAgICAgfVxuXG4gICAgICBpZiAoJHNjb3BlLmNhbGlucHV0ICE9ICcnKSB7XG4gICAgICAgIHN3aXRjaCAobnVtYmVyKSB7XG5cbiAgICAgICAgICBjYXNlICdjJzpcbiAgICAgICAgICAgIC8vQ2FuY2VsXG4gICAgICAgICAgICAvL3Jlc2V0cyBkaXNwbGF5XG4gICAgICAgICAgICAkc2NvcGUub3V0ID0gJyc7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGNhc2UgJzwtJzpcbiAgICAgICAgICAgIC8vQmFja3NwYWNlXG4gICAgICAgICAgICAkc2NvcGUub3V0ID0gICRzY29wZS5vdXQuc2xpY2UoMCwgLTEpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlICc9JzpcbiAgICAgICAgICAgIC8vQ2FsY3VsYXRlXG4gICAgICAgICAgICBpZigkc2NvcGUuY2hlY2tzeW1ib2woJHNjb3BlLm91dCkpe1xuICAgICAgICAgICAgICAkc2NvcGUub3V0ID0gZXZhbCgkc2NvcGUub3V0KS50b1N0cmluZygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qIFxuICAgIENoZWNrIHdoZXRoZXIgdGhlIHN0cmluZyBjb250YWlucyBhIHJlc3RyaWN0ZWQgY2hhcmF0ZXJcbiAgICBpbiBmaXJzdCBvciBsYXN0IHBvc3Rpb25cbiAgICBAcGFyYW0gc3RyaW5nIG51bWJlclxuICAgICovXG4gICAgJHNjb3BlLmNoZWNrc3ltYm9sID0gZnVuY3Rpb24gKG51bWJlcikge1xuICAgICAgdmFyIG5vdGFsbG93ID0gWycrJywnLScsJy8nLCcqJywnLicsJyddO1xuICAgICAgaWYgKG5vdGFsbG93LmluZGV4T2YobnVtYmVyLnNsaWNlKC0xKSk+IC0xIHx8IG5vdGFsbG93LmluZGV4T2YobnVtYmVyLnNsaWNlKDAsMSkpPi0xKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vU2V0IHRoZSBrZXlib2FyZCB2YWx1ZXMgdXNpbmcgdGhlIGZhY3RvcnkgbWV0aG9kLiAgXG4gICAgJHNjb3BlLm15a2V5cyA9IG5jQ2FsY0J1dHRvbnMuZGlnaXRzKCk7XG5cbiAgfVxufSkoKTtcblxuXG4oZnVuY3Rpb24gKCkge1xuXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCduZXJ2ZUNlbnRlcicpXG4gICAgLmRpcmVjdGl2ZSgnbmNDYWxjJywgbmNDYWxjKTtcblxuICBmdW5jdGlvbiBuY0NhbGMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnQUVDJyxcbiAgICAgIGNvbnRyb2xsZXI6ICduY0NhbGNDdHJsJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnL2Rhc2hib2FyZC9uYy1jYWxjL25jLWNhbGMudGVtcGxhdGUuaHRtbCdcbiAgICAgIC8vIHRlbXBsYXRlOiAnPGRpdiAgY2xhc3M9XCJjYWxjdWxhdG9yXCI+J1xuICAgICAgLy8gICAgICAgICAgICsnPGRpdiBjbGFzcz1cInU0IGRpc3BsYXlcIj4nXG4gICAgICAvLyAgICAgICAgICAgKyc8ZGl2IGNsYXNzPVwiZGlzcGxheS1pbm5lclwiPnt7b3V0fX08L2Rpdj4nXG4gICAgICAvLyAgICAgICAgICAgKyc8L2Rpdj4nXG4gICAgICAvLyAgICAgICAgICAgKyc8YnV0dG9uIG5nLXJlcGVhdD1cImNhbGtleSBpbiBteWtleXMgdHJhY2sgYnkgJGluZGV4XCIgbmctY2xpY2s9XCJkaXNwbGF5KGNhbGtleSlcIiAnXG4gICAgICAvLyAgICAgICAgICAgKyduZy1jbGFzcz1cIntcXCd1MlxcJzogY2Fsa2V5ID09IFxcJzBcXCcgfHwgY2Fsa2V5ID09IFxcJzwtXFwnLCBcXCdidXR0b24tYmx1ZVxcJyA6IGNhbGtleSA9PSBcXCc9XFwnICwgXFwnYnV0dG9uLXJlZFxcJyA6IGNhbGtleSA9PSBcXCdjXFwnIH1cIidcbiAgICAgIC8vICAgICAgICAgICArJ2NsYXNzPVwidTEgYnV0dG9uIGJ1dHRvbi1ncmF5XCIgPidcbiAgICAgIC8vICAgICAgICAgICArJzxkaXYgbmctaWY9XCJjYWxrZXkhPVxcJzwtXFwnXCI+e3tjYWxrZXl9fTwvZGl2PidcbiAgICAgIC8vICAgICAgICAgICArJzxkaXYgbmctaWY9XCJjYWxrZXk9PVxcJzwtXFwnXCI+QjwvZGl2PidcbiAgICAgIC8vICAgICAgICAgICArJzwvYnV0dG9uPidcbiAgICAgIC8vICAgICAgICAgICArJzwvZGl2PidcbiAgICAgIC8vICAgICAgICAgICArJzwvZGl2PidcbiAgICB9XG4gIH1cbn0pKCk7XG5cblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLm1pbi5qcy5tYXBcbiJdfQ==
