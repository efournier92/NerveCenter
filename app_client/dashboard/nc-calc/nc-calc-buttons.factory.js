(function () {

  angular
    .module('nerveCenter')
    .factory('ncCalcButtons', ncCalcButtons);

  function ncCalcButtons() {
    var factory = {};

    factory.digits = function () {
      var buttonKeys = [ 
        '7','8','9','0','c','<',
        '4','5','6','.','-','+',
        '1','2','3','=','/','*'
      ];

      var isSpecialKey = new RegExp("[c|<]");
      var isOperatorKey = new RegExp("([+|=|/|-])");
      var buttons = [];
      var len = buttonKeys.length - 1;
      var i;

      for (i = 0; i <= len; i++) {
        newObj = {};
        newObj.key = buttonKeys[i];
        newObj.col = Math.floor((i + 1) / 6);
        newObj.row = i - (6 * newObj.col);

        if (isSpecialKey(newObj.key)) {
          newObj.type = 'specialKey';
        } else if (isOperatorKey(newObj.key)) {
          newObj.type = 'operatorKey';
        } else {
          newObj.type = 'digitKey';
        }

        buttons.push(newObj);
      }

      return buttons;
    }
    return factory;
  }

})();

