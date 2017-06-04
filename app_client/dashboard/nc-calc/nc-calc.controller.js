(function () {

  angular
    .module('nerveCenter')
    .controller('ncCalc', ncCalc);

  function ncCalc() {
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
  }
})();

