var ngCalc = angular.module('ng-calc', []);

ngCalc.directive('calculator', function () {
  return {
    restrict: 'E',
    controller: 'ngCalcCtrl',
    template: '<div  class="calculator">'
              +'<div class="u4 display">'
              +'<div class="display-inner">{{out}}</div>'
              +'</div>'
              +'<button ng-repeat="calkey in mykeys track by $index" ng-click="display(calkey)" '
              +'ng-class="{\'u2\': calkey == \'0\' || calkey == \'<-\', \'button-blue\' : calkey == \'=\' , \'button-red\' : calkey == \'c\' }"'
              +'class="u1 button button-gray" >'
              +'<div ng-if="calkey!=\'<-\'">{{calkey}}</div>'
              +'<div ng-if="calkey==\'<-\'">B</div>'
              +'</button>'
              +'</div>'
              +'</div>'
  }
});

ngCalc.controller('ngCalcCtrl', function ($scope,buttonFactory) {

  $scope.out = '';
  $scope.result = 0;

  $scope.display = function (number) {

    if ($scope.out != 'undefined' && number != '=' && number != 'c' && number != '<-') {
      $scope.out = $scope.out+number;
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
          $scope.out =  $scope.out.slice(0, -1);
          break;

        case '=':
          //Calculate
          if($scope.checksymbol($scope.out)){
            $scope.out = eval($scope.out).toString();
          }
          break;

        default:
          break
      }
    }
  }

  /* 
    Check whether the string contains a restricted charater
    in first or last postion
    @param string number
    */
  $scope.checksymbol = function (number) {
    var notallow = ['+','-','/','*','.',''];
    if (notallow.indexOf(number.slice(-1))> -1 || notallow.indexOf(number.slice(0,1))>-1) {
      return false;
    }
    return true;
  }

  //Set the keyboard values using the factory method.  
  $scope.mykeys = buttonFactory.digits();

});

ngCalc.factory('buttonFactory', function () {
  var factory = {};

  factory.digits = function () {
    var numbs = [ 
      '7','8','9','0','c','<-',
      '4','5','6','.','-','+',
      '1','2','3','=','/','*'
    ];
    return numbs;
  }
  return factory;
}); 

