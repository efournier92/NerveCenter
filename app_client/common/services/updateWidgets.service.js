(function () {

  angular
  .module('nerveCenter')
  .service('getWidgets', getWidgets);

function getWidgets(ngResource, globalsService) {
    var widgetsResource = ngResource("/api/profile/:action", {},
    {
        "put": {"method": "PUT", "params": {"action": "Put"} }
    });
    return configResource;
};

})();
