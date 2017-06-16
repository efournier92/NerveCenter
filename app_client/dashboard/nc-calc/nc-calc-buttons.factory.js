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
        var keyObj = {};
        keyObj.key = buttonKeys[i];
        keyObj.col = Math.floor((i + 1) / 6);
        keyObj.row = i - (6 * keyObj.col);

        if (isSpecialKey(keyObj.key)) {
          keyObj.type = 'specialKey';
        } else if (isOperatorKey(keyObj.key)) {
          keyObj.type = 'operatorKey';
        } else {
          keyObj.type = 'digitKey';
        }

        buttons.push(keyObj);
      }

      return buttons;
    }
    return factory;
  }

})();

