(function () {

  angular
    .module('nerveCenter')
    .controller('ncCalcCtrl', ncCalcCtrl);

  function ncCalcCtrl($scope, $window, ncCalcButtons) {

    $scope.calcGridOptions = calcGridOptions;
    $scope.result = 0;
    $scope.out = '0';
    updateCalcKeyHeight();

    $scope.display = function (number) {

      if ($scope.out != 'undefined'
        && number != '='
        && number != 'c'
        && number != '<') {
        $scope.out = 
          $scope.out === '0' 
          ? number
          : $scope.out + number;
      }

      if ($scope.calcInput != '') {
        switch (number) {

          case 'c':
            //reset display
            $scope.out = '0';
            break;

          case '<':
            //backspace
            $scope.out = $scope.out.slice(0, -1);
            break;

          case '=':
            //calculate
            if ($scope.checksymbol($scope.out)) {
              $scope.out = eval($scope.out).toString();
            }
            break;

          default:
            break
        }
      }
    }

    $scope.checksymbol = function (number) {
      // check if string contains a restricted charater
      var notallow = ['+','-','/','*','.',''];
      if (notallow.indexOf(number.slice(-1))> -1 || notallow.indexOf(number.slice(0,1))>-1) {
        return false;
      }
      return true;
    }

    $scope.allCalcKeys = ncCalcButtons.digits();
    $scope.type = true;

    function updateCalcKeyHeight() {
      var divHeight = angular.element('#widget-icon').height()
      var calcRowHeight = divHeight / 4.25;
      var calcKeyFontHeight = divHeight / 10;
      var calcDisplayFontHeight = divHeight / 6;
      $scope.calcGridOptions.rowHeight = calcRowHeight;

      var calcDisplay = document.getElementsByClassName('calc-key');
      calcDisplay = angular.element(calcDisplay);
      calcDisplay.css('height', calcRowHeight);
      calcDisplay.css('font-size', calcKeyFontHeight);

      var calcDisplayFont = document.getElementsByClassName('display-inner');
      calcDisplayFont = angular.element(calcDisplayFont);
      calcDisplayFont.css('font-size', calcDisplayFontHeight);
    }

    angular.element($window).bind('resize', function ($scope) {
      setTimeout(updateCalcKeyHeight, 250);
    });

  };

})();

