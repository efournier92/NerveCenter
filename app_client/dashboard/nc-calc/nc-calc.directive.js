(function () {

  angular
    .module('nerveCenter')
    .directive('ncCalc', ncCalc);

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
    }
  }
})();

