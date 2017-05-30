(function () {

  angular
    .module('nerveCenter')
    .directive('ngCalc', ngCalc);

  function ngCalc() {
    return {
      restrict: 'AE',
      controller: 'ngCalcCtrl',
      templateUrl: "ng-calc.templte.html"
    }
  };

  angular
    .module('nerveCenter')
    .controller('ngCalcCtrl', ngCalcCtrl);

  function ngCalcCtrl() {
    $scope.out     = '';
    $scope.result  = 0;
    //display function. click 
    $scope.display = function (number){

      if($scope.out!='undefined' && number!='=' && number!='c' && number!='<-'){
        $scope.out = $scope.out+number;
      }

      if($scope.calinput!=''){
        switch(number){

          case 'c':
            //Cancel /reset the display
            $scope.out = '';
            break;

          case '<-':
            //Backspace operation 
            $scope.out =  $scope.out.slice(0, -1);
            break;

          case '=':
            //do calculation 
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
    in first or last postion .
    @param strin number
    */
    $scope.checksymbol = function (number){

      var notallow = ['+','-','/','*','.',''] ;
      if(notallow.indexOf(number.slice(-1))> -1 || notallow.indexOf(number.slice(0,1))>-1){
        return false;
      }
      return true;

    }

    //Set the keyboard values using the factory method.  
    $scope.mykeys = MathNumbers.calcnumbers();

  };


/*
 Register factory method to set keypads to the calculator.
 */

myApp.factory('MathNumbers', function() {
  var factory = {};

  factory.calcnumbers = function() {
    var numbs =  [ 'c','<-','/',
      '7','8','9','+',
      '4','5','6','-',
      '1','2','3','*',
      '0','.','='];

    return numbs;
  }
  return factory;
}); 

})();
