(function () {

  angular
    .module('nerveCenter')
    .factory('ncCalcButtons', ncCalcButtons);

  function ncCalcButtons() {
    var factory = {};

    factory.digits = function () {
      var buttonKeys = [ 
        '7','8','9','0','c','<-',
        '4','5','6','.','-','+',
        '1','2','3','=','/','*'
      ];

      var len = buttonKeys.length - 1;

      var i;
      var buttons = [];

      var isDigitKey = new RegExp("[0-9]");
      var isOperatorKey = new RegExp("[0-9]");
      var isSpecialKey = new RegExp("[0-9]");

      for (i = 0; i <= len; i++) {
        newObj = {};
        newObj.key = buttonKeys[i];
        newObj.col = Math.floor((i+1)/6);
        newObj.row = i - (6 * newObj.col);


        if (buttonKeys[i] === ) {

        }

        buttons.push(newObj);
      }

      return buttons;
    }
    return factory;
  }

})();

