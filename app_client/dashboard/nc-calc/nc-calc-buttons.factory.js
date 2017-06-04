(function () {

  angular
    .module('nerveCenter')
    .factory('ncCalcButtons', ncCalcButtons);

  function ncCalcButtons() {
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
  }
})();

