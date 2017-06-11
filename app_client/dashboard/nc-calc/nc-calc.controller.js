(function () {

  angular
    .module('nerveCenter')
    .controller('ncCalcCtrl', ncCalcCtrl);

  function ncCalcCtrl($scope, $window, ncCalcButtons) {
    $scope.out = '';
    $scope.result = 0;
    $scope.calcGridOptions = calcGridOptions;

    $scope.display = function (number) {

      if ($scope.out != 'undefined'
           && number != '='
           && number != 'c'
           && number != '<-') {
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
    $scope.mykeys = ncCalcButtons.digits();

    function updateCalKeyHeight() {
      var divHeight = angular.element('#widget-icon').height()
      var calcRowHeight = divHeight / 4;
      $scope.calcGridOptions.rowHeight = calcRowHeight;
      var calcDisplay = document.getElementsByClassName('u4');
      calcDisplay = angular.element(calcDisplay);
      calcRowHeight = calcRowHeight + 'px';
      calcDisplay.css('height', calcRowHeight);
    }

    angular.element($window).bind('resize', function ($scope) {
      var calKey = document.getElementsByClassName("cal-key")[0];
      x = angular.element(calKey);
      updateCalKeyHeight();
      console.log("CALKEY!")
      // var oldWidth = $dshBrd.currentWidth;
      // var oldSize = $dshBrd.lastScreenSize;
      // var newWidth = $window.outerWidth;
      // var newSize = inputScreenSize(newWidth);

      // if (oldSize !== newSize) {
      //   $location.path('dashboard.view');
      // }

      // $dshBrd.lastScreenSize = newSize;
    });

  };

})();

