(function () {

  angular
  .module('nerveCenter')
  .service('getWidgets', getWidgets);

function getWidgets(ngResource, globalsService) {
    var widgetsResource = ngResource("/api/config/:action", {},
    {
        "get": {"method": "GET", "params": {"action": "Get"} }
    });
    return configResource;
};

})();
